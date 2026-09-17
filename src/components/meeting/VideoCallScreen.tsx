import { useState, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { io } from "socket.io-client";

import TopBar from "./TopBar";
import ControlBar from "./ControlBar";
import VideoGrid from "./VideoGrid";
import ParticipantVideo from "./ParticipantVideo";
import ChatPanel from "./ChatPanel";
import ParticipantsPanel from "./ParticipantsPanel";
import ScreenShareModal, {
  ScreenSharePreview,
  PictureInPicture,
} from "./ScreenShareModal";
import { defaultBackgrounds } from "./VirtualBackgroundSelector";
import WaitingParticipantsPanel from "./WaitingParticipantsPanel";
import BreakoutRoomsPanel from "./BreakoutRoomsPanel";
import PollsPanel from "./PollsPanel";
import WhiteboardPanel from "./WhiteboardPanel";
import ReactionsDisplay from "./ReactionsDisplay";
import TimerPanel from "./TimerPanel";
import CaptionsDisplay from "./CaptionsDisplay";
import HandRaiseQueue from "./HandRaiseQueue";
import QAPanel from "./QAPanel";
import QADisplay from "./QADisplay";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { usePictureInPicture } from "@/hooks/usePictureInPicture";
import { useSelector } from "react-redux";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8600";

const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },

    {
      urls: "turn:cyberawareness.ngo:3478?transport=udp",
      username: "turnuser",
      credential: "TURN_STRONG_PASSWORD",
    },
    {
      urls: "turn:cyberawareness.ngo:3478?transport=tcp",
      username: "turnuser",
      credential: "TURN_STRONG_PASSWORD",
    },
    {
      urls: "turns:cyberawareness.ngo:5349?transport=tcp",
      username: "turnuser",
      credential: "TURN_STRONG_PASSWORD",
    },
  ],
};

const VideoCallScreen = ({
  isHost = false,
  meetingCode,
  onEndCall,
  initialMuted = false,
  initialCameraOff = false,
}) => {
  const videoGridRef = useRef(null);
  const { isPiPActive, isPiPSupported, togglePiP } = usePictureInPicture();

  // Force dark theme (optional – remove if you already handle theme globally)
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => document.documentElement.classList.remove("dark");
  }, []);

  // =======================
  // Auth / User (replace later with real auth)
  // =======================
  const currentUserName = useSelector((state) => state.auth?.user?.name);
  // console.log("User Name:", user);
  // const currentUserName = localStorage.getItem("name") || "You";
  const currentUserAvatar = localStorage.getItem("avatar") || null;

  // ✅ Decide role (replace with real role from your system)

  const role = isHost ? "instructor" : "student";
  const defaultMuted = !isHost; // student -> true, host -> false
  const defaultCameraOff = !isHost; // student -> true, host -> false
  // =======================
  // UI States
  // =======================
  const [isMuted, setIsMuted] = useState(isHost ? initialMuted : true);
  const [isCameraOff, setIsCameraOff] = useState(
    isHost ? initialCameraOff : true,
  );

  const [isNoiseSuppression, setIsNoiseSuppression] = useState(false);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const hasRequestedJoinRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [meetingStartTime] = useState(new Date());

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isWaitingRoomOpen, setIsWaitingRoomOpen] = useState(false);
  const [isBreakoutRoomsOpen, setIsBreakoutRoomsOpen] = useState(false);
  const [isPollsOpen, setIsPollsOpen] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCaptionsOpen, setIsCaptionsOpen] = useState(false);
  const [isCaptionsVisible, setIsCaptionsVisible] = useState(true);

  const [isHandRaiseQueueOpen, setIsHandRaiseQueueOpen] = useState(false);
  const [handRaiseQueue, setHandRaiseQueue] = useState([]);

  const [currentSpeakerId, setCurrentSpeakerId] = useState(null);
  const [spotlightedParticipantIds, setSpotlightedParticipantIds] = useState(
    [],
  );

  const [isMeetingLocked, setIsMeetingLocked] = useState(false);

  const [isBreakoutActive, setIsBreakoutActive] = useState(false);
  const [breakoutRooms, setBreakoutRooms] = useState([]);

  const [polls, setPolls] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isQAOpen, setIsQAOpen] = useState(false);

  const [viewMode, setViewMode] = useState("grid");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isLocalPiPVisible, setIsLocalPiPVisible] = useState(true);

  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const [reactions, setReactions] = useState([]);

  const [isScreenShareModalOpen, setIsScreenShareModalOpen] = useState(false);
  const [screenShareStream, setScreenShareStream] = useState(null);
  const [isScreenShareSidebarCollapsed, setIsScreenShareSidebarCollapsed] =
    useState(false);

  const [selectedBackground, setSelectedBackground] = useState(
    defaultBackgrounds[0],
  );
  const [isBackgroundProcessing, setIsBackgroundProcessing] = useState(false);

  const [waitingParticipants, setWaitingParticipants] = useState([]);
  const [messages, setMessages] = useState([]);

  const [currentUserId, setCurrentUserId] = useState(null);

  // =======================
  // Participants (REAL)
  // =======================
  const [participants, setParticipants] = useState([]);
  const [speakingTimes, setSpeakingTimes] = useState([]);
  const [screenPresenterId, setScreenPresenterId] = useState(null);
  const [screenPresenterName, setScreenPresenterName] = useState(null);
  const [instructorDisconnected, setInstructorDisconnected] = useState(false);
  const [instructorCountdown, setInstructorCountdown] = useState(180); // 3 min
  const [isMicAllowed, setIsMicAllowed] = useState(isHost);
  // =======================
  // Recording (REAL: Canvas + Mixed Audio)
  // =======================
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordCanvasRef = useRef(null);
  const drawRafRef = useRef(null);
  const audioCtxRef = useRef(null);
  const audioDestRef = useRef(null);
  const recordStreamRef = useRef(null);

  // Offscreen video elements for canvas rendering
  const videoElsRef = useRef(new Map()); // id -> HTMLVideoElement

  const ensureVideoEl = (id, stream) => {
    if (!stream) return null;

    let el = videoElsRef.current.get(id);
    if (!el) {
      el = document.createElement("video");
      el.muted = true; // prevent echo
      el.playsInline = true;
      el.autoplay = true;
      el.style.position = "fixed";
      el.style.left = "-99999px";
      el.style.top = "-99999px";
      el.width = 640;
      el.height = 360;
      document.body.appendChild(el);
      videoElsRef.current.set(id, el);
    }

    if (el.srcObject !== stream) el.srcObject = stream;
    el.play?.().catch(() => {});
    return el;
  };

  const cleanupVideoEls = () => {
    videoElsRef.current.forEach((el) => {
      try {
        el.pause?.();
        el.srcObject = null;
        el.remove?.();
      } catch {}
    });
    videoElsRef.current.clear();
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Build one mixed audio track from multiple streams (local + remotes + screen share audio)
  const buildMixedAudioTrack = (streams) => {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;

      // close any previous ctx (defensive)
      try {
        audioCtxRef.current?.close?.();
      } catch {}

      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const dest = ctx.createMediaStreamDestination();
      audioDestRef.current = dest;

      streams.forEach((s) => {
        try {
          if (!s) return;
          const tracks = s.getAudioTracks?.() || [];
          if (!tracks.length) return;

          const source = ctx.createMediaStreamSource(s);
          source.connect(dest);
        } catch {}
      });

      return dest.stream.getAudioTracks()[0] || null;
    } catch (e) {
      console.error("Audio mix failed:", e);
      return null;
    }
  };

  // Create canvas capture stream (video) + mixed audio
  const buildRecordingStream = () => {
    const canvas = document.createElement("canvas");
    recordCanvasRef.current = canvas;

    canvas.width = 1280;
    canvas.height = 720;

    const ctx = canvas.getContext("2d");

    // Collect streams to render
    const streamEntries = [];

    // If presenting (local screen share or remote presenter), put presenter first
    if (presenting?.stream) {
      streamEntries.push({
        id: presenting.presenterId || "presenter",
        name: presenting.isLocal ? "You" : presenting.name || "Presenter",
        stream: presenting.stream,
        isPresenter: true,
      });

      participants
        .filter((p) => p.id !== presenting.presenterId)
        .forEach((p) => {
          if (p.stream) {
            streamEntries.push({
              id: p.id,
              name: p.name,
              stream: p.stream,
              isPresenter: false,
            });
          }
        });
    } else {
      // No presenting: record full grid of all with stream
      participants.forEach((p) => {
        if (p.stream) {
          streamEntries.push({
            id: p.id,
            name: p.name,
            stream: p.stream,
            isPresenter: false,
          });
        }
      });
    }

    // Ensure offscreen video elements
    const videos = streamEntries
      .map((e) => ({
        ...e,
        el: ensureVideoEl(e.id, e.stream),
      }))
      .filter((x) => x.el);

    const draw = () => {
      // background
      ctx.fillStyle = "#070A12";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // subtle accents
      ctx.fillStyle = "rgba(120,110,255,0.08)";
      ctx.beginPath();
      ctx.arc(200, 120, 220, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(0,255,170,0.05)";
      ctx.beginPath();
      ctx.arc(canvas.width - 180, canvas.height - 120, 240, 0, Math.PI * 2);
      ctx.fill();

      if (presenting?.stream && videos.length > 0) {
        // presenter left, sidebar right
        const presenter = videos[0];
        const sidebar = videos.slice(1);

        const bigW = Math.floor(canvas.width * 0.8);
        const bigH = canvas.height;

        try {
          ctx.drawImage(presenter.el, 0, 0, bigW, bigH);
        } catch {}

        const sideX = bigW;
        const sideW = canvas.width - bigW;
        const tileH = 160;
        let y = 0;

        sidebar.forEach((v) => {
          if (y + tileH > canvas.height) return;
          try {
            ctx.drawImage(v.el, sideX, y, sideW, tileH);
          } catch {}
          y += tileH;
        });
      } else {
        // grid layout
        const count = Math.max(videos.length, 1);
        const cols = count <= 2 ? 2 : count <= 4 ? 2 : 3;
        const rows = Math.ceil(count / cols);
        const cellW = Math.floor(canvas.width / cols);
        const cellH = Math.floor(canvas.height / rows);

        videos.forEach((v, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const x = c * cellW;
          const y = r * cellH;
          try {
            ctx.drawImage(v.el, x, y, cellW, cellH);
          } catch {}
        });
      }

      drawRafRef.current = requestAnimationFrame(draw);
    };

    draw();

    // capture canvas as video
    const canvasStream = canvas.captureStream(30);

    // MIX AUDIO: local + all participant streams + screen share audio (if any)
    const audioSources = [
      localStreamRef.current, // local always
      ...participants.map((p) => p.stream).filter(Boolean),
      screenShareStream, // if has audio track
    ].filter(Boolean);

    const audioTrack = buildMixedAudioTrack(audioSources);

    if (audioTrack) {
      try {
        canvasStream.addTrack(audioTrack);
      } catch {}
    }

    recordStreamRef.current = canvasStream;
    return canvasStream;
  };

  const startRecordingReal = () => {
    if (mediaRecorderRef.current) return;

    const stream = buildRecordingStream();
    if (!stream) {
      toast.error("Recording stream not available");
      return;
    }

    recordedChunksRef.current = [];

    const optionsList = [
      { mimeType: "video/webm;codecs=vp9,opus" },
      { mimeType: "video/webm;codecs=vp8,opus" },
      { mimeType: "video/webm" },
    ];
    const options =
      optionsList.find((o) => MediaRecorder.isTypeSupported(o.mimeType)) || {};

    try {
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });

        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        downloadBlob(blob, `meeting-${meetingCode}-${ts}.webm`);

        // stop capture tracks
        try {
          recordStreamRef.current?.getTracks()?.forEach((t) => t.stop());
        } catch {}
        recordStreamRef.current = null;

        // stop draw loop
        try {
          cancelAnimationFrame(drawRafRef.current);
        } catch {}
        drawRafRef.current = null;

        // remove canvas
        try {
          recordCanvasRef.current?.remove?.();
        } catch {}
        recordCanvasRef.current = null;

        // close audio ctx
        try {
          audioCtxRef.current?.close?.();
        } catch {}
        audioCtxRef.current = null;
        audioDestRef.current = null;

        mediaRecorderRef.current = null;
        recordedChunksRef.current = [];

        cleanupVideoEls();
        toast.success("Recording saved & downloaded");
      };

      recorder.start(1000);
      toast.success("Recording started");
    } catch (e) {
      console.error("MediaRecorder error:", e);
      toast.error("Recording failed (MediaRecorder not supported)");
    }
  };

  const stopRecordingReal = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    try {
      if (recorder.state !== "inactive") recorder.stop();
    } catch (e) {
      console.error("Stop recorder error:", e);
    }
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        stopRecordingReal();
      } catch {}
      try {
        cleanupVideoEls();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recording timer (seconds)
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(
        () => setRecordingDuration((prev) => prev + 1),
        1000,
      );
    }
    return () => interval && clearInterval(interval);
  }, [isRecording]);
  const handleToggleRecording = () => {
    setIsRecording((prev) => {
      const next = !prev;

      if (next) {
        setRecordingDuration(0);
        startRecordingReal();
      } else {
        stopRecordingReal();
      }

      return next;
    });
  };

  // =======================
  // Captions
  // =======================
  const {
    isListening: isCaptionsActive,
    isSupported: isCaptionsSupported,
    captions,
    currentTranscript,
    startListening: startCaptions,
    stopListening: stopCaptions,
    clearCaptions,
  } = useSpeechRecognition();

  // =======================
  // SOCKET + WEBRTC (MESH)
  // =======================
  const socketRef = useRef(null);

  const localStreamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);

  // ✅ Everyone uses pcsRef (instructor + students)
  const pcsRef = useRef(new Map());

  // Candidate queue (for offers before remote description ready)
  const pendingCandidatesRef = useRef(new Map());

  const queueCandidate = (peerId, candidate) => {
    if (!pendingCandidatesRef.current.has(peerId)) {
      pendingCandidatesRef.current.set(peerId, []);
    }
    pendingCandidatesRef.current.get(peerId).push(candidate);
  };

  const flushCandidates = async (pc, peerId) => {
    if (!pc.remoteDescription) return;
    const list = pendingCandidatesRef.current.get(peerId) || [];
    pendingCandidatesRef.current.set(peerId, []);
    for (const c of list) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(c));
      } catch {}
    }
  };

  const getLocalVideoTrack = () =>
    localStreamRef.current?.getVideoTracks?.()[0] || null;

  const replaceVideoTrackForPc = async (pc, newVideoTrack) => {
    if (!pc || !newVideoTrack) return;

    const sender = pc
      .getSenders()
      .find((s) => s.track && s.track.kind === "video");

    if (sender) {
      await sender.replaceTrack(newVideoTrack);
    } else {
      const stream = localStreamRef.current;
      if (stream) pc.addTrack(newVideoTrack, stream);
    }
  };

  const replaceVideoTrackForAllPeers = async (newVideoTrack) => {
    if (!newVideoTrack) return;

    const pcs = Array.from(pcsRef.current.values());
    for (const pc of pcs) {
      await replaceVideoTrackForPc(pc, newVideoTrack);
    }
  };

  const createPeerConnection = (peerId, onRemoteStream) => {
    const pc = new RTCPeerConnection(rtcConfig);

    const stream = localStreamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    pc.onicecandidate = (e) => {
      if (!e.candidate) return;
      socketRef.current?.emit("signal", {
        to: peerId,
        data: { type: "candidate", candidate: e.candidate },
      });
    };

    const remote = new MediaStream();
    pc.ontrack = (event) => {
      remote.addTrack(event.track);
      onRemoteStream(new MediaStream(remote.getTracks()));
    };

    pc.onconnectionstatechange = () => {
      const st = pc.connectionState;
      if (st === "failed" || st === "disconnected" || st === "closed") {
        // optional: handle UI updates
      }
    };

    return pc;
  };

  // ✅ Start call (offer) to a peer (ONLY new joiner should call existing peers)
  const startCallToPeer = async (peerId) => {
    if (!peerId || peerId === currentUserId) return;
    if (pcsRef.current.has(peerId)) return;

    // create pc + store
    const pc = createPeerConnection(peerId, (stream) => {
      setParticipants((prev) => {
        const exists = prev.some((p) => p.id === peerId);
        if (!exists) {
          return [
            ...prev,
            {
              id: peerId,
              name: "Participant",
              avatar: null,
              isMuted: false,
              isCameraOff: false,
              isActiveSpeaker: false,
              isHandRaised: false,
              isHost: false,
              stream,
            },
          ];
        }
        return prev.map((p) => (p.id === peerId ? { ...p, stream } : p));
      });
    });

    pcsRef.current.set(peerId, pc);

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.emit("signal", { to: peerId, data: offer });
    } catch (e) {
      console.error("startCallToPeer offer error:", e);
    }
  };

  // ✅ Handle signals from any peer (offer/answer/candidate)
  const handleSignal = async (from, data) => {
    if (!from || !data) return;

    let pc = pcsRef.current.get(from);

    // If not exists, create now (this happens when we RECEIVE an offer)
    if (!pc) {
      pc = createPeerConnection(from, (stream) => {
        setParticipants((prev) => {
          const exists = prev.some((p) => p.id === from);
          if (!exists) {
            return [
              ...prev,
              {
                id: from,
                name: "Participant",
                avatar: null,
                isMuted: false,
                isCameraOff: false,
                isActiveSpeaker: false,
                isHandRaised: false,
                isHost: false,
                stream,
              },
            ];
          }
          return prev.map((p) => (p.id === from ? { ...p, stream } : p));
        });
      });

      pcsRef.current.set(from, pc);
    }

    try {
      if (data?.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current?.emit("signal", { to: from, data: answer });
        await flushCandidates(pc, from);
        return;
      }

      if (data?.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data));
        await flushCandidates(pc, from);
        return;
      }

      if (data?.type === "candidate" && data.candidate) {
        if (!pc.remoteDescription) {
          queueCandidate(from, data.candidate);
          return;
        }
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        return;
      }
    } catch (err) {
      console.error("handleSignal error:", err);
    }
  };

  // =======================
  // Start local media once
  // =======================
  useEffect(() => {
    let mounted = true;

    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (!mounted) return;

        const startMuted = isHost ? initialMuted : true;
        const startCameraOff = isHost ? initialCameraOff : true;

        stream.getAudioTracks().forEach((t) => (t.enabled = !startMuted));
        stream.getVideoTracks().forEach((t) => (t.enabled = !startCameraOff));

        // ✅ keep UI in sync
        setIsMuted(startMuted);
        setIsCameraOff(startCameraOff);

        localStreamRef.current = stream;
        setLocalStream(stream);
      } catch (e) {
        console.error(e);
        toast.error("Camera/Mic permission denied");
      }
    };

    startMedia();

    return () => {
      mounted = false;
      try {
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Presenter logic
  const presenting = useMemo(() => {
    if (screenShareStream) {
      return {
        stream: screenShareStream,
        isLocal: true,
        name: currentUserName,
        presenterId: currentUserId,
      };
    }

    if (screenPresenterId) {
      const presenter = participants.find((p) => p.id === screenPresenterId);
      if (presenter?.stream) {
        return {
          stream: presenter.stream,
          isLocal: false,
          name: screenPresenterName || presenter.name || "Presenter",
          presenterId: screenPresenterId,
        };
      }
    }

    return null;
  }, [
    screenShareStream,
    screenPresenterId,
    screenPresenterName,
    participants,
    currentUserId,
    currentUserName,
  ]);

  const isPresenting = !!presenting;

  // =======================
  // Connect socket when meetingCode + localStream ready
  // =======================
  useEffect(() => {
    if (!meetingCode || !localStream) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5, // ✅ try 5 times
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    // ===========================
    // ✅ HAND RAISE EVENTS
    // ===========================
    socket.on("hand-raised", ({ participantId, user, raisedAt }) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantId
            ? {
                ...p,
                isHandRaised: true,
                name: user?.name || p.name,
                avatar: user?.avatar ?? p.avatar,
              }
            : p,
        ),
      );

      setHandRaiseQueue((prev) => {
        const exists = prev.some((e) => e.participantId === participantId);
        if (exists) return prev;

        return [
          ...prev,
          {
            participantId,
            participantName: user?.name || "Participant",
            avatar: user?.avatar || null,
            raisedAt: raisedAt ? new Date(raisedAt) : new Date(),
          },
        ];
      });
    });
    socket.on("connect_error", (err) => {
      console.log("❌ connect_error:", err.message);

      toast.error("Connection failed. Please check your internet.");
      onEndCall?.();
    });

    socket.on("connect_timeout", () => {
      console.log("❌ connect_timeout");

      toast.error("Connection timeout");
      onEndCall?.();
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ disconnected:", reason);

      // ignore normal disconnects
      if (reason === "io client disconnect") return;

      toast.error("Disconnected from server");
      onEndCall?.();
    });

    socket.io.on("reconnect_failed", () => {
      console.log("❌ reconnect_failed");

      toast.error("Unable to reconnect");
      onEndCall?.();
    });
    socket.on("hand-lowered", ({ participantId }) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === participantId ? { ...p, isHandRaised: false } : p,
        ),
      );
      setHandRaiseQueue((prev) =>
        prev.filter((e) => e.participantId !== participantId),
      );
      setCurrentSpeakerId((prev) => (prev === participantId ? null : prev));
    });

    socket.on("hands-lowered-all", () => {
      setParticipants((prev) =>
        prev.map((p) => ({ ...p, isHandRaised: false })),
      );
      setHandRaiseQueue([]);
      setIsHandRaised(false);
      setCurrentSpeakerId(null);
    });

    socket.on("speaker-called", ({ participantId }) => {
      setCurrentSpeakerId(participantId);
    });

    socket.on("speaker-cleared", () => {
      setCurrentSpeakerId(null);
    });

    // ===========================
    // ✅ MIC / VIDEO FORCED EVENTS
    // ===========================
    socket.on("mic-allowed", () => {
      setIsMicAllowed(true);
      toast.success("Instructor allowed your mic");
    });
    socket.on("mic-muted-locked", () => {
      setIsMuted(true);
      setIsMicAllowed(false);

      localStreamRef.current
        ?.getAudioTracks()
        ?.forEach((t) => (t.enabled = false));

      toast.error("Instructor muted you. You cannot unmute.");
    });
    socket.on("mic-muted", () => {
      setIsMuted(true);

      localStreamRef.current
        ?.getAudioTracks()
        ?.forEach((t) => (t.enabled = false));

      toast.warning("Instructor muted everyone. You can unmute yourself.");
    });

    socket.on("video-allowed", () => {
      toast.success("Instructor allowed your camera");
    });

    socket.on("video-muted", () => {
      toast.warning("Instructor turned off your camera");
      setIsCameraOff(true);
      localStreamRef.current
        ?.getVideoTracks()
        ?.forEach((t) => (t.enabled = false));
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === currentUserId ? { ...p, isCameraOff: true } : p,
        ),
      );
    });

    // ===========================
    // ✅ SCREEN SHARE BROADCAST
    // ===========================
    socket.on("screen-share-started", ({ presenterId, presenterName }) => {
      setScreenPresenterId(presenterId);
      setScreenPresenterName(presenterName || null);
    });

    socket.on("screen-share-stopped", ({ presenterId }) => {
      setScreenPresenterId((prev) => (prev === presenterId ? null : prev));
      setScreenPresenterName(null);
    });

    // ===========================
    // ✅ MESH: peers list to NEW joiner
    // ===========================
    socket.on("room-peers", async ({ peers = [] }) => {
      // Add peers into participants list (UI tiles)
      setParticipants((prev) => {
        const map = new Map(prev.map((p) => [p.id, p]));
        peers.forEach((x) => {
          const pid = x.peerId;
          if (!pid || pid === currentUserId) return;

          if (!map.has(pid)) {
            map.set(pid, {
              id: pid,
              name: x.user?.name || (x.isHost ? "Instructor" : "Participant"),
              avatar: x.user?.avatar || null,
              isMuted: false,
              isCameraOff: false,
              isActiveSpeaker: false,
              isHandRaised: false,
              isHost: !!x.isHost,
              stream: null,
            });
          } else {
            const existing = map.get(pid);
            map.set(pid, {
              ...existing,
              name: x.user?.name || existing.name,
              avatar: x.user?.avatar ?? existing.avatar,
              isHost: !!x.isHost,
            });
          }
        });
        return Array.from(map.values());
      });

      // IMPORTANT: only the NEW joiner calls existing peers
      for (const x of peers) {
        if (!x?.peerId) continue;
        if (x.peerId === currentUserId) continue;
        await startCallToPeer(x.peerId);
      }
    });

    // ✅ When someone joins (UI only)
    socket.on("peer-joined", ({ peerId, user, isHost }) => {
      if (!peerId || peerId === currentUserId) return;

      setParticipants((prev) => {
        const exists = prev.some((p) => p.id === peerId);
        if (exists) {
          return prev.map((p) =>
            p.id === peerId
              ? {
                  ...p,
                  name: user?.name || p.name,
                  avatar: user?.avatar ?? p.avatar,
                  isHost: !!isHost,
                }
              : p,
          );
        }
        return [
          ...prev,
          {
            id: peerId,
            name: user?.name || (isHost ? "Instructor" : "Participant"),
            avatar: user?.avatar || null,
            isMuted: false,
            isCameraOff: false,
            isActiveSpeaker: false,
            isHandRaised: false,
            isHost: !!isHost,
            stream: null,
          },
        ];
      });

      setSpeakingTimes((prev) => {
        const exists = prev.some((x) => x.participantId === peerId);
        if (exists) return prev;
        return [...prev, { participantId: peerId, totalSeconds: 0 }];
      });
    });

    // ✅ When someone leaves: close PC + remove tile
    socket.on("peer-left", ({ peerId }) => {
      if (!peerId) return;

      const pc = pcsRef.current.get(peerId);
      if (pc) {
        try {
          pc.close();
        } catch {}
        pcsRef.current.delete(peerId);
      }

      pendingCandidatesRef.current.delete(peerId);

      setParticipants((prev) => prev.filter((p) => p.id !== peerId));
      setSpeakingTimes((prev) =>
        prev.filter((x) => x.participantId !== peerId),
      );
    });

    // ===========================
    // CONNECT
    // ===========================
    socket.on("connect", () => {
      const myId = socket.id;
      setCurrentUserId(myId);

      // add local participant
      setParticipants([
        {
          id: myId,
          name: currentUserName,
          avatar: currentUserAvatar,
          isMuted: isHost ? initialMuted : true,
          isCameraOff: isHost ? initialCameraOff : true,
          isActiveSpeaker: false,
          isHandRaised: false,
          isHost,
          stream: localStreamRef.current,
        },
      ]);

      setSpeakingTimes([{ participantId: myId, totalSeconds: 0 }]);

      socket.emit("join-room", {
        roomId: meetingCode,
        role,
        user: { name: currentUserName, avatar: currentUserAvatar },
      });

      // student must request approval
      if (role === "student" && !hasRequestedJoinRef.current) {
        hasRequestedJoinRef.current = true;

        socket.emit("request-join", {
          roomId: meetingCode,
          user: { name: currentUserName, avatar: currentUserAvatar },
        });
      }
      hasRequestedJoinRef.current = false;
      console.log("✅ connected socket:", myId);
    });

    // socket.on("waiting-for-approval", () => {

    //         toast.info("Please wait for Class Not started yet. Waiting for instructor approval...");

    // });

    socket.on("room-not-found", ({ retry, message }) => {
      console.log("❌ room not found", message);
    if (message === "Waiting for instructor to start the class") {
    toast.error("Instructor has not started the class");

    // ✅ Clean disconnect BEFORE leaving
    try {
      socketRef.current?.disconnect();
    } catch {}

    // ✅ Stop local media
    try {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
    } catch {}

    // ✅ Close all peer connections
    try {
      pcsRef.current.forEach((pc) => pc.close());
      pcsRef.current.clear();
    } catch {}

    // ✅ Finally navigate back
    onEndCall?.();

    return;
  }

      if (retry) {
        toast.loading(message || "Waiting for instructor...", {
          id: "room-retry",
        });

        // retry after 2 sec
        setTimeout(() => {
          if (!socketRef.current) return;

          socket.emit("join-room", {
            roomId: meetingCode,
            role,
            user: { name: currentUserName, avatar: currentUserAvatar },
          });

          if (role === "student") {
            socket.emit("request-join", {
              roomId: meetingCode,
              user: { name: currentUserName, avatar: currentUserAvatar },
            });
          }
        }, 2000);
      } else {
        toast.error(message || "Room not found");
        onEndCall?.();
      }
    });

    socket.on("room-created", () => {
      if (role === "instructor") toast.success("Room created");
    });

    socket.on("join-request", ({ studentId, user }) => {
      toast.info(`Student waiting: ${user?.name || studentId}`);

      setWaitingParticipants((prev) => {
        const exists = prev.some((p) => p.id === studentId);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: studentId,
            name: user?.name || "Student",
            avatar: user?.avatar || null,
            waitingSince: new Date(),
          },
        ];
      });

      // Auto-approve (your old behavior)
      socket.emit("approve-student", { roomId: meetingCode, studentId });
    });

    socket.on("join-approved", ({ activePresenter }) => {
      toast.success("Approved! Connecting...");

      if (activePresenter?.presenterId) {
        setScreenPresenterId(activePresenter.presenterId);
        setScreenPresenterName(activePresenter.presenterName || null);
      }
    });
    socket.on("participant-update", ({ type }) => {
      if (type === "mic-muted-all") {
        if (!isHost) {
          setIsMicAllowed(true); // ✅ allow unmute
          setIsMuted(true);

          localStreamRef.current
            ?.getAudioTracks()
            ?.forEach((t) => (t.enabled = false));

          toast.warning("Instructor muted everyone. You can unmute yourself.");
        }
      }
    });
    socket.on("student-joined", ({ studentId, user }) => {
      // instructor only UI list
      setWaitingParticipants((prev) => prev.filter((p) => p.id !== studentId));

      setParticipants((prev) => {
        const exists = prev.some((p) => p.id === studentId);
        if (!exists) {
          return [
            ...prev,
            {
              id: studentId,
              name: user?.name || "Student",
              avatar: user?.avatar || null,
              isMuted: false,
              isCameraOff: false,
              isActiveSpeaker: false,
              isHandRaised: false,
              isHost: false,
              stream: null,
            },
          ];
        }
        return prev.map((p) =>
          p.id === studentId
            ? {
                ...p,
                name: user?.name || p.name,
                avatar: user?.avatar ?? p.avatar,
              }
            : p,
        );
      });

      setSpeakingTimes((prev) => {
        const exists = prev.some((x) => x.participantId === studentId);
        if (exists) return prev;
        return [...prev, { participantId: studentId, totalSeconds: 0 }];
      });

      // ❌ DO NOT instructorStartCall here
      // ✅ New student will call instructor via "room-peers"
    });

    // WebRTC signal forwarding
    socket.on("signal", async ({ from, data }) => {
      await handleSignal(from, data);
    });

    socket.on("student-disconnected", ({ studentId }) => {
      toast.info("Student disconnected");

      const pc = pcsRef.current.get(studentId);
      if (pc) {
        try {
          pc.close();
        } catch {}
        pcsRef.current.delete(studentId);
      }

      pendingCandidatesRef.current.delete(studentId);

      setParticipants((prev) => prev.filter((p) => p.id !== studentId));
      setSpeakingTimes((prev) =>
        prev.filter((x) => x.participantId !== studentId),
      );
    });

    socket.on("instructor-disconnected", () => {
      toast.warning(
        "Instructor is not available now. Please wait or leave after 3 minutes.",
      );

      setInstructorDisconnected(true);
      setInstructorCountdown(180);
    });

    socket.on("class-ended", () => {
      toast.info("Class ended");
      onEndCall?.();
    });

    // cleanup
    return () => {
      try {
        socket.disconnect();
      } catch {}

      socketRef.current = null;

      // close all peer connections
      pcsRef.current.forEach((pc) => {
        try {
          pc.close();
        } catch {}
      });
      pcsRef.current.clear();
      pendingCandidatesRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingCode, localStream]);

  // =======================
  // Elapsed time
  // =======================
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(
        Math.floor((Date.now() - meetingStartTime.getTime()) / 1000),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [meetingStartTime]);

  // Speaking time tracker
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeakingTimes((prev) =>
        prev.map((st) => {
          const participant = participants.find(
            (p) => p.id === st.participantId,
          );
          if (
            participant &&
            participant.isActiveSpeaker &&
            !participant.isMuted
          ) {
            return { ...st, totalSeconds: st.totalSeconds + 1 };
          }
          return st;
        }),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [participants]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "escape":
          if (isFocusMode) {
            setIsFocusMode(false);
            toast.info("Focus mode disabled");
          }
          break;
        case "m":
          handleToggleMute();
          toast.info(isMuted ? "Unmuted" : "Muted", { duration: 1500 });
          break;
        case "v":
          handleToggleCamera();
          toast.info(isCameraOff ? "Camera on" : "Camera off", {
            duration: 1500,
          });
          break;
        case "h":
          handleToggleHandRaise();
          break;
        case "c":
          handleToggleChat();
          break;
        case "p":
          handleToggleParticipants();
          break;
        case "f":
          setIsFocusMode((prev) => !prev);
          break;
        case "?":
          setIsShortcutsModalOpen(true);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocusMode, isMuted, isCameraOff]);

  // Screen share track ended cleanup
  useEffect(() => {
    if (!screenShareStream) return;
    const videoTrack = screenShareStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.onended = () => {
        handleStopScreenShare();
        toast.info("Screen sharing stopped");
      };
    }
    return () => {
      try {
        screenShareStream.getTracks().forEach((track) => track.stop());
      } catch {}
    };
  }, [screenShareStream]);

  // =======================
  // HANDLERS
  // =======================
  const handleToggleMute = () => {
    // if (!isMicAllowed && !isHost) {
    //   toast.error("Instructor has muted you");
    //   return;
    // }

    setIsMuted((prev) => {
      const next = !prev;

      localStreamRef.current
        ?.getAudioTracks()
        .forEach((t) => (t.enabled = !next));

      return next;
    });

    setParticipants((prev) =>
      prev.map((p) =>
        p.id === currentUserId ? { ...p, isMuted: !p.isMuted } : p,
      ),
    );
  };

  const handleToggleCamera = () => {
    setIsCameraOff((prev) => {
      const next = !prev;
      localStreamRef.current
        ?.getVideoTracks()
        .forEach((t) => (t.enabled = !next));
      return next;
    });

    setParticipants((prev) =>
      prev.map((p) =>
        p.id === currentUserId ? { ...p, isCameraOff: !p.isCameraOff } : p,
      ),
    );
  };
  useEffect(() => {
    if (!instructorDisconnected) return;

    const interval = setInterval(() => {
      setInstructorCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          toast.error("Instructor did not return. Leaving meeting...");
          onEndCall?.();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [instructorDisconnected]);
  const handleToggleChat = () => {
    setIsChatOpen((prev) => !prev);
    setIsParticipantsOpen(false);
    setIsWaitingRoomOpen(false);
  };

  const handleToggleParticipants = () => {
    setIsParticipantsOpen((prev) => !prev);
    setIsChatOpen(false);
    setIsWaitingRoomOpen(false);
  };

  const handleToggleWaitingRoom = () => {
    setIsWaitingRoomOpen((prev) => !prev);
    setIsChatOpen(false);
    setIsParticipantsOpen(false);
    setIsBreakoutRoomsOpen(false);
  };

  const handleToggleBreakoutRooms = () => {
    setIsBreakoutRoomsOpen((prev) => !prev);
    setIsChatOpen(false);
    setIsParticipantsOpen(false);
    setIsWaitingRoomOpen(false);
    setIsPollsOpen(false);
  };

  const handleTogglePolls = () => {
    setIsPollsOpen((prev) => !prev);
    setIsChatOpen(false);
    setIsParticipantsOpen(false);
    setIsWaitingRoomOpen(false);
    setIsBreakoutRoomsOpen(false);
  };

  const handleToggleWhiteboard = () => setIsWhiteboardOpen((prev) => !prev);
  const handleToggleTimer = () => setIsTimerOpen((prev) => !prev);

  const handleToggleCaptions = () => {
    setIsCaptionsOpen((prev) => !prev);
    setIsChatOpen(false);
    setIsParticipantsOpen(false);
    setIsWaitingRoomOpen(false);
    setIsBreakoutRoomsOpen(false);
    setIsPollsOpen(false);
  };

  const handleReact = (emoji) => {
    const newReaction = {
      id: `reaction-${Date.now()}-${Math.random()}`,
      emoji,
      x: 20 + Math.random() * 60,
      timestamp: Date.now(),
    };
    setReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 4000);
  };

  const handleToggleHandRaise = () => {
    setIsHandRaised((prev) => !prev);
    socketRef.current?.emit("raise-hand", { roomId: meetingCode });
  };

  const handleToggleHandRaiseQueue = () => {
    setIsHandRaiseQueueOpen((prev) => !prev);
    setIsChatOpen(false);
    setIsParticipantsOpen(false);
    setIsWaitingRoomOpen(false);
    setIsBreakoutRoomsOpen(false);
    setIsPollsOpen(false);
    setIsCaptionsOpen(false);
  };

  const handleMuteAll = () => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === currentUserId ? p : { ...p, isMuted: true })),
    );
    toast.success("All participants muted (command sent)");
    socketRef.current?.emit("mute-all", { roomId: meetingCode });
  };

  const handleVideoOffAll = () => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === currentUserId ? p : { ...p, isCameraOff: true },
      ),
    );
    toast.success("All participant cameras turned off (command sent)");
    socketRef.current?.emit("mute-video-all", { roomId: meetingCode });
  };

  const handleMuteAllAndVideoOffAll = () => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === currentUserId ? p : { ...p, isMuted: true, isCameraOff: true },
      ),
    );
    toast.success("All participants muted + cameras off (command sent)");
    socketRef.current?.emit("mute-all", { roomId: meetingCode });
    socketRef.current?.emit("mute-video-all", { roomId: meetingCode });
  };

  const handleToggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "speaker" : "grid"));
  };

  const handleTogglePiP = () => {
    if (videoGridRef.current) {
      togglePiP(videoGridRef.current);
      if (!isPiPActive) toast.success("Picture-in-picture enabled");
    }
  };

  const handleToggleMeetingLock = () => {
    setIsMeetingLocked((prev) => !prev);
    toast.success("Meeting lock toggled (UI)");
  };

  const handleToggleScreenShare = () => {
    if (screenShareStream) handleStopScreenShare();
    else setIsScreenShareModalOpen(true);
  };

  const handleScreenShare = async (displayStream) => {
    try {
      const screenTrack = displayStream.getVideoTracks()[0];
      const systemAudioTrack = displayStream.getAudioTracks()[0];
      const micTrack = localStreamRef.current?.getAudioTracks()[0];

      if (!screenTrack) return;

      await replaceVideoTrackForAllPeers(screenTrack);

      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      const audioContext = audioCtxRef.current || new AudioContextClass();

      audioCtxRef.current = audioContext;

      await audioContext.resume();

      const destination = audioContext.createMediaStreamDestination();

      if (micTrack) {
        const micStream = new MediaStream([micTrack]);
        const micSource = audioContext.createMediaStreamSource(micStream);
        micSource.connect(destination);
      }

      if (systemAudioTrack) {
        const sysStream = new MediaStream([systemAudioTrack]);
        const sysSource = audioContext.createMediaStreamSource(sysStream);
        sysSource.connect(destination);
      }

      const mergedTrack = destination.stream.getAudioTracks()[0];

      for (const pc of pcsRef.current.values()) {
        const sender = pc
          .getSenders()
          .find((s) => s.track && s.track.kind === "audio");

        if (sender && mergedTrack) {
          await sender.replaceTrack(mergedTrack);
        }
      }

      setScreenShareStream(displayStream);

      socketRef.current?.emit("screen-share-started", {
        roomId: meetingCode,
        presenterId: currentUserId,
        presenterName: currentUserName,
      });

      toast.success("Screen sharing with system audio");
    } catch (err) {
      console.error(err);
      toast.error("Screen share failed");
    }
  };

  const handleStopScreenShare = async () => {
    try {
      screenShareStream?.getTracks().forEach((t) => t.stop());
      const track = screenShareStream?.getVideoTracks()[0];
      if (track) track.onended = null;
    } catch {}

    setScreenShareStream(null);

    const cameraTrack = getLocalVideoTrack();
    const micTrack = localStreamRef.current?.getAudioTracks?.()[0];

    // Restore video
    if (cameraTrack) {
      await replaceVideoTrackForAllPeers(cameraTrack);
    }

    // Restore mic audio
    pcsRef.current.forEach(async (pc) => {
      const sender = pc
        .getSenders()
        .find((s) => s.track && s.track.kind === "audio");

      if (sender && micTrack) {
        await sender.replaceTrack(micTrack);
      }
    });

    socketRef.current?.emit("screen-share-stop", {
      roomId: meetingCode,
      presenterId: currentUserId,
    });

    toast.info("Screen sharing stopped");
  };

  const handleSelectBackground = (background) => {
    setIsBackgroundProcessing(true);
    setTimeout(() => {
      setSelectedBackground(background);
      setIsBackgroundProcessing(false);
      if (background.type !== "none")
        toast.success(`Background: ${background.label}`);
    }, 500);
  };

  const handleSendMessage = (content) => {
    const newMessage = {
      id: String(messages.length + 1),
      senderId: currentUserId,
      senderName: currentUserName,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const hasActivePoll = polls.some((p) => p.isActive);
  const highlightedQuestion = questions.find((q) => q.isHighlighted);
  const unansweredQuestionCount = questions.filter((q) => !q.isAnswered).length;

  // =======================
  // RENDER
  // =======================
  return (
    <div className="h-screen flex flex-col relative bg-video-bg">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-44 -left-44 h-[520px] w-[520px] rounded-full blur-3xl bg-[oklch(0.72_0.16_265_/0.18)]" />
        <div className="absolute -bottom-44 -right-44 h-[520px] w-[520px] rounded-full blur-3xl bg-[oklch(0.75_0.17_170_/0.12)]" />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <ReactionsDisplay reactions={reactions} />

        <CaptionsDisplay
          captions={captions}
          currentTranscript={currentTranscript}
          isVisible={isCaptionsActive && isCaptionsVisible}
        />

        <QADisplay question={highlightedQuestion || null} />

        {screenShareStream && <PictureInPicture />}

        {!isFocusMode && (
          <TopBar
            meetingCode={meetingCode}
            isRecording={isRecording}
            recordingDuration={recordingDuration}
            isMeetingLocked={isMeetingLocked}
            meetingStartTime={meetingStartTime}
          />
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* MAIN VIDEO AREA */}
          <div ref={videoGridRef} className="flex-1 overflow-auto p-4 md:p-6">
            <div className="h-full rounded-2xl border border-border/60 bg-card/55 backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.50)] p-3 md:p-4">
              {isPresenting ? (
                <div className="h-full flex flex-row gap-3 relative">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isScreenShareSidebarCollapsed ? "w-full" : "w-[80%]"
                    }`}
                  >
                    <div className="h-full rounded-2xl overflow-hidden border border-border/60 bg-card/40">
                      <ScreenSharePreview
                        stream={presenting.stream}
                        presenterName={
                          presenting.isLocal ? "You" : presenting.name
                        }
                        isLocalPresenter={presenting.isLocal}
                        onStopSharing={
                          presenting.isLocal ? handleStopScreenShare : undefined
                        }
                      />
                    </div>
                  </div>

                  <div
                    className={`h-full transition-all duration-300 overflow-hidden ${
                      isScreenShareSidebarCollapsed ? "w-0" : "w-[20%]"
                    }`}
                  >
                    <div className="h-full overflow-y-auto flex flex-col gap-3 p-3">
                      {participants
                        .filter((p) => p.id !== presenting.presenterId)
                        .map((participant) => (
                          <div
                            key={participant.id}
                            className="rounded-xl border border-border/60 bg-card/35 backdrop-blur-md p-2 hover:bg-card/50 transition"
                          >
                            <ParticipantVideo
                              participant={participant}
                              isLocal={participant.id === currentUserId}
                              selectedBackground={
                                participant.id === currentUserId
                                  ? selectedBackground
                                  : undefined
                              }
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                  {instructorDisconnected && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50">
                      <div className="bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-lg text-center">
                        <p className="font-semibold">
                          Instructor is not available now
                        </p>

                        <p className="text-sm">
                          Waiting {Math.floor(instructorCountdown / 60)}:
                          {(instructorCountdown % 60)
                            .toString()
                            .padStart(2, "0")}
                        </p>

                        <button
                          onClick={() => onEndCall?.()}
                          className="mt-2 px-4 py-1 bg-white text-red-600 rounded text-sm"
                        >
                          Leave Now
                        </button>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setIsScreenShareSidebarCollapsed((p) => !p)}
                    className="absolute right-3 top-3 z-10 px-3 py-2 rounded-full bg-card/55 backdrop-blur-xl border border-border/60 hover:bg-card/70 transition shadow-[0_10px_26px_rgba(0,0,0,0.45)] flex items-center gap-2"
                    title={
                      isScreenShareSidebarCollapsed
                        ? "Show participants"
                        : "Hide participants"
                    }
                  >
                    {isScreenShareSidebarCollapsed && (
                      <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                        <Users className="w-3 h-3" />
                        {Math.max(participants.length - 1, 0)}
                      </span>
                    )}
                    {isScreenShareSidebarCollapsed ? (
                      <ChevronLeft className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ) : (
                <VideoGrid
                  participants={participants}
                  selectedBackground={selectedBackground}
                  spotlightedParticipantIds={spotlightedParticipantIds}
                  viewMode={viewMode}
                  onReorderSpotlights={setSpotlightedParticipantIds}
                  isLocalPiPVisible={isLocalPiPVisible}
                  currentUserId={currentUserId}
                />
              )}
            </div>
          </div>

          {/* RIGHT PANELS */}
          {isChatOpen && (
            <div className="w-[380px] max-w-[92vw] border-l border-border/60 bg-card/55 backdrop-blur-xl shadow-[0_14px_35px_rgba(0,0,0,0.45)]">
              <ChatPanel
                messages={messages}
                onClose={() => setIsChatOpen(false)}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}

          {isParticipantsOpen && (
            <div className="w-[420px] max-w-[92vw] border-l border-border/60 bg-card/55 backdrop-blur-xl shadow-[0_14px_35px_rgba(0,0,0,0.45)]">
              <ParticipantsPanel
                participants={participants}
                isHost={isHost}
                spotlightedParticipantIds={spotlightedParticipantIds}
                speakingTimes={speakingTimes}
                meetingDuration={elapsedSeconds}
                onSpotlight={(id) =>
                  setSpotlightedParticipantIds((prev) =>
                    prev.includes(id)
                      ? prev.filter((x) => x !== id)
                      : [...prev, id],
                  )
                }
                onClearSpotlights={() => setSpotlightedParticipantIds([])}
                onClose={() => setIsParticipantsOpen(false)}
              />
            </div>
          )}

          {isWaitingRoomOpen && (
            <div className="w-[420px] max-w-[92vw] border-l border-border/60 bg-card/55 backdrop-blur-xl shadow-[0_14px_35px_rgba(0,0,0,0.45)]">
              <WaitingParticipantsPanel
                waitingParticipants={waitingParticipants}
                onAdmit={(id) => {
                  socketRef.current?.emit("approve-student", {
                    roomId: meetingCode,
                    studentId: id,
                  });
                  setWaitingParticipants((prev) =>
                    prev.filter((p) => p.id !== id),
                  );
                }}
                onDeny={(id) =>
                  setWaitingParticipants((prev) =>
                    prev.filter((p) => p.id !== id),
                  )
                }
                onAdmitAll={() => {
                  waitingParticipants.forEach((p) => {
                    socketRef.current?.emit("approve-student", {
                      roomId: meetingCode,
                      studentId: p.id,
                    });
                  });
                  setWaitingParticipants([]);
                }}
                onClose={() => setIsWaitingRoomOpen(false)}
              />
            </div>
          )}

          {isBreakoutRoomsOpen && (
            <div className="w-[420px] max-w-[92vw] border-l border-border/60 bg-card/55 backdrop-blur-xl shadow-[0_14px_35px_rgba(0,0,0,0.45)]">
              <BreakoutRoomsPanel
                participants={participants}
                breakoutRooms={breakoutRooms}
                isBreakoutActive={isBreakoutActive}
                onCreateRoom={(name) =>
                  setBreakoutRooms((prev) => [
                    ...prev,
                    { id: `room-${Date.now()}`, name, participantIds: [] },
                  ])
                }
                onDeleteRoom={(id) =>
                  setBreakoutRooms((prev) => prev.filter((r) => r.id !== id))
                }
                onAssignParticipant={() => {}}
                onStartBreakout={() => setIsBreakoutActive(true)}
                onEndBreakout={() => setIsBreakoutActive(false)}
                onShuffleParticipants={() => toast.info("Shuffle (UI only)")}
                onClose={() => setIsBreakoutRoomsOpen(false)}
              />
            </div>
          )}

          {isPollsOpen && (
            <div className="w-[420px] max-w-[92vw] border-l border-border/60 bg-card/55 backdrop-blur-xl shadow-[0_14px_35px_rgba(0,0,0,0.45)]">
              <PollsPanel
                polls={polls}
                isHost={isHost}
                currentUserId={currentUserId || "me"}
                onCreatePoll={(question, optionTexts) => {
                  const newPoll = {
                    id: `poll-${Date.now()}`,
                    question,
                    options: optionTexts.map((text, index) => ({
                      id: `opt-${index}`,
                      text,
                      votes: 0,
                    })),
                    isActive: true,
                    createdAt: new Date(),
                    totalVotes: 0,
                    votedBy: [],
                  };
                  setPolls((prev) => [
                    newPoll,
                    ...prev.map((p) => ({ ...p, isActive: false })),
                  ]);
                  toast.success("Poll created");
                }}
                onDeletePoll={(id) =>
                  setPolls((prev) => prev.filter((p) => p.id !== id))
                }
                onStartPoll={(id) =>
                  setPolls((prev) =>
                    prev.map((p) => ({ ...p, isActive: p.id === id })),
                  )
                }
                onEndPoll={(id) =>
                  setPolls((prev) =>
                    prev.map((p) =>
                      p.id === id ? { ...p, isActive: false } : p,
                    ),
                  )
                }
                onVote={(pollId, optionId) => {
                  setPolls((prev) =>
                    prev.map((poll) => {
                      if (poll.id !== pollId) return poll;
                      if (poll.votedBy.includes(currentUserId)) return poll;
                      return {
                        ...poll,
                        options: poll.options.map((opt) =>
                          opt.id === optionId
                            ? { ...opt, votes: opt.votes + 1 }
                            : opt,
                        ),
                        totalVotes: poll.totalVotes + 1,
                        votedBy: [...poll.votedBy, currentUserId],
                      };
                    }),
                  );
                  toast.success("Vote recorded");
                }}
                onClose={() => setIsPollsOpen(false)}
              />
            </div>
          )}

          {isHandRaiseQueueOpen && (
            <div className="w-[420px] max-w-[92vw] border-l border-border/60 bg-card/55 backdrop-blur-xl shadow-[0_14px_35px_rgba(0,0,0,0.45)]">
              <HandRaiseQueue
                queue={handRaiseQueue}
                isHost={isHost}
                currentSpeakerId={currentSpeakerId}
                onCallOn={(id) =>
                  socketRef.current?.emit("call-on", {
                    roomId: meetingCode,
                    studentId: id,
                  })
                }
                onLowerHand={(id) =>
                  socketRef.current?.emit("lower-hand", {
                    roomId: meetingCode,
                    studentId: id,
                  })
                }
                onLowerAllHands={() =>
                  socketRef.current?.emit("lower-all-hands", {
                    roomId: meetingCode,
                  })
                }
                onClose={() => setIsHandRaiseQueueOpen(false)}
              />
            </div>
          )}

          {isQAOpen && (
            <div className="w-[420px] max-w-[92vw] border-l border-border/60 bg-card/55 backdrop-blur-xl shadow-[0_14px_35px_rgba(0,0,0,0.45)]">
              <QAPanel
                questions={questions}
                isHost={isHost}
                currentUserId={currentUserId || "me"}
                onSubmitQuestion={(text) => {
                  const q = {
                    id: `q-${Date.now()}`,
                    text,
                    authorId: currentUserId,
                    authorName: currentUserName,
                    createdAt: new Date(),
                    upvotes: 0,
                    upvotedBy: [],
                    isAnswered: false,
                    isHighlighted: false,
                  };
                  setQuestions((prev) => [...prev, q]);
                }}
                onUpvote={(questionId) => {
                  setQuestions((prev) =>
                    prev.map((q) => {
                      if (q.id !== questionId) return q;
                      const hasUpvoted = q.upvotedBy.includes(currentUserId);
                      return {
                        ...q,
                        upvotes: hasUpvoted ? q.upvotes - 1 : q.upvotes + 1,
                        upvotedBy: hasUpvoted
                          ? q.upvotedBy.filter((id) => id !== currentUserId)
                          : [...q.upvotedBy, currentUserId],
                      };
                    }),
                  );
                }}
                onHighlight={(questionId) =>
                  setQuestions((prev) =>
                    prev.map((q) => ({
                      ...q,
                      isHighlighted:
                        q.id === questionId
                          ? !q.isHighlighted
                          : q.isHighlighted,
                    })),
                  )
                }
                onDismiss={(questionId) =>
                  setQuestions((prev) =>
                    prev.filter((q) => q.id !== questionId),
                  )
                }
                onMarkAnswered={(questionId) =>
                  setQuestions((prev) =>
                    prev.map((q) =>
                      q.id === questionId
                        ? { ...q, isAnswered: true, isHighlighted: false }
                        : q,
                    ),
                  )
                }
                onClose={() => setIsQAOpen(false)}
              />
            </div>
          )}
        </div>

        {/* CONTROL BAR */}
        {!isFocusMode && (
          <ControlBar
            isMicAllowed={isMicAllowed}
            isRecording={isRecording}
            recordingDuration={recordingDuration}
            onToggleRecording={handleToggleRecording}
            onMuteAll={handleMuteAll}
            onVideoOffAll={handleVideoOffAll}
            onMuteAllAndVideoOffAll={handleMuteAllAndVideoOffAll}
            isMuted={isMuted}
            isCameraOff={isCameraOff}
            isChatOpen={isChatOpen}
            isParticipantsOpen={isParticipantsOpen}
            isScreenSharing={!!screenShareStream}
            isHandRaised={isHandRaised}
            isWaitingRoomOpen={isWaitingRoomOpen}
            isBreakoutRoomsOpen={isBreakoutRoomsOpen}
            isBreakoutActive={isBreakoutActive}
            isPollsOpen={isPollsOpen}
            hasActivePoll={hasActivePoll}
            isWhiteboardOpen={isWhiteboardOpen}
            isTimerOpen={isTimerOpen}
            isTimerRunning={isTimerRunning}
            isCaptionsOpen={isCaptionsOpen}
            isCaptionsActive={isCaptionsActive}
            isHandRaiseQueueOpen={isHandRaiseQueueOpen}
            handRaiseCount={handRaiseQueue.length}
            isMeetingLocked={isMeetingLocked}
            waitingCount={waitingParticipants.length}
            breakoutRoomCount={breakoutRooms.length}
            pollCount={polls.length}
            isQAOpen={isQAOpen}
            questionCount={unansweredQuestionCount}
            isPiPActive={isPiPActive}
            isPiPSupported={isPiPSupported}
            isLocalPiPVisible={isLocalPiPVisible}
            isNoiseSuppression={isNoiseSuppression}
            isLowBandwidth={isLowBandwidth}
            isHost={isHost}
            viewMode={viewMode}
            selectedBackground={selectedBackground}
            isBackgroundProcessing={isBackgroundProcessing}
            onToggleMute={handleToggleMute}
            onToggleViewMode={handleToggleViewMode}
            onToggleCamera={handleToggleCamera}
            onToggleChat={handleToggleChat}
            onToggleParticipants={handleToggleParticipants}
            onToggleScreenShare={handleToggleScreenShare}
            onToggleHandRaise={handleToggleHandRaise}
            onToggleWaitingRoom={handleToggleWaitingRoom}
            onToggleBreakoutRooms={handleToggleBreakoutRooms}
            onTogglePolls={handleTogglePolls}
            onToggleWhiteboard={handleToggleWhiteboard}
            onToggleTimer={handleToggleTimer}
            onToggleCaptions={handleToggleCaptions}
            onToggleHandRaiseQueue={handleToggleHandRaiseQueue}
            onToggleMeetingLock={handleToggleMeetingLock}
            onToggleQA={() => setIsQAOpen((p) => !p)}
            onTogglePiP={handleTogglePiP}
            onToggleLocalPiP={() => setIsLocalPiPVisible((p) => !p)}
            onToggleNoiseSuppression={() => setIsNoiseSuppression((p) => !p)}
            onToggleLowBandwidth={() => setIsLowBandwidth((p) => !p)}
            onReact={handleReact}
            onSelectBackground={handleSelectBackground}
            onEndCall={() => {
              if (role === "instructor") {
                socketRef.current?.emit("end-class", { roomId: meetingCode });
              }
              onEndCall?.();
            }}
          />
        )}

        <ScreenShareModal
          isOpen={isScreenShareModalOpen}
          onClose={() => setIsScreenShareModalOpen(false)}
          onScreenShare={handleScreenShare}
        />

        {isWhiteboardOpen && (
          <WhiteboardPanel onClose={() => setIsWhiteboardOpen(false)} />
        )}

        {isTimerOpen && (
          <div className="fixed right-4 top-16 bottom-24 z-40 w-[360px] max-w-[90vw]">
            <div className="h-full rounded-2xl border border-border/60 bg-card/55 backdrop-blur-xl shadow-[0_14px_35px_rgba(0,0,0,0.45)] overflow-hidden">
              <TimerPanel
                isVisible={isTimerVisible}
                onVisibilityChange={setIsTimerVisible}
                onClose={() => setIsTimerOpen(false)}
              />
            </div>
          </div>
        )}

        <KeyboardShortcutsModal
          isOpen={isShortcutsModalOpen}
          onClose={() => setIsShortcutsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default VideoCallScreen;
