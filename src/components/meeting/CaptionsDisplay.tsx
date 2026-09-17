import { Caption } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";

interface CaptionsDisplayProps {
  captions: Caption[];
  currentTranscript: string;
  isVisible: boolean;
}

const CaptionsDisplay = ({ captions, currentTranscript, isVisible }: CaptionsDisplayProps) => {
  if (!isVisible) return null;

  // Get the last 3 captions to display
  const recentCaptions = captions.slice(-3);

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-30">
      <div className="bg-background/90 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-border/50">
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {recentCaptions.map((caption) => (
            <div key={caption.id} className="animate-fade-in">
              <span className="font-semibold text-primary text-sm">
                {caption.speaker}:
              </span>{" "}
              <span className="text-foreground">{caption.text}</span>
            </div>
          ))}
          {currentTranscript && (
            <div className="animate-fade-in opacity-70">
              <span className="font-semibold text-primary text-sm">You:</span>{" "}
              <span className="text-foreground italic">{currentTranscript}...</span>
            </div>
          )}
          {recentCaptions.length === 0 && !currentTranscript && (
            <p className="text-muted-foreground text-center text-sm">
              Listening for speech...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptionsDisplay;
