import { useState, useRef, useEffect } from "react";
import { Minimize2, Maximize2, Move } from "lucide-react";
import { Participant } from "@/types/meeting";
import { VirtualBackgroundOption } from "./VirtualBackgroundSelector";
import ParticipantVideo from "./ParticipantVideo";
import { Button } from "@/components/ui/button";

interface LocalVideoPiPProps {
  participant: Participant;
  selectedBackground?: VirtualBackgroundOption;
  isVisible: boolean;
}

type Position = "bottom-right" | "bottom-left" | "top-right" | "top-left";

const LocalVideoPiP = ({ participant, selectedBackground, isVisible }: LocalVideoPiPProps) => {
  const [position, setPosition] = useState<Position>("bottom-right");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [customPosition, setCustomPosition] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const positionClasses: Record<Position, string> = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
  };

  const cyclePosition = () => {
    setCustomPosition(null);
    const positions: Position[] = ["bottom-right", "bottom-left", "top-left", "top-right"];
    const currentIndex = positions.indexOf(position);
    setPosition(positions[(currentIndex + 1) % positions.length]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const parent = containerRef.current?.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const containerHeight = containerRef.current?.offsetHeight || 0;

      const x = Math.max(0, Math.min(e.clientX - parentRect.left - dragOffset.x, parentRect.width - containerWidth));
      const y = Math.max(0, Math.min(e.clientY - parentRect.top - dragOffset.y, parentRect.height - containerHeight));

      setCustomPosition({ x, y });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className={`absolute z-20 transition-all duration-300 ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${customPosition ? "" : positionClasses[position]}`}
      style={
        customPosition
          ? {
              left: customPosition.x,
              top: customPosition.y,
              transition: isDragging ? "none" : "all 0.3s ease",
            }
          : undefined
      }
    >
      <div
        className={`relative group rounded-xl overflow-hidden shadow-xl shadow-background/50 border border-border/50 transition-all duration-300 ${
          isMinimized ? "w-16 h-16" : "w-40 md:w-48 aspect-video"
        }`}
      >
        {/* Drag handle */}
        <div
          className="absolute top-0 left-0 right-0 h-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-background/80 to-transparent flex items-center justify-center cursor-grab"
          onMouseDown={handleMouseDown}
        >
          <Move className="w-3 h-3 text-muted-foreground" />
        </div>

        {/* Controls */}
        <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={cyclePosition}
          >
            <Move className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <Maximize2 className="w-3 h-3" />
            ) : (
              <Minimize2 className="w-3 h-3" />
            )}
          </Button>
        </div>

        {/* Video content */}
        {isMinimized ? (
          <div className="w-full h-full bg-video-card flex items-center justify-center">
            {participant.avatar ? (
              <img
                src={participant.avatar}
                alt={participant.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-foreground">
                {participant.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </span>
            )}
          </div>
        ) : (
          <ParticipantVideo
            participant={participant}
            isLocal={true}
            selectedBackground={selectedBackground}
          />
        )}

        {/* "You" label */}
        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm">
          <span className="text-[10px] font-medium text-muted-foreground">You</span>
        </div>
      </div>
    </div>
  );
};

export default LocalVideoPiP;
