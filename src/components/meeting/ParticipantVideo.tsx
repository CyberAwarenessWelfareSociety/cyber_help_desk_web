// ParticipantVideo.jsx
import { useEffect, useMemo, useRef } from "react";
import { Mic, MicOff, Crown, Hand, Star, VideoOff } from "lucide-react";
import NetworkQualityIndicator from "./NetworkQualityIndicator";
import AudioLevelVisualizer from "./AudioLevelVisualizer";

const ParticipantVideo = ({
  participant,
  isLocal = false,
  isSpotlighted = false,
  selectedBackground,
}) => {
  const videoRef = useRef(null);

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // ✅ Track-based truth (for OTHER users too)
  const videoTrack = participant?.stream?.getVideoTracks?.()?.[0] || null;
  const audioTrack = participant?.stream?.getAudioTracks?.()?.[0] || null;

  const videoLive =
    !!videoTrack && videoTrack.readyState === "live" && videoTrack.enabled !== false;

  const audioLive =
    !!audioTrack && audioTrack.readyState === "live" && audioTrack.enabled !== false;

  // ✅ Effective states (server flag OR real track state)
  const effectiveCameraOff = !!participant?.isCameraOff || (!!videoTrack && !videoLive);
  const effectiveMuted = !!participant?.isMuted || (!!audioTrack && !audioLive);

  // attach MediaStream to <video>
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // ✅ Only attach stream when camera is effectively ON
    if (participant?.stream && !effectiveCameraOff) {
      try {
        if (el.srcObject !== participant.stream) el.srcObject = participant.stream;
      } catch (e) {
        try {
          el.src = URL.createObjectURL(participant.stream);
        } catch {}
      }

      const play = async () => {
        try {
          await el.play();
        } catch {}
      };
      play();
    } else {
      // ✅ camera off -> detach to avoid frozen frames
      try {
        el.pause?.();
      } catch {}
      try {
        el.srcObject = null;
      } catch {}
      try {
        el.removeAttribute?.("src");
      } catch {}
      try {
        el.load?.();
      } catch {}
    }
  }, [participant?.stream, effectiveCameraOff]);

  const hasRealVideo = !!participant?.stream && !effectiveCameraOff;

  // background style (keeps your existing virtual background look)
  const bgStyle = useMemo(() => {
    const defaultBg = participant.avatar
      ? `url(${participant.avatar}) center/cover`
      : `linear-gradient(135deg, hsl(var(--video-card)) 0%, hsl(var(--secondary)) 100%)`;

    if (!isLocal || !selectedBackground || selectedBackground.type === "none") {
      return defaultBg;
    }

    if (selectedBackground.type === "blur") return defaultBg;

    if (selectedBackground.type === "image" && selectedBackground.value) {
      return `url(${selectedBackground.value}) center/cover`;
    }

    return defaultBg;
  }, [participant.avatar, isLocal, selectedBackground]);

  const hasVirtualBackground =
    isLocal && selectedBackground && selectedBackground.type !== "none";

  return (
    <div
      className={`relative aspect-video rounded-xl overflow-hidden transition-all duration-300 ${
        isSpotlighted
          ? "ring-2 ring-primary shadow-lg shadow-primary/20"
          : participant.isActiveSpeaker
          ? "active-speaker-ring"
          : "ring-1 ring-border/50"
      }`}
    >
      {/* Video / Avatar background */}
      <div className="absolute inset-0 bg-video-card">
        {/* ✅ REAL VIDEO */}
        {hasRealVideo ? (
          <div className="absolute inset-0">
            {/* Optional background layer for local virtual bg */}
            {hasVirtualBackground && (
              <div
                className={`absolute inset-0 ${
                  selectedBackground?.type === "blur" ? "blur-xl scale-110" : ""
                }`}
                style={{ background: bgStyle }}
              />
            )}

            {/* ✅ actual camera feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted={isLocal} // IMPORTANT: local must be muted to avoid echo
              className={`absolute inset-0 w-full h-full object-cover ${
                hasVirtualBackground ? "relative z-10" : ""
              }`}
            />
          </div>
        ) : effectiveCameraOff ? (
          // ✅ Camera off -> show avatar/initials
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-secondary flex items-center justify-center">
              {participant.avatar ? (
                <img
                  src={participant.avatar}
                  alt={participant.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl md:text-3xl font-semibold text-foreground">
                  {getInitials(participant.name)}
                </span>
              )}
            </div>

            {/* ✅ small status text */}
            <div className="absolute bottom-14 px-3 py-1 rounded-full bg-background/70 text-xs text-muted-foreground flex items-center gap-2">
              <VideoOff className="w-4 h-4" />
              Camera off
              {effectiveMuted ? (
                <>
                  <span className="opacity-60">•</span>
                  <MicOff className="w-4 h-4" />
                  Muted
                </>
              ) : null}
            </div>
          </div>
        ) : (
          // No stream yet but camera on -> show loading background
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{ background: bgStyle }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="px-3 py-1 rounded-full bg-background/70 text-xs text-muted-foreground">
                Connecting video...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Virtual background indicator */}
      {hasVirtualBackground && hasRealVideo && (
        <div className="absolute top-3 right-3">
          <div className="px-2 py-1 rounded-full bg-primary/20 backdrop-blur-sm">
            <span className="text-xs font-medium text-primary">
              {selectedBackground.type === "blur" ? "Blur" : "BG"}
            </span>
          </div>
        </div>
      )}

      {/* ✅ Camera-off badge (top-right) */}
      {effectiveCameraOff && (
        <div className="absolute top-3 right-3">
          <div className="px-2 py-1 rounded-full bg-background/70 backdrop-blur-sm flex items-center gap-1">
            <VideoOff className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Off</span>
          </div>
        </div>
      )}

      {/* Bottom overlay with name and status */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {participant.isHost && <Crown className="w-4 h-4 text-primary" />}
            <span className="text-sm font-medium text-foreground truncate">
              {isLocal ? `${participant.name} (You)` : participant.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* {participant.networkQuality && (
              <NetworkQualityIndicator quality={participant.networkQuality} size="sm" />
            )} */}

            {/* <AudioLevelVisualizer
              isActive={participant.isActiveSpeaker || !effectiveMuted}
              isMuted={effectiveMuted}
              barCount={5}
              size="sm"
            /> */}

            {/* ✅ mic icon uses effectiveMuted */}
            {/* {effectiveMuted ? (
              <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                <MicOff className="w-3.5 h-3.5 text-destructive" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                <Mic className="w-3.5 h-3.5 text-foreground" />
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Spotlight indicator */}
      {isSpotlighted && (
        <div className="absolute top-3 left-3">
          <div className="px-2 py-1 rounded-full bg-primary/20 backdrop-blur-sm flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
            <span className="text-xs font-medium text-primary">Spotlight</span>
          </div>
        </div>
      )}

      {/* Active speaker indicator */}
      {participant.isActiveSpeaker && !participant.isHandRaised && !isSpotlighted && (
        <div className="absolute top-3 left-3">
          <div className="px-2 py-1 rounded-full bg-primary/20 backdrop-blur-sm">
            <span className="text-xs font-medium text-primary">Speaking</span>
          </div>
        </div>
      )}

      {/* Hand raised indicator */}
      {participant.isHandRaised && (
        <div className="absolute top-3 left-3">
          <div className="px-2 py-1 rounded-full bg-amber-500/20 backdrop-blur-sm flex items-center gap-1 animate-pulse">
            <Hand className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">Hand raised</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantVideo;
