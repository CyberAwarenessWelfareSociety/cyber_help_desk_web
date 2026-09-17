import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { Link, useParams } from "react-router-dom";
import {
  PlayCircle,
  FileText,
  MessageCircle,
  Loader2,
  CheckCircle2,
  Clock3,
  SkipForward,
  Lock,
} from "lucide-react";

import { useGetVideosByClassQuery } from "@/store/api/video";
import {
  useGetMyProgressForClassQuery,
  useUpsertVideoProgressMutation,
  useCompleteVideoMutation,
  useSkipVideoMutation,
} from "@/store/api/video"; // ✅ same file if you exported there

import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/reducer/auth";
import Header from "@/components/Home/Header";

const formatDuration = (seconds = 0) => {
  const m = Math.floor(seconds / 60);
  const r = seconds % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const Video = () => {
  const { id } = useParams(); // classId
  const client_id = useSelector(selectCurrentUser)?.id;

  const videoRef = useRef(null);
  const lastSentRef = useRef(0);
  const lastActiveVideoRef = useRef(null);

  const { data, isLoading, error } = useGetVideosByClassQuery(
    { classId: id, params: { is_published: true } },
    { skip: !id },
  );

  // ✅ progress list for class
  const { data: classProgressRes, isLoading: progressLoading } =
    useGetMyProgressForClassQuery(
      { classId: id, client_id },
      { skip: !id || !client_id },
    );

  const [upsertProgress, { isLoading: saving }] =
    useUpsertVideoProgressMutation();
  const [completeVideo] = useCompleteVideoMutation();
  const [skipVideo] = useSkipVideoMutation();

  const videos = useMemo(() => {
    const arr = data?.data || [];
    return arr
      .filter((v) => v.is_published !== false)
      .sort((a, b) => (a.order_no || 0) - (b.order_no || 0));
  }, [data]);

  // ✅ map progress by video_id
  const progressMap = useMemo(() => {
    const list = classProgressRes?.data || [];
    const map = new Map();
    list.forEach((row) => {
      if (row?.id) map.set(String(row.id), row?.progress || null);
      // row structure from backend:
      // { id,title,..., progress:{status,last_position,watch_percent,...} }
    });
    return map;
  }, [classProgressRes]);

  const [activeVideoId, setActiveVideoId] = useState(null);

  useEffect(() => {
    if (!activeVideoId && videos.length) {
      // ✅ open first unlocked / first video
      setActiveVideoId(videos[0].id);
    }
  }, [videos, activeVideoId]);

  const activeVideo = useMemo(
    () => videos.find((v) => String(v.id) === String(activeVideoId)),
    [videos, activeVideoId],
  );

  const activeProgress = useMemo(() => {
    if (!activeVideoId) return null;
    return progressMap.get(String(activeVideoId)) || null;
  }, [progressMap, activeVideoId]);

  // =========================================================
  // ✅ Locking logic: if previous video not completed and not skippable -> lock next
  // =========================================================
  const lockedSet = useMemo(() => {
    const locked = new Set();

    for (let i = 0; i < videos.length; i++) {
      const prev = videos[i - 1];
      const current = videos[i];

      if (!prev) continue;

      const prevProg = progressMap.get(String(prev.id));
      const prevStatus = prevProg?.status;
      const prevPct = prevProg?.watch_percent || 0;

      const prevMin =
        typeof prev?.min_watch_percent === "number"
          ? prev.min_watch_percent
          : 80;
      const prevPassed = prevStatus === "COMPLETED" || prevPct >= prevMin;

      // if previous video is NOT completed & NOT skippable -> lock this video
      if (!prevPassed && prev?.is_skippable === false) {
        locked.add(String(current.id));
      }
    }

    return locked;
  }, [videos, progressMap]);

  const isLocked = useCallback(
    (videoId) => lockedSet.has(String(videoId)),
    [lockedSet],
  );

  // =========================================================
  // ✅ Resume playback on video change
  // =========================================================
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !activeVideo) return;

    // prevent redundant seeking
    if (lastActiveVideoRef.current === activeVideo.id) return;
    lastActiveVideoRef.current = activeVideo.id;

    const p = progressMap.get(String(activeVideo.id));
    const lastPos = p?.last_position || 0;

    const onLoaded = () => {
      // seek only if lastPos is valid (and not near end)
      const dur = el.duration || activeVideo?.duration || 0;
      if (lastPos > 3 && dur > 0 && lastPos < dur - 2) {
        el.currentTime = lastPos;
      }
    };

    el.addEventListener("loadedmetadata", onLoaded);
    return () => el.removeEventListener("loadedmetadata", onLoaded);
  }, [activeVideo, progressMap]);

  // =========================================================
  // ✅ Helpers to compute watch percent
  // =========================================================
  const calcPercent = (current, duration) => {
    const dur = Math.max(1, Math.floor(duration || 0));
    const pct = Math.floor((current / dur) * 100);
    return clamp(pct, 0, 100);
  };

  // =========================================================
  // ✅ Send progress (throttled)
  // =========================================================
  const sendProgress = useCallback(
    async ({ force = false } = {}) => {
      const el = videoRef.current;
      if (!el || !activeVideo || !client_id) return;

      const now = Date.now();
      if (!force && now - lastSentRef.current < 7000) return; // 7s throttle
      lastSentRef.current = now;

      const last_position = Math.floor(el.currentTime || 0);
      const duration = Math.floor(el.duration || activeVideo.duration || 0);
      const watch_percent = calcPercent(last_position, duration);

      // watched_seconds: you can approximate using last_position (simple)
      // better is accumulate delta, but this is ok for tracking UI
      const watched_seconds = last_position;

      try {
        await upsertProgress({
          client_id,
          video_id: activeVideo.id,
          last_position,
          watched_seconds,
          watch_percent,
        }).unwrap();
      } catch (e) {
        // silent fail (no toast spam)
      }
    },
    [activeVideo, client_id, upsertProgress],
  );

  // =========================================================
  // ✅ Attach video event listeners
  // =========================================================
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onTimeUpdate = () => sendProgress({ force: false });
    const onPause = () => sendProgress({ force: true });
    const onSeeked = () => sendProgress({ force: true });

    const onEnded = async () => {
      // mark completed on end
      if (activeVideo && client_id) {
        try {
          await completeVideo({
            client_id,
            video_id: activeVideo.id,
          }).unwrap();
        } catch (e) {}
      }
    };

    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("pause", onPause);
    el.addEventListener("seeked", onSeeked);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("seeked", onSeeked);
      el.removeEventListener("ended", onEnded);
    };
  }, [sendProgress, activeVideo, client_id, completeVideo]);

  // =========================================================
  // ✅ Skip button action
  // =========================================================
  const handleSkip = async () => {
    if (!activeVideo?.is_skippable) return;
    if (!client_id) return;

    try {
      await skipVideo({ client_id, video_id: activeVideo.id }).unwrap();

      // auto move to next video after skip
      const idx = videos.findIndex(
        (v) => String(v.id) === String(activeVideo.id),
      );
      const next = videos[idx + 1];
      if (next) setActiveVideoId(next.id);
    } catch (e) {}
  };

  // =========================================================
  // ✅ UI helpers
  // =========================================================
  const getBadge = (v) => {
    const p = progressMap.get(String(v.id));
    const status = p?.status;
    const pct = p?.watch_percent || 0;
    const min =
      typeof v?.min_watch_percent === "number" ? v.min_watch_percent : 80;

    if (status === "COMPLETED" || pct >= min)
      return {
        text: "Completed",
        icon: CheckCircle2,
        className: "bg-emerald-100 text-emerald-700",
      };

    if (status === "SKIPPED")
      return {
        text: "Skipped",
        icon: SkipForward,
        className: "bg-amber-100 text-amber-700",
      };

    if (pct > 0)
      return {
        text: `${pct}%`,
        icon: Clock3,
        className: "bg-blue-100 text-blue-700",
      };

    return null;
  };

  if (isLoading || progressLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load videos
      </div>
    );

  return (
    <>
      <Header />

      <div className="w-full min-h-screen bg-gray-50 mt-25">
        <div className="w-full px-4 md:px-8 xl:px-14 2xl:px-20 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* ================= LEFT (VIDEO) ================= */}
            <div className="xl:col-span-3 space-y-5">
              {/* VIDEO PLAYER */}
              <div className="w-full rounded-3xl overflow-hidden shadow-2xl bg-black relative">
                <video
                  ref={videoRef}
                  key={activeVideo?.video_url}
                  src={activeVideo?.video_url}
                  controls
                  controlsList="nodownload"
                  className="w-full h-[320px] md:h-[500px] xl:h-[640px] object-contain bg-black"
                />

                {/* saving indicator */}
                {saving && (
                  <div className="absolute top-4 right-4 bg-white/90 text-gray-800 text-xs px-3 py-1 rounded-full flex items-center gap-2 shadow">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving progress...
                  </div>
                )}
              </div>

              {/* VIDEO INFO */}
              <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-100">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h1 className="text-2xl xl:text-3xl font-bold text-gray-900">
                      {activeVideo?.title}
                    </h1>

                    <p className="text-gray-500 mt-2">
                      {formatDuration(activeVideo?.duration)} • Order{" "}
                      {activeVideo?.order_no}
                      {activeProgress?.watch_percent != null && (
                        <>
                          {" "}
                          • Progress{" "}
                          <span className="font-semibold">
                            {activeProgress.watch_percent}%
                          </span>
                        </>
                      )}
                    </p>
                  </div>

                  {activeVideo?.is_preview && (
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-4 py-1 rounded-full">
                      Preview
                    </span>
                  )}
                </div>

                {/* DESCRIPTION */}
                {activeVideo?.description && (
                  <p className="mt-4 text-gray-700 leading-relaxed">
                    {activeVideo.description}
                  </p>
                )}

                {/* ACTION CARDS */}
                <div className="grid md:grid-cols-2 gap-5 mt-8">
                  <Link to={`/questions/${id}`}>
                    <div className="group p-5 rounded-2xl border hover:border-purple-500 hover:bg-purple-50 transition cursor-pointer">
                      <div className="flex gap-3 items-center">
                        <MessageCircle className="text-purple-600 group-hover:scale-110 transition" />
                        <div>
                          <p className="font-bold">Take Quiz</p>
                          <p className="text-sm text-gray-500">
                            Test your knowledge after watching
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link to={`/materials/${id}`}>
                    <div className="group p-5 rounded-2xl border hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer">
                      <div className="flex gap-3 items-center">
                        <FileText className="text-blue-600 group-hover:scale-110 transition" />
                        <div>
                          <p className="font-bold">View Materials</p>
                          <p className="text-sm text-gray-500">
                            Download notes & resources
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* WATCH RULE + SKIP */}
                <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-gray-500">
                  <div>
                    Must watch{" "}
                    <span className="font-semibold">
                      {activeVideo?.min_watch_percent ?? 80}%
                    </span>{" "}
                    • Skippable:{" "}
                    <span className="font-semibold">
                      {activeVideo?.is_skippable ? "Yes" : "No"}
                    </span>
                  </div>

                  {activeVideo?.is_skippable && (
                    <button
                      onClick={handleSkip}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-50 text-gray-800 font-semibold"
                    >
                      <SkipForward className="h-4 w-4" />
                      Skip this video
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ================= RIGHT PLAYLIST ================= */}
            <div className="xl:col-span-1">
              <div className="sticky top-6 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-5 border-b font-bold text-lg">
                  Course Playlist
                </div>

                <div className="max-h-[750px] overflow-y-auto">
                  {videos.map((v) => {
                    const active = String(v.id) === String(activeVideoId);
                    const locked = isLocked(v.id);
                    const badge = getBadge(v);

                    const p = progressMap.get(String(v.id));
                    const pct = clamp(p?.watch_percent || 0, 0, 100);

                    return (
                      <button
                        key={v.id}
                        onClick={() => {
                          if (locked) return;
                          setActiveVideoId(v.id);
                        }}
                        className={`w-full flex gap-3 text-left p-4 border-b transition relative
                        ${active ? "bg-emerald-50" : "hover:bg-gray-50"}
                        ${locked ? "opacity-60 cursor-not-allowed" : ""}
                      `}
                      >
                        {/* thumbnail */}
                        <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                          <img
                            src={v.thumbnail}
                            alt={v.title}
                            className="w-full h-full object-cover"
                          />

                          <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                            {locked ? (
                              <Lock className="text-white" />
                            ) : (
                              <PlayCircle className="text-white" />
                            )}
                          </div>

                          {/* progress bar */}
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        {/* text */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-semibold truncate ${
                              active ? "text-emerald-700" : "text-gray-900"
                            }`}
                          >
                            {v.order_no}. {v.title}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {formatDuration(v.duration)}
                          </p>

                          {locked && (
                            <p className="text-xs text-red-600 mt-1">
                              Locked • Complete previous video
                            </p>
                          )}
                        </div>

                        {/* badge */}
                        {badge && (
                          <span
                            className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${badge.className}`}
                          >
                            <badge.icon className="h-3.5 w-3.5" />
                            {badge.text}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* optional footer note */}
          <div className="mt-6 text-xs text-gray-400">
            Progress is auto-saved while you watch.
          </div>
        </div>
      </div>
    </>
  );
};

export default Video;
