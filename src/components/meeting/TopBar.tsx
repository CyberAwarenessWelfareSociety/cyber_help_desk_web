import { Copy, Clock, Circle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import MeetingConnectionIndicator from "./MeetingConnectionIndicator";

interface TopBarProps {
  meetingCode: string;
  isRecording?: boolean;
  recordingDuration?: number;
  isMeetingLocked?: boolean;
  meetingStartTime?: Date;
}

const TopBar = ({ 
  meetingCode, 
  isRecording = false, 
  recordingDuration = 0, 
  isMeetingLocked = false,
  meetingStartTime
}: TopBarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [meetingDuration, setMeetingDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!meetingStartTime) return;
    
    const updateDuration = () => {
      const elapsed = Math.floor((Date.now() - meetingStartTime.getTime()) / 1000);
      setMeetingDuration(elapsed);
    };
    
    updateDuration();
    const timer = setInterval(updateDuration, 1000);
    return () => clearInterval(timer);
  }, [meetingStartTime]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`meetflow.app/${meetingCode}`);
    toast.success("Meeting link copied to clipboard");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-16 px-4 flex items-center justify-between bg-card/50 backdrop-blur-sm border-b border-border/50">
      {/* Left - Meeting info */}
      <div className="flex items-center gap-4">
 

        {/* Meeting locked indicator */}
        {isMeetingLocked && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 animate-fade-in">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">Locked</span>
          </div>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 animate-fade-in">
            <Circle className="w-3 h-3 fill-destructive text-destructive animate-pulse" />
            <span className="text-sm font-medium text-destructive">REC</span>
            <span className="text-sm font-mono text-destructive/80">{formatDuration(recordingDuration)}</span>
          </div>
        )}
      </div>

      {/* Center - Logo */}
      <div className="hidden md:flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <span className="text-primary font-bold text-sm">L</span>
        </div>
        <span className="font-semibold text-foreground">live classes</span>
      </div>

      {/* Right - Connection, Duration and Time */}
      <div className="flex items-center gap-3">
        {/* Connection quality */}
        <MeetingConnectionIndicator />
        
        {/* Meeting duration */}
        {meetingStartTime && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-mono text-primary font-medium">{formatDuration(meetingDuration)}</span>
          </div>
        )}
        
        {/* Current time */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{formatTime(currentTime)}</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
