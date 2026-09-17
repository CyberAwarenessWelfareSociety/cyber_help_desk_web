// ✅ ControlBar.tsx (FULL UPDATED WITH MOBILE LABELS)

import React, { useMemo } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  MonitorUp,
  MonitorOff,
  Circle,
  Users,
  Hand,
  VolumeX,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ControlBar = ({
  isMuted,
  isCameraOff,
  isScreenSharing,
  isRecording,
  recordingDuration = 0,
  isHandRaised,
  isParticipantsOpen,

  // ✅ host controls
  isHost = false,
  hostCanRecord = true,
  hostCanShareScreen = true,
  hideForNonHost = false,

  onToggleMute,
  onToggleCamera,
  onToggleScreenShare,
  onToggleRecording,
  onToggleHandRaise,
  onToggleParticipants,
  onMuteAll,
  onEndCall,
}) => {
  const formattedDuration = useMemo(() => {
    const total = Number.isFinite(recordingDuration)
      ? Math.max(0, recordingDuration)
      : 0;
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    const mm = String(mins).padStart(2, "0");
    const ss = String(secs).padStart(2, "0");
    return `${mm}:${ss}`;
  }, [recordingDuration]);

  const canUseRecord = isHost && hostCanRecord;
  const canUseShare = isHost && hostCanShareScreen;

  const mobileLabel = "text-[10px] sm:hidden leading-none";

  return (
    <div className="h-auto py-3 px-2 flex items-center justify-between sm:justify-center gap-2 sm:gap-3 bg-card/50 backdrop-blur-sm border-t border-border/50">

      {/* 🎤 Mic */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isMuted ? "control-muted" : "control-active"}
            size="icon-lg"
            onClick={onToggleMute}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className={mobileLabel}>
              {isMuted ? "Unmute" : "Mic"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isMuted ? "Unmute" : "Mute"}</p>
        </TooltipContent>
      </Tooltip>

      {/* 🎥 Video */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isCameraOff ? "control-muted" : "control-active"}
            size="icon-lg"
            onClick={onToggleCamera}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            <span className={mobileLabel}>Video</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCameraOff ? "Turn on camera" : "Turn off camera"}</p>
        </TooltipContent>
      </Tooltip>

      {/* 🖥 Share Screen */}
      {(!hideForNonHost || isHost) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button
                variant={isScreenSharing ? "control-share" : "control"}
                size="icon-lg"
                onClick={canUseShare ? onToggleScreenShare : undefined}
                disabled={!canUseShare}
                className={`flex flex-col items-center gap-1 h-auto py-2 ${
                  !canUseShare ? "opacity-40 grayscale cursor-not-allowed" : ""
                }`}
              >
                {isScreenSharing ? (
                  <MonitorOff className="w-5 h-5" />
                ) : (
                  <MonitorUp className="w-5 h-5" />
                )}
                <span className={mobileLabel}>Share</span>
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {!isHost ? (
              <p className="flex items-center gap-2">
                <Lock className="w-4 h-4" /> Only host can share
              </p>
            ) : (
              <p>{isScreenSharing ? "Stop sharing" : "Share screen"}</p>
            )}
          </TooltipContent>
        </Tooltip>
      )}

      {/* 🔴 Record */}
      {(!hideForNonHost || isHost) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col items-center">
              <Button
                variant={isRecording ? "control-record" : "control"}
                size="icon-lg"
                onClick={canUseRecord ? onToggleRecording : undefined}
                disabled={!canUseRecord}
                className={`flex flex-col items-center gap-1 h-auto py-2 ${
                  !canUseRecord ? "opacity-40 grayscale cursor-not-allowed" : ""
                }`}
              >
                <Circle
                  className={`w-5 h-5 ${
                    isRecording ? "fill-red-500 animate-pulse" : ""
                  }`}
                />
                <span className={mobileLabel}>Record</span>
              </Button>

              {/* Desktop timer pill */}
              {isRecording && (
                <div className="hidden sm:flex mt-2 items-center gap-2 px-3 py-1 rounded-full bg-background/60 border border-border/50 text-xs font-medium">
                  <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-500">REC</span>
                  <span className="text-muted-foreground">
                    {formattedDuration}
                  </span>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {!isHost ? (
              <p className="flex items-center gap-2">
                <Lock className="w-4 h-4" /> Only host can record
              </p>
            ) : (
              <p>{isRecording ? "Stop recording" : "Start recording"}</p>
            )}
          </TooltipContent>
        </Tooltip>
      )}

      {/* ✋ Raise Hand */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isHandRaised ? "control-hand" : "control"}
            size="icon-lg"
            onClick={onToggleHandRaise}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Hand className="w-5 h-5" />
            <span className={mobileLabel}>
              {isHandRaised ? "Lower" : "Hand"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isHandRaised ? "Lower hand" : "Raise hand"}</p>
        </TooltipContent>
      </Tooltip>

      {/* 👥 Participants */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isParticipantsOpen ? "control-participants" : "control"}
            size="icon-lg"
            onClick={onToggleParticipants}
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Users className="w-5 h-5" />
            <span className={mobileLabel}>People</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isParticipantsOpen ? "Hide participants" : "Show participants"}</p>
        </TooltipContent>
      </Tooltip>

      {/* 🔇 Mute All (Host Only) */}
      {isHost && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="control-muted"
              size="icon-lg"
              onClick={onMuteAll}
              className="flex flex-col items-center gap-1 h-auto py-2"
            >
              <VolumeX className="w-5 h-5" />
              <span className={mobileLabel}>Mute</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mute all participants</p>
          </TooltipContent>
        </Tooltip>
      )}

      {/* 📞 End Call */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="control-danger"
            size="icon-lg"
            onClick={onEndCall}
            className="flex flex-col items-center gap-1 h-auto py-2 px-4"
          >
            <PhoneOff className="w-5 h-5" />
            <span className={mobileLabel}>End</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Leave call</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ControlBar;