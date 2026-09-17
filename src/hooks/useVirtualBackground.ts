import { useState, useRef, useCallback, useEffect } from "react";
import { pipeline, env } from "@huggingface/transformers";
import type { BackgroundType, VirtualBackgroundOption } from "@/components/meeting/VirtualBackgroundSelector";

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface UseVirtualBackgroundProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  enabled: boolean;
  background: VirtualBackgroundOption;
}

export const useVirtualBackground = ({
  videoRef,
  canvasRef,
  enabled,
  background,
}: UseVirtualBackgroundProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const segmenterRef = useRef<any>(null);
  const animationFrameRef = useRef<number>();
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);

  // Load the segmentation model
  const loadModel = useCallback(async () => {
    if (segmenterRef.current) return;
    
    setIsProcessing(true);
    try {
      console.log("Loading segmentation model...");
      segmenterRef.current = await pipeline(
        "image-segmentation",
        "Xenova/segformer-b0-finetuned-ade-512-512",
        { device: "webgpu" }
      );
      setIsModelLoaded(true);
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Failed to load model:", error);
      // Fallback to CPU
      try {
        segmenterRef.current = await pipeline(
          "image-segmentation",
          "Xenova/segformer-b0-finetuned-ade-512-512"
        );
        setIsModelLoaded(true);
        console.log("Model loaded on CPU");
      } catch (cpuError) {
        console.error("Failed to load model on CPU:", cpuError);
      }
    }
    setIsProcessing(false);
  }, []);

  // Load background image when needed
  useEffect(() => {
    if (background.type === "image" && background.value) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        backgroundImageRef.current = img;
      };
      img.src = background.value;
    } else {
      backgroundImageRef.current = null;
    }
  }, [background]);

  // Process video frame with virtual background
  const processFrame = useCallback(async () => {
    if (!enabled || !videoRef.current || !canvasRef.current || background.type === "none") {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.videoWidth === 0) return;

    // Set canvas size to match video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // Simple blur effect without segmentation (faster)
    if (background.type === "blur" && !segmenterRef.current) {
      ctx.filter = "blur(10px)";
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.filter = "none";
      
      // Draw person on top (simplified - just draw center portion clearly)
      const centerX = canvas.width * 0.2;
      const centerY = canvas.height * 0.1;
      const centerW = canvas.width * 0.6;
      const centerH = canvas.height * 0.8;
      
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        canvas.width / 2,
        canvas.height / 2,
        centerW / 2,
        centerH / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      
      return;
    }

    // Image background (simplified version)
    if (background.type === "image" && backgroundImageRef.current) {
      // Draw background image
      ctx.drawImage(backgroundImageRef.current, 0, 0, canvas.width, canvas.height);
      
      // Draw person on top (simplified ellipse mask)
      const centerW = canvas.width * 0.6;
      const centerH = canvas.height * 0.85;
      
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        canvas.width / 2,
        canvas.height * 0.45,
        centerW / 2,
        centerH / 2,
        0,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      
      return;
    }

    // Default: just draw the video
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  }, [enabled, background, videoRef, canvasRef]);

  // Animation loop
  useEffect(() => {
    if (!enabled || background.type === "none") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = () => {
      processFrame();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, background, processFrame]);

  return {
    isProcessing,
    isModelLoaded,
    loadModel,
  };
};

export default useVirtualBackground;
