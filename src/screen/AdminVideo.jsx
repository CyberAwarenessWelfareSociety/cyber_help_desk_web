"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Home/Header";
import {
  useGetVideosByClassQuery,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
} from "@/store/api/video";
import axios from "axios";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ExternalLink,
  PlayCircle,
} from "lucide-react";

const emptyForm = {
  title: "",
  video_url: "", // ✅ set by upload (no manual input)
  thumbnail: "", // ✅ set by upload (optional)
  duration: 0,
  description: "",
  order_no: 1,
  is_preview: false,
  is_published: true,
  is_skippable: true,
  min_watch_percent: 80,
};

const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const AdminVideo = () => {
  const { id: classId } = useParams();

  // ✅ Admin list (no restriction)
  const {
    data: res,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetVideosByClassQuery({ classId, params: {} }, { skip: !classId });

  const videos = useMemo(() => {
    const arr = res?.data || [];
    return Array.isArray(arr)
      ? [...arr].sort((a, b) => (a.order_no || 0) - (b.order_no || 0))
      : [];
  }, [res]);

  const [createVideo, { isLoading: creating }] = useCreateVideoMutation();
  const [updateVideo, { isLoading: updating }] = useUpdateVideoMutation();
  const [deleteVideo, { isLoading: deleting }] = useDeleteVideoMutation();

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // uploads
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  const openCreate = () => {
    const nextOrder =
      (videos.length ? Math.max(...videos.map((v) => v.order_no || 0)) : 0) + 1;

    setMode("create");
    setEditingId(null);
    setForm({ ...emptyForm, order_no: nextOrder });
    setIsModalOpen(true);
  };

  const openEdit = (v) => {
    setMode("edit");
    setEditingId(v.id);
    setForm({
      title: v.title || "",
      video_url: v.video_url || "",
      thumbnail: v.thumbnail || "",
      duration: toNumber(v.duration, 0),
      description: v.description || "",
      order_no: toNumber(v.order_no, 1),
      is_preview: !!v.is_preview,
      is_published: v.is_published !== false,
      is_skippable: v.is_skippable !== false,
      min_watch_percent:
        typeof v.min_watch_percent === "number" ? v.min_watch_percent : 80,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const openInNewTab = (url) =>
    window.open(url, "_blank", "noopener,noreferrer");

  // =========================
  // ✅ Upload VIDEO (sets form.video_url)
  // =========================
  const uploadVideoFile = async (file) => {
    if (!file) return null;

    if (!file.type?.startsWith("video/")) {
      toast.error("Only video files are allowed");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingVideo(true);

      const res = await axios.post(
        "https://bucket.cyberawareness.ngo/bucket/upload/cybercrime",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

    const url =
      res?.data?.file?.url ||                 // ✅ your current API
      res?.data?.file?.[0]?.url ||            // fallback if API ever returns array
      res?.data?.url;   
      if (!url) {
        toast.error("Upload failed — no URL returned");
        return null;
      }

      setForm((prev) => ({ ...prev, video_url: url }));
      toast.success("Video uploaded");
      return url;
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Video upload failed");
      return null;
    } finally {
      setUploadingVideo(false);
    }
  };

  const onPickVideo = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    await uploadVideoFile(file);
  };

  // =========================
  // ✅ Upload THUMBNAIL (sets form.thumbnail)
  // =========================
  const uploadThumbnail = async (file) => {
    if (!file) return null;

    if (!file.type?.startsWith("image/")) {
      toast.error("Only image files are allowed for thumbnail");
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingThumb(true);

      const res = await axios.post(
        "https://bucket.cyberawareness.ngo/bucket/upload/cybercrime",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

    const url =
      res?.data?.file?.url ||                 // ✅ your current API
      res?.data?.file?.[0]?.url ||            // fallback if API ever returns array
      res?.data?.url;   
      if (!url) {
        toast.error("Upload failed — no URL returned");
        return null;
      }

      setForm((prev) => ({ ...prev, thumbnail: url }));
      toast.success("Thumbnail uploaded");
      return url;
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Thumbnail upload failed");
      return null;
    } finally {
      setUploadingThumb(false);
    }
  };

  const onPickThumbnail = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    await uploadThumbnail(file);
  };

  // ✅ optional: auto duration after upload (best-effort)
  const getVideoDurationFromUrl = async (url) => {
    try {
      const vid = document.createElement("video");
      vid.preload = "metadata";
      vid.src = url;
      return await new Promise((resolve) => {
        vid.onloadedmetadata = () => resolve(Math.floor(vid.duration || 0));
        vid.onerror = () => resolve(0);
      });
    } catch {
      return 0;
    }
  };

  const validate = () => {
    if (!classId) return "Invalid classId";
    if (!form.title?.trim()) return "Title is required";
    if (!form.video_url?.trim()) return "Please upload a video";
    if (!form.order_no || form.order_no < 1) return "Order No must be >= 1";
    const mwp = toNumber(form.min_watch_percent, 80);
    if (mwp < 0 || mwp > 100) return "Min watch percent must be 0-100";
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) return toast.error(err);

    if (uploadingVideo || uploadingThumb) {
      toast.error("Please wait — upload in progress");
      return;
    }

    // If duration not provided, try compute from URL (may fail on CORS)
    let duration = toNumber(form.duration, 0);
    if (!duration && form.video_url) {
      duration = await getVideoDurationFromUrl(form.video_url);
    }

    const payload = {
      class_id: classId,
      title: form.title.trim(),
      video_url: form.video_url.trim(),
      thumbnail: form.thumbnail?.trim() || null,
      duration: duration,
      description: form.description?.trim() || null,
      order_no: toNumber(form.order_no, 1),
      is_preview: !!form.is_preview,
      is_published: !!form.is_published,
      is_skippable: !!form.is_skippable,
      min_watch_percent: toNumber(form.min_watch_percent, 80),
    };

    try {
      if (mode === "create") {
        await createVideo(payload).unwrap();
        toast.success("Video created ✅");
      } else {
        await updateVideo({ id: editingId, ...payload }).unwrap();
        toast.success("Video updated ✅");
      }
      closeModal();
      refetch();
    } catch (e) {
      console.error(e);
      toast.error(e?.data?.message || "Save failed");
    }
  };

  const onDelete = async (videoId) => {
    const ok = window.confirm("Delete this video?");
    if (!ok) return;

    try {
      // ✅ IMPORTANT: delete mutation should accept only id
      await deleteVideo(videoId).unwrap();
      toast.success("Deleted ✅");
      refetch();
    } catch (e) {
      console.error(e);
      toast.error(e?.data?.message || "Delete failed");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-lg text-gray-600 animate-pulse">Loading videos...</div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center text-red-600">
          <div className="text-center">
            <p className="text-lg font-medium">Failed to load videos</p>
            <p className="text-sm mt-2">
              {error?.data?.message || "Please try again later"}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="mt-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Admin • Videos
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Upload videos + manage order, preview, publish & skip rules.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow"
          >
            <Plus size={18} />
            Add Video
          </button>
        </div>

        {/* List */}
        <div className="mt-8 bg-white rounded-3xl border shadow-sm overflow-hidden">
          {videos.length === 0 ? (
            <div className="p-10 text-center text-gray-600">
              No videos yet. Click <b>Add Video</b>.
            </div>
          ) : (
            <div className="divide-y">
              {videos.map((v) => (
                <div
                  key={v.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-28 h-20 rounded-2xl border bg-gray-50 overflow-hidden shrink-0">
                      {v.thumbnail ? (
                        <img
                          src={v.thumbnail}
                          alt={v.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <PlayCircle />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <PlayCircle className="text-white" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {v.order_no}. {v.title}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                        <span className="px-2 py-1 rounded-full bg-gray-100 font-semibold">
                          {v.is_published ? "PUBLISHED" : "UNPUBLISHED"}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 font-semibold">
                          {v.is_preview ? "PREVIEW" : "NORMAL"}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 font-semibold">
                          {v.is_skippable ? "SKIPPABLE" : "NOT SKIPPABLE"}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-gray-100 font-semibold">
                          MIN {v.min_watch_percent ?? 80}%
                        </span>
                      </div>

                      {v.video_url && (
                        <button
                          onClick={() => openInNewTab(v.video_url)}
                          className="mt-2 inline-flex items-center gap-2 text-sm text-blue-700 hover:underline"
                        >
                          <ExternalLink size={16} />
                          Preview video
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(v)}
                      className="px-3 py-2 rounded-xl border hover:bg-blue-50"
                      title="Edit"
                    >
                      <Plus className="hidden" />
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(v.id)}
                      className="px-3 py-2 rounded-xl border hover:bg-red-50"
                      title="Delete"
                      disabled={deleting}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border overflow-hidden pointer-events-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {mode === "create" ? "Add Video" : "Edit Video"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-gray-100"
              >
                <X />
              </button>
            </div>

            <div className="p-6 grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full mt-1 p-3 rounded-xl border"
                  placeholder="Video title"
                />
              </div>

              {/* ✅ Upload Video (NO URL input) */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Upload Video *
                </label>

                <div className="mt-2 flex items-center gap-4">
                  <input
                    id="videoUpload"
                    type="file"
                    accept="video/*"
                    onChange={onPickVideo}
                    disabled={uploadingVideo}
                    className="hidden"
                  />

                  <label
                    htmlFor="videoUpload"
                    className={`inline-flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-semibold cursor-pointer
                    ${
                      uploadingVideo
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {uploadingVideo ? "Uploading..." : "Choose Video File"}
                  </label>

                  {form.video_url ? (
                    <button
                      type="button"
                      onClick={() => openInNewTab(form.video_url)}
                      className="text-blue-700 text-sm font-semibold hover:underline inline-flex items-center gap-2"
                    >
                      <ExternalLink size={16} />
                      Preview Uploaded Video
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">
                      No video uploaded yet
                    </span>
                  )}
                </div>

                {/* show url (readonly) */}
                <input
                  value={form.video_url}
                  readOnly
                  className="w-full mt-3 p-3 rounded-xl border bg-gray-50 text-gray-600"
                  placeholder="Video URL will appear after upload..."
                />
              </div>

              {/* Thumbnail upload */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Thumbnail (upload optional)
                </label>

                <div className="mt-2 flex items-center gap-4">
                  <div className="w-28 h-20 rounded-xl border bg-gray-50 overflow-hidden flex items-center justify-center">
                    {form.thumbnail ? (
                      <img
                        src={form.thumbnail}
                        alt="thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">No image</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <input
                      id="thumbUpload"
                      type="file"
                      accept="image/*"
                      onChange={onPickThumbnail}
                      disabled={uploadingThumb}
                      className="hidden"
                    />

                    <label
                      htmlFor="thumbUpload"
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-xl border text-sm font-semibold cursor-pointer
                      ${
                        uploadingThumb
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {uploadingThumb ? "Uploading..." : "Choose Thumbnail"}
                    </label>

                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, thumbnail: "" }))}
                      disabled={!form.thumbnail || uploadingThumb}
                      className="px-4 py-2 rounded-xl border hover:bg-gray-50 text-sm font-semibold disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, duration: toNumber(e.target.value, 0) }))
                  }
                  className="w-full mt-1 p-3 rounded-xl border"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Order No *
                </label>
                <input
                  type="number"
                  value={form.order_no}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, order_no: toNumber(e.target.value, 1) }))
                  }
                  className="w-full mt-1 p-3 rounded-xl border"
                  min={1}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="w-full mt-1 p-3 rounded-xl border min-h-[110px]"
                  placeholder="Optional description..."
                />
              </div>

              {/* Toggles */}
              <div className="md:col-span-2 p-4 rounded-2xl border bg-gray-50">
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, is_published: e.target.checked }))
                      }
                    />
                    <span className="text-sm font-semibold">Published</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.is_preview}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, is_preview: e.target.checked }))
                      }
                    />
                    <span className="text-sm font-semibold">Preview</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.is_skippable}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, is_skippable: e.target.checked }))
                      }
                    />
                    <span className="text-sm font-semibold">Skippable</span>
                  </label>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Min Watch %
                    </label>
                    <input
                      type="number"
                      value={form.min_watch_percent}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          min_watch_percent: toNumber(e.target.value, 80),
                        }))
                      }
                      min={0}
                      max={100}
                      className="w-full mt-1 p-3 rounded-xl border"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-5 py-3 rounded-2xl border hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={onSubmit}
                disabled={creating || updating || uploadingVideo || uploadingThumb}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 disabled:opacity-60"
              >
                <Save size={18} />
                {creating || updating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminVideo;
