import { useState, useEffect } from "react";
import { Wifi, WifiOff, ArrowDown, ArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface ConnectionStats {
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  latency: number; // ms
  packetLoss: number; // percentage
}

interface MeetingConnectionIndicatorProps {
  stats?: ConnectionStats;
}

const MeetingConnectionIndicator = ({ stats }: MeetingConnectionIndicatorProps) => {
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({
    downloadSpeed: 15.2,
    uploadSpeed: 8.4,
    latency: 24,
    packetLoss: 0.1,
  });

  // Simulate fluctuating connection stats
  useEffect(() => {
    if (stats) {
      setConnectionStats(stats);
      return;
    }

    const interval = setInterval(() => {
      setConnectionStats({
        downloadSpeed: Math.max(1, 15 + (Math.random() - 0.5) * 8),
        uploadSpeed: Math.max(0.5, 8 + (Math.random() - 0.5) * 4),
        latency: Math.max(10, 25 + (Math.random() - 0.5) * 20),
        packetLoss: Math.max(0, Math.random() * 0.5),
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [stats]);

  const getQualityLevel = (): { level: string; color: string; bars: number } => {
    const { downloadSpeed, latency, packetLoss } = connectionStats;

    if (downloadSpeed >= 10 && latency <= 50 && packetLoss < 1) {
      return { level: "Excellent", color: "text-emerald-500", bars: 4 };
    }
    if (downloadSpeed >= 5 && latency <= 100 && packetLoss < 2) {
      return { level: "Good", color: "text-emerald-400", bars: 3 };
    }
    if (downloadSpeed >= 2 && latency <= 200 && packetLoss < 5) {
      return { level: "Fair", color: "text-amber-400", bars: 2 };
    }
    if (downloadSpeed > 0) {
      return { level: "Poor", color: "text-red-400", bars: 1 };
    }
    return { level: "Disconnected", color: "text-red-500", bars: 0 };
  };

  const quality = getQualityLevel();
  const barHeights = [4, 6, 8, 10];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 cursor-default">
          {quality.bars === 0 ? (
            <WifiOff className={`w-4 h-4 ${quality.color}`} />
          ) : (
            <div className="flex items-end gap-0.5">
              {barHeights.map((height, index) => (
                <div
                  key={index}
                  className={`w-1 rounded-sm transition-colors ${
                    index < quality.bars 
                      ? index < 2 
                        ? quality.bars <= 2 ? "bg-amber-400" : "bg-emerald-400"
                        : "bg-emerald-400"
                      : "bg-muted-foreground/30"
                  }`}
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          )}
          <span className={`text-xs font-medium ${quality.color}`}>
            {quality.level}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="w-48">
        <div className="space-y-2">
          <div className="text-xs font-semibold text-foreground">Connection Stats</div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <ArrowDown className="w-3 h-3" /> Download
              </span>
              <span className="font-mono text-foreground">
                {connectionStats.downloadSpeed.toFixed(1)} Mbps
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <ArrowUp className="w-3 h-3" /> Upload
              </span>
              <span className="font-mono text-foreground">
                {connectionStats.uploadSpeed.toFixed(1)} Mbps
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Latency</span>
              <span className="font-mono text-foreground">
                {Math.round(connectionStats.latency)} ms
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Packet Loss</span>
              <span className="font-mono text-foreground">
                {connectionStats.packetLoss.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default MeetingConnectionIndicator;