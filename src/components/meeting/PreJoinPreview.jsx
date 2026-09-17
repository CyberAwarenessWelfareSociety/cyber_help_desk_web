import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Settings,
  Volume2,
  Check,
  Speaker,
  Play,
  Square,
  AudioLines,
} from "lucide-react";
import { toast } from "sonner";

import { socket } from "@/socket/socket"; // ✅ SOCKET IMPORT

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PreJoinPreview = ({ meetingCode, onJoin, onCancel }) => {
  const videoRef = useRef(null);
  const testAudioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef();

  // ✅ for safe cleanup
  const streamRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [stream, setStream] = useState(null);
  const [micLevel, setMicLevel] = useState(0);
  const [hasPermissions, setHasPermissions] = useState(null);
  const [permissionError, setPermissionError] = useState(null);

  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [selectedMicrophone, setSelectedMicrophone] = useState("");
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [speakerSupported, setSpeakerSupported] = useState(true);
  const [isTestingSound, setIsTestingSound] = useState(false);
  const [micTestState, setMicTestState] = useState("idle");
  const [noiseSuppression, setNoiseSuppression] = useState(true);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(null);

  // ✅ socket join UI state
  const [joinStatus, setJoinStatus] = useState("idle"); // idle | connecting | waiting | approved | error

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const playbackAudioRef = useRef(null);

  // Fake / default username (you can pass it as prop later if needed)
  const userName = useMemo(() => localStorage.getItem("name") || "You", []);

  // ✅ Decide role (same as your VideoCallScreen)
  const isHost = useMemo(
    () => (localStorage.getItem("role") || "instructor") === "instructor",
    [],
  );
  const role = isHost ? "instructor" : "student";
  const currentUserAvatar = useMemo(
    () => localStorage.getItem("avatar") || null,
    [],
  );

  const enumerateDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter((d) => d.kind === "videoinput")
        .map((d, i) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${i + 1}`,
        }));
      const audioInputDevices = devices
        .filter((d) => d.kind === "audioinput")
        .map((d, i) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${i + 1}`,
        }));
      const audioOutputDevices = devices
        .filter((d) => d.kind === "audiooutput")
        .map((d, i) => ({
          deviceId: d.deviceId,
          label: d.label || `Speaker ${i + 1}`,
        }));

      setCameras(videoDevices);
      setMicrophones(audioInputDevices);
      setSpeakers(audioOutputDevices);

      if (!selectedSpeaker && audioOutputDevices.length > 0) {
        setSelectedSpeaker(audioOutputDevices[0].deviceId);
      }

      return { videoDevices, audioInputDevices, audioOutputDevices };
    } catch (error) {
      console.error("Error enumerating devices:", error);
      return {
        videoDevices: [],
        audioInputDevices: [],
        audioOutputDevices: [],
      };
    }
  };

  const getMediaStream = async (videoDeviceId, audioDeviceId) => {
    try {
      // stop old stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      const audioConstraints = {
        ...(audioDeviceId ? { deviceId: { exact: audioDeviceId } } : {}),
        noiseSuppression: noiseSuppression,
        echoCancellation: true,
        autoGainControl: true,
      };

      const constraints = {
        video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
        audio: audioConstraints,
      };

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setHasPermissions(true);
      setPermissionError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(mediaStream);
      source.connect(analyser);
      analyser.fftSize = 256;

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const updateMicLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(
            analyserRef.current.frequencyBinCount,
          );
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setMicLevel(Math.min(100, average * 1.5));
        }
        animationFrameRef.current = requestAnimationFrame(updateMicLevel);
      };
      updateMicLevel();

      await enumerateDevices();
    } catch (error) {
      console.error("Error accessing media devices:", error);
      setHasPermissions(false);
      if (error.name === "NotAllowedError") {
        setPermissionError(
          "Camera and microphone access denied. Please allow permissions.",
        );
      } else if (error.name === "NotFoundError") {
        setPermissionError("No camera or microphone found.");
      } else {
        setPermissionError("Could not access camera or microphone.");
      }
    }
  };

  useEffect(() => {
    const audio = document.createElement("audio");
    setSpeakerSupported(typeof audio.setSinkId === "function");
  }, []);

  useEffect(() => {
    getMediaStream();

    return () => {
      try {
        streamRef.current?.getTracks()?.forEach((track) => track.stop());
      } catch {}
      streamRef.current = null;

      try {
        audioContextRef.current?.close();
      } catch {}

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNoiseSuppressionToggle = async (enabled) => {
    setNoiseSuppression(enabled);
    if (streamRef.current) {
      await getMediaStream(selectedCamera, selectedMicrophone);
    }
  };

  const handleCameraChange = async (deviceId) => {
    setSelectedCamera(deviceId);
    await getMediaStream(deviceId, selectedMicrophone);
  };

  const handleMicrophoneChange = async (deviceId) => {
    setSelectedMicrophone(deviceId);
    await getMediaStream(selectedCamera, deviceId);
  };

  const handleSpeakerChange = async (deviceId) => {
    setSelectedSpeaker(deviceId);
    if (testAudioRef.current && testAudioRef.current.setSinkId) {
      try {
        await testAudioRef.current.setSinkId(deviceId);
      } catch (error) {
        console.error("Error setting audio output:", error);
      }
    }
  };

  const testSpeaker = async () => {
    if (isTestingSound) return;
    setIsTestingSound(true);

    try {
      const audioContext = new AudioContext();

      const playTone = (frequency, startTime, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, startTime);
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioContext.currentTime;
      playTone(523.25, now, 0.15);
      playTone(659.25, now + 0.15, 0.15);
      playTone(783.99, now + 0.3, 0.25);

      setTimeout(() => {
        audioContext.close();
        setIsTestingSound(false);
      }, 600);
    } catch (error) {
      console.error("Error playing test sound:", error);
      setIsTestingSound(false);
    }
  };

  const testMicrophone = async () => {
    if (micTestState === "recording") {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    if (micTestState === "playing") {
      if (playbackAudioRef.current) {
        playbackAudioRef.current.pause();
        playbackAudioRef.current.currentTime = 0;
      }
      setMicTestState("idle");
      return;
    }

    if (!streamRef.current) return;

    try {
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
        setRecordedAudioUrl(null);
      }
      recordedChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);

        setMicTestState("playing");
        const audio = new Audio(url);
        playbackAudioRef.current = audio;

        if (selectedSpeaker && audio.setSinkId) {
          audio.setSinkId(selectedSpeaker).catch(() => {});
        }

        audio.onended = () => setMicTestState("idle");
        audio.play().catch(() => setMicTestState("idle"));
      };

      mediaRecorder.start();
      setMicTestState("recording");

      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      }, 3000);
    } catch (error) {
      console.error("Error starting mic test:", error);
      setMicTestState("idle");
    }
  };

  useEffect(() => {
    return () => {
      if (recordedAudioUrl) URL.revokeObjectURL(recordedAudioUrl);
    };
  }, [recordedAudioUrl]);

  useEffect(() => {
    const s = streamRef.current;
    if (!s) return;
    const videoTrack = s.getVideoTracks()[0];
    if (videoTrack) videoTrack.enabled = isCameraOn;
  }, [isCameraOn]);

  useEffect(() => {
    const s = streamRef.current;
    if (!s) return;
    const audioTrack = s.getAudioTracks()[0];
    if (audioTrack) audioTrack.enabled = isMicOn;
  }, [isMicOn]);

  // =========================
  // ✅ SOCKET JOIN LOGIC HERE
  // =========================
  const performJoinHandshake = useCallback(() => {
    // emit join-room always
    socket.emit("join-room", {
      roomId: meetingCode,
      role,
      user: { name: userName, avatar: currentUserAvatar },
    });

    // student needs approval
    if (role === "student") {
      socket.emit("request-join", {
        roomId: meetingCode,
        user: { name: userName, avatar: currentUserAvatar },
      });
      setJoinStatus("waiting");
      toast.info(
        "Please wait for Class Not started yet. Waiting for instructor approval...",
      );
      setTimeout(() => {
        window.history.back();
      }, 5000);
    } else {
      // instructor can enter immediately
      setJoinStatus("approved");
      toast.success("Room created / joined as instructor");
      onJoin({ isMuted: !isMicOn, isCameraOff: !isCameraOn });
    }
  }, [
    meetingCode,
    role,
    userName,
    currentUserAvatar,
    onJoin,
    isMicOn,
    isCameraOn,
  ]);

  useEffect(() => {
    const onConnect = () => {
      console.log("✅ socket connected:", socket.id);
      if (joinStatus === "connecting") performJoinHandshake();
    };

    const onDisconnect = (reason) => {
      console.log("❌ socket disconnected:", reason);
      if (joinStatus === "connecting" || joinStatus === "waiting") {
        setJoinStatus("error");
        toast.error(`Disconnected: ${reason}`);
      }
    };

    const onConnectError = (e) => {
      console.error("⚠️ connect_error:", e?.message);
      setJoinStatus("error");
      toast.error(e?.message || "Socket connection failed");
    };

    const onRoomNotFound = () => {
      setJoinStatus("error");
      toast.error("Room not found. Check meeting code.");
    };

    const onWaitingForApproval = () => {
      setJoinStatus("waiting");
  
      toast.info(
        "Please wait for Class Not started yet. Waiting for instructor approval...",
      );
      setTimeout(() => {
        window.history.back();
      }, 5000);
    };

    const onJoinApproved = () => {
      setJoinStatus("approved");
      toast.success("Approved! Joining meeting...");
      onJoin({ isMuted: !isMicOn, isCameraOff: !isCameraOn });
    };

    const onClassEnded = () => {
      toast.info("Class ended");
      onCancel?.();
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("room-not-found", onRoomNotFound);
    socket.on("waiting-for-approval", onWaitingForApproval);
    socket.on("join-approved", onJoinApproved);
    socket.on("class-ended", onClassEnded);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("room-not-found", onRoomNotFound);
      socket.off("waiting-for-approval", onWaitingForApproval);
      socket.off("join-approved", onJoinApproved);
      socket.off("class-ended", onClassEnded);
    };
  }, [performJoinHandshake, joinStatus, onJoin, onCancel, isMicOn, isCameraOn]);

  const handleJoin = () => {
    if (!meetingCode) {
      toast.error("Meeting code missing");
      return;
    }
    if (hasPermissions === false) {
      toast.error(permissionError || "Camera/Mic not ready");
      return;
    }

    setJoinStatus("connecting");

    if (!socket.connected) {
      console.log("🔌 connecting socket...");
      socket.connect(); // once connected, onConnect triggers handshake
      return;
    }

    performJoinHandshake();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Ready to join?
            </h1>
            <p className="text-muted-foreground">
              Check your camera and microphone before joining
            </p>

            {/* ✅ Debug/status line */}
            <p className="text-xs text-muted-foreground mt-2">
              Role: <span className="font-medium">{role}</span> · Socket:{" "}
              <span className="font-mono">
                {socket.connected ? `connected (${socket.id})` : "disconnected"}
              </span>{" "}
              · Status: <span className="font-medium">{joinStatus}</span>
            </p>
          </div>

          <div className="relative aspect-video bg-video-bg rounded-2xl overflow-hidden mb-6">
            {hasPermissions === false ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <Settings className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{permissionError}</p>
              </div>
            ) : !isCameraOn ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-foreground">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="text-muted-foreground">Camera is off</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            )}

            <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <span className="text-sm font-medium text-foreground">
                {userName}
              </span>
            </div>

            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <span className="text-xs text-muted-foreground">Code: </span>
              <span className="text-sm font-mono text-foreground">
                {meetingCode}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              variant={isMicOn ? "control" : "control-muted"}
              size="icon-lg"
              onClick={() => setIsMicOn(!isMicOn)}
              disabled={
                !hasPermissions ||
                joinStatus === "connecting" ||
                joinStatus === "waiting"
              }
            >
              {isMicOn ? (
                <Mic className="w-5 h-5" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </Button>

            <Button
              variant={isCameraOn ? "control" : "control-muted"}
              size="icon-lg"
              onClick={() => setIsCameraOn(!isCameraOn)}
              disabled={
                !hasPermissions ||
                joinStatus === "connecting" ||
                joinStatus === "waiting"
              }
            >
              {isCameraOn ? (
                <Video className="w-5 h-5" />
              ) : (
                <VideoOff className="w-5 h-5" />
              )}
            </Button>
          </div>

          {hasPermissions && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Camera
                </label>
                <Select
                  value={selectedCamera}
                  onValueChange={handleCameraChange}
                >
                  <SelectTrigger className="w-full bg-secondary border-border">
                    <SelectValue placeholder="Select camera" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    {cameras.map((camera) => (
                      <SelectItem key={camera.deviceId} value={camera.deviceId}>
                        {camera.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Microphone
                </label>
                <div className="flex gap-2">
                  <Select
                    value={selectedMicrophone}
                    onValueChange={handleMicrophoneChange}
                  >
                    <SelectTrigger className="flex-1 bg-secondary border-border">
                      <SelectValue placeholder="Select microphone" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border z-50">
                      {microphones.map((mic) => (
                        <SelectItem key={mic.deviceId} value={mic.deviceId}>
                          {mic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={testMicrophone}
                    disabled={!isMicOn}
                    className="shrink-0"
                    title={
                      micTestState === "idle"
                        ? "Test microphone (records 3s)"
                        : micTestState === "recording"
                          ? "Stop recording"
                          : "Stop playback"
                    }
                  >
                    {micTestState === "idle" && <Mic className="w-4 h-4" />}
                    {micTestState === "recording" && (
                      <Square className="w-4 h-4 text-destructive animate-pulse" />
                    )}
                    {micTestState === "playing" && (
                      <Play className="w-4 h-4 text-primary animate-pulse" />
                    )}
                  </Button>
                </div>
                {micTestState === "recording" && (
                  <p className="text-xs text-destructive animate-pulse">
                    Recording... (3s)
                  </p>
                )}
                {micTestState === "playing" && (
                  <p className="text-xs text-primary animate-pulse">
                    Playing back...
                  </p>
                )}
              </div>

              {speakerSupported && speakers.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Speaker className="w-4 h-4" />
                    Speaker
                  </label>
                  <div className="flex gap-2">
                    <Select
                      value={selectedSpeaker}
                      onValueChange={handleSpeakerChange}
                    >
                      <SelectTrigger className="flex-1 bg-secondary border-border">
                        <SelectValue placeholder="Select speaker" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border z-50">
                        {speakers.map((speaker) => (
                          <SelectItem
                            key={speaker.deviceId}
                            value={speaker.deviceId}
                          >
                            {speaker.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={testSpeaker}
                      disabled={isTestingSound}
                      className="shrink-0"
                      title="Test speaker"
                    >
                      <Volume2
                        className={`w-4 h-4 ${isTestingSound ? "animate-pulse text-primary" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {hasPermissions && (
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <AudioLines className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label
                    htmlFor="noise-suppression"
                    className="text-sm font-medium text-foreground cursor-pointer"
                  >
                    Noise Suppression
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Reduce background noise for cleaner audio
                  </p>
                </div>
              </div>
              <Switch
                id="noise-suppression"
                checked={noiseSuppression}
                onCheckedChange={handleNoiseSuppressionToggle}
              />
            </div>
          )}

          <audio ref={testAudioRef} className="hidden" />

          {hasPermissions && isMicOn && (
            <div className="flex items-center gap-3 mb-6 px-4">
              <Volume2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-75 rounded-full"
                  style={{ width: `${micLevel}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-16 text-right">
                {micLevel > 10 ? "Speaking..." : "Silent"}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${hasPermissions ? "bg-primary/10" : "bg-muted"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${hasPermissions ? "bg-primary" : "bg-muted-foreground"}`}
              >
                {hasPermissions ? (
                  <Check className="w-3 h-3 text-primary-foreground" />
                ) : (
                  <VideoOff className="w-3 h-3 text-background" />
                )}
              </div>
              <span className="text-sm text-foreground">
                {hasPermissions ? "Camera ready" : "Camera unavailable"}
              </span>
            </div>

            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${hasPermissions ? "bg-primary/10" : "bg-muted"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${hasPermissions ? "bg-primary" : "bg-muted-foreground"}`}
              >
                {hasPermissions ? (
                  <Check className="w-3 h-3 text-primary-foreground" />
                ) : (
                  <MicOff className="w-3 h-3 text-background" />
                )}
              </div>
              <span className="text-sm text-foreground">
                {hasPermissions ? "Microphone ready" : "Mic unavailable"}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleJoin}
              disabled={joinStatus === "connecting" || joinStatus === "waiting"}
            >
              <Video className="w-4 h-4 mr-2" />
              {role === "instructor"
                ? "Start Meeting"
                : joinStatus === "waiting"
                  ? "Waiting..."
                  : "Join Meeting"}
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          You can change these settings anytime during the meeting
        </p>
      </div>
    </div>
  );
};

export default PreJoinPreview;
