import { useState, useEffect } from "react";
import { Clock, Users, Video, Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WaitingRoomProps {
  meetingCode: string;
  userName: string;
  onLeave: () => void;
}

const WaitingRoom = ({ meetingCode, userName, onLeave }: WaitingRoomProps) => {
  const [waitTime, setWaitTime] = useState(0);
  const [dots, setDots] = useState("");

  // Animate waiting dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  // Track wait time
  useEffect(() => {
    const timer = setInterval(() => {
      setWaitTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatWaitTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Card */}
        <div className="bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Waiting to join{dots}
            </h1>
            <p className="text-muted-foreground">
              The host will let you in soon
            </p>
          </div>

          {/* Meeting info */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{userName}</p>
                <p className="text-sm text-muted-foreground">Joining as guest</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Meeting code</span>
              </div>
              <span className="font-mono text-foreground">{meetingCode}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Waiting time</span>
              </div>
              <span className="font-mono text-foreground">{formatWaitTime(waitTime)}</span>
            </div>
          </div>

          {/* Device status */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Video className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Camera ready</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Mic className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground">Mic ready</span>
            </div>
          </div>

          {/* Leave button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={onLeave}
          >
            Leave waiting room
          </Button>
        </div>

        {/* Tips */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Make sure your camera and microphone are working while you wait
        </p>
      </div>
    </div>
  );
};

export default WaitingRoom;
