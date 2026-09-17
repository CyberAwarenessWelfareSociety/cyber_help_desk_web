import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ReactionsPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onReact: (emoji: string) => void;
}

const reactions = [
  { emoji: "👍", label: "Thumbs up" },
  { emoji: "👏", label: "Clap" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "😂", label: "Laugh" },
  { emoji: "😮", label: "Wow" },
  { emoji: "🎉", label: "Celebrate" },
  { emoji: "🔥", label: "Fire" },
  { emoji: "💯", label: "100" },
];

const ReactionsPicker = ({ isOpen, onClose, onReact }: ReactionsPickerProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border border-border rounded-xl p-2 shadow-xl animate-scale-in">
      <div className="flex gap-1">
        {reactions.map(({ emoji, label }) => (
          <Tooltip key={emoji}>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  onReact(emoji);
                  onClose();
                }}
                className="w-10 h-10 flex items-center justify-center text-2xl rounded-lg hover:bg-muted transition-all hover:scale-125 active:scale-95"
              >
                {emoji}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default ReactionsPicker;
