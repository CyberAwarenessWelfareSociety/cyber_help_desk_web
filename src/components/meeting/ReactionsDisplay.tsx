import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface Reaction {
  id: string;
  emoji: string;
  x: number;
  timestamp: number;
}

interface ReactionsDisplayProps {
  reactions: Reaction[];
}

const ReactionsDisplay = ({ reactions }: ReactionsDisplayProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {reactions.map((reaction) => (
        <FloatingEmoji key={reaction.id} emoji={reaction.emoji} x={reaction.x} />
      ))}
    </div>
  );
};

const FloatingEmoji = ({ emoji, x }: { emoji: string; x: number }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="absolute text-5xl animate-float-up"
      style={{
        left: `${x}%`,
        bottom: "100px",
      }}
    >
      {emoji}
    </div>
  );
};

export default ReactionsDisplay;
