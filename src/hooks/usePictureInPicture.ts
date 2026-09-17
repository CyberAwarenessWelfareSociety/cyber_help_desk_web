import { useState, useCallback, useRef, useEffect } from "react";

export const usePictureInPicture = () => {
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Check if PiP is supported
    setIsPiPSupported(
      "pictureInPictureEnabled" in document && 
      (document as any).pictureInPictureEnabled
    );
  }, []);

  const startPiP = useCallback(async (sourceElement: HTMLElement) => {
    if (!isPiPSupported) {
      console.warn("Picture-in-Picture is not supported");
      return false;
    }

    try {
      // Create canvas to capture the element
      if (!canvasRef.current) {
        canvasRef.current = document.createElement("canvas");
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) return false;

      // Set canvas size
      const rect = sourceElement.getBoundingClientRect();
      canvas.width = Math.min(rect.width, 640);
      canvas.height = Math.min(rect.height, 360);

      // Create video element for PiP
      if (!videoRef.current) {
        videoRef.current = document.createElement("video");
        videoRef.current.muted = true;
        videoRef.current.autoplay = true;
      }
      const video = videoRef.current;

      // Capture canvas as video stream
      const stream = canvas.captureStream(30);
      video.srcObject = stream;

      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      // Start rendering the element to canvas
      const renderFrame = () => {
        if (!isPiPActive && !document.pictureInPictureElement) {
          // Continue rendering while setting up
        }
        
        // Use html2canvas-like approach with drawImage for images
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw a simplified representation
        const images = sourceElement.querySelectorAll("img");
        const gridCols = Math.ceil(Math.sqrt(images.length));
        const cellWidth = canvas.width / gridCols;
        const cellHeight = canvas.height / Math.ceil(images.length / gridCols);
        
        images.forEach((img, index) => {
          const col = index % gridCols;
          const row = Math.floor(index / gridCols);
          const x = col * cellWidth + 4;
          const y = row * cellHeight + 4;
          const w = cellWidth - 8;
          const h = cellHeight - 8;
          
          // Draw rounded rectangle background
          ctx.fillStyle = "#2a2a4e";
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, 8);
          ctx.fill();
          
          // Draw image if loaded
          if (img.complete && img.naturalWidth > 0) {
            try {
              ctx.save();
              ctx.beginPath();
              ctx.roundRect(x, y, w, h, 8);
              ctx.clip();
              ctx.drawImage(img, x, y, w, h);
              ctx.restore();
            } catch (e) {
              // CORS issue, draw placeholder
            }
          }
        });

        // Add meeting indicator
        ctx.fillStyle = "#8b5cf6";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("Meeting in Progress", 10, canvas.height - 10);

        animationRef.current = requestAnimationFrame(renderFrame);
      };

      renderFrame();

      // Request PiP
      await video.requestPictureInPicture();
      setIsPiPActive(true);

      // Handle PiP close
      video.addEventListener("leavepictureinpicture", () => {
        setIsPiPActive(false);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      });

      return true;
    } catch (error) {
      console.error("Failed to enter Picture-in-Picture:", error);
      return false;
    }
  }, [isPiPSupported]);

  const stopPiP = useCallback(async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
      setIsPiPActive(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } catch (error) {
      console.error("Failed to exit Picture-in-Picture:", error);
    }
  }, []);

  const togglePiP = useCallback(async (sourceElement: HTMLElement) => {
    if (isPiPActive) {
      await stopPiP();
    } else {
      await startPiP(sourceElement);
    }
  }, [isPiPActive, startPiP, stopPiP]);

  return {
    isPiPActive,
    isPiPSupported,
    startPiP,
    stopPiP,
    togglePiP,
  };
};