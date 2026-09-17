import { useState, useEffect } from "react";

interface AudioLevelVisualizerProps {
  isActive: boolean;
  isMuted: boolean;
  barCount?: number;
  size?: "sm" | "md";
}

const AudioLevelVisualizer = ({ 
  isActive, 
  isMuted, 
  barCount = 5,
  size = "sm" 
}: AudioLevelVisualizerProps) => {
  const [levels, setLevels] = useState<number[]>(Array(barCount).fill(0));

  useEffect(() => {
    if (isMuted || !isActive) {
      setLevels(Array(barCount).fill(0));
      return;
    }

    // Simulate audio levels when active speaker
    const interval = setInterval(() => {
      setLevels(
        Array(barCount)
          .fill(0)
          .map(() => Math.random() * 100)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isMuted, barCount]);

  const barWidth = size === "sm" ? "w-0.5" : "w-1";
  const maxHeight = size === "sm" ? 12 : 16;
  const gap = size === "sm" ? "gap-0.5" : "gap-1";

  return (
    <div className={`flex items-end ${gap}`} style={{ height: `${maxHeight}px` }}>
      {levels.map((level, index) => {
        const height = isMuted ? 2 : Math.max(2, (level / 100) * maxHeight);
        return (
          <div
            key={index}
            className={`${barWidth} rounded-full transition-all duration-75 ${
              isMuted 
                ? "bg-muted-foreground/30" 
                : level > 60 
                  ? "bg-emerald-400" 
                  : level > 30 
                    ? "bg-emerald-500" 
                    : "bg-emerald-600"
            }`}
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
};

export default AudioLevelVisualizer;