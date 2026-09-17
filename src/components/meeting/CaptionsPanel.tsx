import { X, Trash2, Mic, MicOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Caption } from "@/hooks/useSpeechRecognition";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CaptionsPanelProps {
  captions: Caption[];
  currentTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onClearCaptions: () => void;
  onClose: () => void;
}

const CaptionsPanel = ({
  captions,
  currentTranscript,
  isListening,
  isSupported,
  onStartListening,
  onStopListening,
  onClearCaptions,
  onClose,
}: CaptionsPanelProps) => {
  return (
    <div className="w-80 h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold">Live Captions</h2>
          {isListening && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Controls */}
      <div className="p-3 border-b border-border flex gap-2">
        {isSupported ? (
          <>
            <Button
              variant={isListening ? "destructive" : "default"}
              size="sm"
              className="flex-1"
              onClick={isListening ? onStopListening : onStartListening}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearCaptions}
              disabled={captions.length === 0}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Alert variant="destructive" className="w-full">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Speech recognition is not supported in this browser. Try Chrome or Edge.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Captions List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {captions.length === 0 && !currentTranscript ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              {isListening
                ? "Listening for speech..."
                : "Click Start to begin live captions"}
            </p>
          ) : (
            <>
              {captions.map((caption) => (
                <div
                  key={caption.id}
                  className="bg-muted/50 rounded-lg p-3 animate-fade-in"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-primary">
                      {caption.speaker}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(caption.timestamp, "HH:mm:ss")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{caption.text}</p>
                </div>
              ))}
              {currentTranscript && (
                <div className="bg-muted/30 rounded-lg p-3 border border-dashed border-border animate-pulse">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm text-primary">You</span>
                    <span className="text-xs text-muted-foreground">now</span>
                  </div>
                  <p className="text-sm text-foreground/70 italic">
                    {currentTranscript}...
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer info */}
      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          {captions.length} caption{captions.length !== 1 ? "s" : ""} recorded
        </p>
      </div>
    </div>
  );
};

export default CaptionsPanel;
