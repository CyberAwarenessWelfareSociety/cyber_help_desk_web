import { useState, useRef, useEffect } from "react";
import { Minimize2, Maximize2 } from "lucide-react";
import { Monitor, AppWindow, Chrome, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ScreenShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScreenShare: (stream: MediaStream) => void;
}

const ScreenShareModal = ({ isOpen, onClose, onScreenShare }: ScreenShareModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

const startScreenShare = async (displaySurface?: "monitor" | "window" | "browser") => {
  setIsLoading(true);

  try {
    const constraints: any = {
      video: {
        displaySurface: displaySurface,
      },
      audio: true, // ✅ enable system audio
    };

    const stream = await navigator.mediaDevices.getDisplayMedia(constraints);

    onScreenShare(stream);
    onClose();

    toast.success("Screen sharing started");
  } catch (error: any) {
    if (error.name === "NotAllowedError") {
      toast.error("Screen sharing was cancelled");
    } else {
      toast.error("Failed to start screen sharing");
      console.error("Screen share error:", error);
    }
  } finally {
    setIsLoading(false);
  }
};

  const shareOptions = [
    {
      id: "browser",
      title: "Browser Tab",
      description: "Share a specific browser tab with audio",
      icon: Chrome,
      displaySurface: "browser" as const,
    },
    {
      id: "window",
      title: "Window",
      description: "Share an application window",
      icon: AppWindow,
      displaySurface: "window" as const,
    },
    {
      id: "monitor",
      title: "Entire Screen",
      description: "Share your full screen",
      icon: Monitor,
      displaySurface: "monitor" as const,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Share your screen</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {shareOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => startScreenShare(option.displaySurface)}
              disabled={isLoading}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-all duration-200 group disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <option.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground">{option.title}</p>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Your browser will ask which content you want to share
        </p>
      </DialogContent>
    </Dialog>
  );
};

interface ScreenSharePreviewProps {
  stream: MediaStream;
  onStopSharing: () => void;
}

export const ScreenSharePreview = ({ stream, onStopSharing }: ScreenSharePreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden ring-2 ring-primary shadow-glow animate-fade-in">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-contain bg-video-bg"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
      
      {/* Label */}
      <div className="absolute top-3 left-3">
        <div className="px-3 py-1.5 rounded-full bg-primary flex items-center gap-2">
          <Monitor className="w-4 h-4 text-primary-foreground" />
          <span className="text-sm font-medium text-primary-foreground">You are presenting</span>
        </div>
      </div>

      {/* Stop button */}
      <div className="absolute bottom-3 right-3">
        <Button
          variant="destructive"
          size="sm"
          onClick={onStopSharing}
          className="shadow-lg"
        >
          <X className="w-4 h-4 mr-1" />
          Stop sharing
        </Button>
      </div>
    </div>
  );
};

// Picture-in-Picture component for local camera during screen sharing
interface PictureInPictureProps {
  className?: string;
}

export const PictureInPicture = ({ className }: PictureInPictureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (error) {
        console.error("Failed to access camera for PiP:", error);
        setHasCamera(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    if (isDragging) {
      window.addEventListener("mouseup", handleGlobalMouseUp);
      window.addEventListener("mousemove", handleGlobalMouseMove);
    }

    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
      window.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [isDragging]);

  if (!hasCamera) return null;

  return (
    <div
      className={`fixed z-50 cursor-move select-none transition-all duration-300 ${className}`}
      style={{ left: position.x, bottom: position.y }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {isMinimized ? (
        // Minimized state - small circular button
        <button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center ring-2 ring-primary/50 shadow-glow transition-all hover:scale-110"
        >
          <Maximize2 className="w-5 h-5 text-primary-foreground" />
        </button>
      ) : (
        // Expanded state - full PiP window
        <div className="relative w-48 h-36 rounded-xl overflow-hidden ring-2 ring-primary/50 shadow-glow animate-scale-in">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover bg-video-bg mirror"
          />
          {/* Minimize button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 hover:bg-background flex items-center justify-center transition-all hover:scale-110"
          >
            <Minimize2 className="w-4 h-4 text-foreground" />
          </button>
          {/* Label */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-center">
            <span className="px-2 py-0.5 rounded-full bg-background/80 text-xs text-foreground">
              You
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenShareModal;

