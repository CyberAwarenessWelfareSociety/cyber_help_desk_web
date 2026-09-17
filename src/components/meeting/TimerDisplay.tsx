import { useState, useEffect, useCallback } from "react";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  timeLeft: number;
  isRunning: boolean;
  initialTime: number;
}

const TimerDisplay = ({ timeLeft, isRunning, initialTime }: TimerDisplayProps) => {
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const isExpired = timeLeft === 0 && initialTime > 0;
  const isLow = timeLeft <= 30 && timeLeft > 0;

  return (
    <div className={cn(
      "fixed top-20 left-1/2 -translate-x-1/2 z-30",
      "flex items-center gap-2 px-4 py-2 rounded-full",
      "bg-card/90 backdrop-blur-sm border border-border shadow-lg",
      "animate-fade-in",
      isExpired && "bg-destructive/20 border-destructive",
      isLow && "bg-amber-500/20 border-amber-500"
    )}>
      <Timer className={cn(
        "w-5 h-5",
        isExpired ? "text-destructive" : isLow ? "text-amber-500" : "text-primary"
      )} />
      <span className={cn(
        "text-2xl font-bold font-mono",
        isExpired ? "text-destructive animate-pulse" : isLow ? "text-amber-500" : "text-foreground"
      )}>
        {formatTime(timeLeft)}
      </span>
      {isRunning && (
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      )}
    </div>
  );
};

export default TimerDisplay;
