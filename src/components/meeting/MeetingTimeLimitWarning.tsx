import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Clock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MeetingTimeLimitWarningProps {
  remainingSeconds: number;
  isLimited: boolean;
  onUpgrade: () => void;
  onEndCall: () => void;
}

const MeetingTimeLimitWarning = ({
  remainingSeconds,
  isLimited,
  onUpgrade,
  onEndCall,
}: MeetingTimeLimitWarningProps) => {
  const [showWarning, setShowWarning] = useState(false);
  const [showFinalWarning, setShowFinalWarning] = useState(false);
  const [hasShown5MinWarning, setHasShown5MinWarning] = useState(false);
  const [hasShown2MinWarning, setHasShown2MinWarning] = useState(false);
  const [hasShown1MinWarning, setHasShown1MinWarning] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isLimited) return;

    // 5 minute warning (35 minutes elapsed = 300 seconds remaining)
    if (remainingSeconds <= 300 && remainingSeconds > 120 && !hasShown5MinWarning) {
      setShowWarning(true);
      setHasShown5MinWarning(true);
    }

    // 2 minute warning
    if (remainingSeconds <= 120 && remainingSeconds > 60 && !hasShown2MinWarning) {
      setShowWarning(true);
      setHasShown2MinWarning(true);
    }

    // 1 minute warning - show final dialog
    if (remainingSeconds <= 60 && remainingSeconds > 0 && !hasShown1MinWarning) {
      setShowFinalWarning(true);
      setHasShown1MinWarning(true);
    }

    // Time's up - end the call
    if (remainingSeconds <= 0) {
      onEndCall();
    }
  }, [remainingSeconds, isLimited, hasShown5MinWarning, hasShown2MinWarning, hasShown1MinWarning, onEndCall]);

  if (!isLimited) return null;

  return (
    <>
      {/* Persistent timer banner when under 5 minutes */}
      {remainingSeconds <= 300 && remainingSeconds > 0 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className={`flex items-center gap-3 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm ${
            remainingSeconds <= 60 
              ? "bg-destructive/90 text-destructive-foreground" 
              : remainingSeconds <= 120 
                ? "bg-amber-500/90 text-white"
                : "bg-card/90 border border-border"
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-medium">
              {remainingSeconds <= 60 ? "Meeting ending in " : "Time remaining: "}
              {formatTime(remainingSeconds)}
            </span>
            <Button
              size="sm"
              variant={remainingSeconds <= 60 ? "secondary" : "default"}
              className="h-7 text-xs"
              onClick={onUpgrade}
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade
            </Button>
          </div>
        </div>
      )}

      {/* Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-amber-500/10">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <DialogTitle className="text-xl">Meeting Time Limit</DialogTitle>
            <DialogDescription className="text-base pt-2">
              Your Basic plan has a 40-minute meeting limit. You have{" "}
              <span className="font-semibold text-foreground">{formatTime(remainingSeconds)}</span> remaining.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-secondary/50 rounded-lg p-4 my-4">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold">Upgrade to Premium</p>
                <p className="text-sm text-muted-foreground">
                  Get unlimited meeting duration for just ₹599/month
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowWarning(false)}>
              Continue Meeting
            </Button>
            <Button className="flex-1" onClick={onUpgrade}>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Final Warning Dialog - Cannot be dismissed */}
      <Dialog open={showFinalWarning} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-destructive/10">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <DialogTitle className="text-xl text-destructive">Meeting Ending Soon!</DialogTitle>
            <DialogDescription className="text-base pt-2">
              This meeting will automatically end in{" "}
              <span className="font-bold text-destructive">{formatTime(remainingSeconds)}</span>.
              <br />
              Upgrade now to continue your meeting without interruption.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-primary/10 rounded-lg p-4 my-4 border border-primary/20">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold">Premium Plan - ₹599/month</p>
                <p className="text-sm text-muted-foreground">
                  Unlimited meetings, virtual backgrounds, recording & more
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                setShowFinalWarning(false);
                onEndCall();
              }}
            >
              End Meeting
            </Button>
            <Button className="flex-1" onClick={onUpgrade}>
              <Crown className="w-4 h-4 mr-2" />
              Upgrade & Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MeetingTimeLimitWarning;
