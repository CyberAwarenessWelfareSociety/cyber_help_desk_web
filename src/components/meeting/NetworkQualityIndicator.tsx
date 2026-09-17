import { Wifi, WifiOff } from "lucide-react";
import { NetworkQuality } from "@/types/meeting";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NetworkQualityIndicatorProps {
  quality: NetworkQuality;
  size?: "sm" | "md";
}

const NetworkQualityIndicator = ({ quality, size = "sm" }: NetworkQualityIndicatorProps) => {
  const getConfig = () => {
    switch (quality) {
      case "excellent":
        return {
          bars: 4,
          color: "bg-emerald-500",
          label: "Excellent connection",
        };
      case "good":
        return {
          bars: 3,
          color: "bg-emerald-400",
          label: "Good connection",
        };
      case "fair":
        return {
          bars: 2,
          color: "bg-amber-400",
          label: "Fair connection",
        };
      case "poor":
        return {
          bars: 1,
          color: "bg-red-400",
          label: "Poor connection",
        };
      case "disconnected":
        return {
          bars: 0,
          color: "bg-red-500",
          label: "Disconnected",
        };
      default:
        return {
          bars: 4,
          color: "bg-emerald-500",
          label: "Excellent connection",
        };
    }
  };

  const config = getConfig();
  const barHeights = size === "sm" ? [4, 6, 8, 10] : [6, 9, 12, 15];
  const gap = size === "sm" ? "gap-0.5" : "gap-1";

  if (quality === "disconnected") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center">
            <WifiOff className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} text-red-500`} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">{config.label}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`flex items-end ${gap}`}>
          {barHeights.map((height, index) => (
            <div
              key={index}
              className={`${size === "sm" ? "w-1" : "w-1.5"} rounded-sm transition-colors ${
                index < config.bars ? config.color : "bg-muted-foreground/30"
              }`}
              style={{ height: `${height}px` }}
            />
          ))}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p className="text-xs">{config.label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default NetworkQualityIndicator;