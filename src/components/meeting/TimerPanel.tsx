import { useState, useEffect, useCallback } from "react";
import { X, Play, Pause, RotateCcw, Eye, EyeOff, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimerPanelProps {
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
  onClose: () => void;
}

const presetTimes = [
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "15 min", seconds: 900 },
  { label: "30 min", seconds: 1800 },
];

const TimerPanel = ({ isVisible, onVisibilityChange, onClose }: TimerPanelProps) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [initialTime, setInitialTime] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const handlePresetSelect = (seconds: number) => {
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setIsRunning(false);
    setIsExpired(false);
  };

  const handleAdjustTime = (amount: number) => {
    const newTime = Math.max(0, Math.min(3600, timeLeft + amount));
    setTimeLeft(newTime);
    setInitialTime(newTime);
    setIsExpired(false);
  };

  const handleToggleRunning = () => {
    if (timeLeft === 0) {
      setTimeLeft(initialTime);
      setIsExpired(false);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
    setIsExpired(false);
  };

  const progress = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Meeting Timer</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Timer Display */}
      <div className="p-6 flex flex-col items-center gap-4">
        <div className="relative w-48 h-48">
          {/* Progress Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke={isExpired ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={553}
              strokeDashoffset={553 - (553 * progress) / 100}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          
          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn(
              "text-4xl font-bold font-mono",
              isExpired ? "text-destructive animate-pulse" : "text-foreground"
            )}>
              {formatTime(timeLeft)}
            </span>
            {isExpired && (
              <span className="text-sm text-destructive mt-1">Time's up!</span>
            )}
          </div>
        </div>

        {/* Time Adjust Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustTime(-30)}
            disabled={isRunning}
          >
            <Minus className="w-3 h-3 mr-1" />
            30s
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustTime(-60)}
            disabled={isRunning}
          >
            <Minus className="w-3 h-3 mr-1" />
            1m
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustTime(60)}
            disabled={isRunning}
          >
            <Plus className="w-3 h-3 mr-1" />
            1m
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdjustTime(300)}
            disabled={isRunning}
          >
            <Plus className="w-3 h-3 mr-1" />
            5m
          </Button>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant={isRunning ? "secondary" : "default"}
            size="lg"
            onClick={handleToggleRunning}
            className="w-24"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Visibility Toggle */}
        <Button
          variant={isVisible ? "default" : "outline"}
          size="sm"
          onClick={() => onVisibilityChange(!isVisible)}
          className="w-full"
        >
          {isVisible ? (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Visible to all
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Only you can see
            </>
          )}
        </Button>
      </div>

      {/* Presets */}
      <div className="p-4 border-t border-border">
        <p className="text-sm text-muted-foreground mb-3">Quick presets:</p>
        <div className="grid grid-cols-3 gap-2">
          {presetTimes.map((preset) => (
            <Button
              key={preset.seconds}
              variant="outline"
              size="sm"
              onClick={() => handlePresetSelect(preset.seconds)}
              disabled={isRunning}
              className={cn(
                initialTime === preset.seconds && !isRunning && "border-primary bg-primary/10"
              )}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimerPanel;
