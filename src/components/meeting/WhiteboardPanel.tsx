import React, { useEffect, useRef, useState, useCallback } from "react";
import { Canvas as FabricCanvas, Rect, Circle, Line, Textbox, PencilBrush, FabricObject } from "fabric";
import { 
  X, Pencil, Square, Circle as CircleIcon, Type, Minus, 
  Eraser, Trash2, Undo, Redo, Download, MousePointer, 
  Triangle, Star, ArrowRight, Palette, Move
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface WhiteboardPanelProps {
  onClose: () => void;
}

type Tool = "select" | "draw" | "rectangle" | "circle" | "triangle" | "line" | "arrow" | "text" | "eraser";

const colors = [
  "#000000", "#ffffff", "#ef4444", "#f97316", "#eab308", 
  "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280"
];

const WhiteboardPanel = ({ onClose }: WhiteboardPanelProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("draw");
  const [activeColor, setActiveColor] = useState("#3b82f6");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [fillShape, setFillShape] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isLoadingHistory = useRef(false);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = new FabricCanvas(canvasRef.current, {
      width: container.clientWidth,
      height: container.clientHeight - 80,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    // Initialize drawing brush
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = strokeWidth;

    setFabricCanvas(canvas);

    // Save initial state
    const initialState = JSON.stringify(canvas.toJSON());
    setHistory([initialState]);
    setHistoryIndex(0);

    // Handle resize
    const handleResize = () => {
      canvas.setDimensions({
        width: container.clientWidth,
        height: container.clientHeight - 80,
      });
      canvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.dispose();
    };
  }, []);

  // Save state after modifications
  const saveState = useCallback(() => {
    if (!fabricCanvas || isLoadingHistory.current) return;
    
    const json = JSON.stringify(fabricCanvas.toJSON());
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, json];
    });
    setHistoryIndex(prev => prev + 1);
  }, [fabricCanvas, historyIndex]);

  // Listen for object modifications
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleModification = () => saveState();
    
    fabricCanvas.on("object:added", handleModification);
    fabricCanvas.on("object:modified", handleModification);
    fabricCanvas.on("object:removed", handleModification);
    fabricCanvas.on("path:created", handleModification);

    return () => {
      fabricCanvas.off("object:added", handleModification);
      fabricCanvas.off("object:modified", handleModification);
      fabricCanvas.off("object:removed", handleModification);
      fabricCanvas.off("path:created", handleModification);
    };
  }, [fabricCanvas, saveState]);

  // Update tool settings
  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw" || activeTool === "eraser";
    
    if (fabricCanvas.freeDrawingBrush) {
      if (activeTool === "eraser") {
        fabricCanvas.freeDrawingBrush.color = "#ffffff";
        fabricCanvas.freeDrawingBrush.width = strokeWidth * 3;
      } else {
        fabricCanvas.freeDrawingBrush.color = activeColor;
        fabricCanvas.freeDrawingBrush.width = strokeWidth;
      }
    }

    // Enable selection only for select tool
    fabricCanvas.selection = activeTool === "select";
    fabricCanvas.forEachObject((obj) => {
      obj.selectable = activeTool === "select";
      obj.evented = activeTool === "select";
    });
  }, [activeTool, activeColor, strokeWidth, fabricCanvas]);

  // Handle shape creation on canvas click
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleMouseDown = (e: any) => {
      if (activeTool === "select" || activeTool === "draw" || activeTool === "eraser") return;
      
      const pointer = fabricCanvas.getViewportPoint(e.e);
      let shape: FabricObject | null = null;

      const shapeOptions = {
        left: pointer.x,
        top: pointer.y,
        fill: fillShape ? activeColor : "transparent",
        stroke: activeColor,
        strokeWidth: strokeWidth,
        originX: "center" as const,
        originY: "center" as const,
      };

      switch (activeTool) {
        case "rectangle":
          shape = new Rect({ ...shapeOptions, width: 100, height: 80 });
          break;
        case "circle":
          shape = new Circle({ ...shapeOptions, radius: 50 });
          break;
        case "triangle":
          const trianglePoints = [
            { x: 0, y: -50 },
            { x: 50, y: 50 },
            { x: -50, y: 50 },
          ];
          shape = new (window as any).fabric.Polygon(trianglePoints, {
            ...shapeOptions,
            left: pointer.x,
            top: pointer.y,
          });
          // Fallback to simple approach if Polygon isn't available
          if (!shape) {
            shape = new Rect({ ...shapeOptions, width: 100, height: 80 });
          }
          break;
        case "line":
          shape = new Line([pointer.x, pointer.y, pointer.x + 100, pointer.y], {
            stroke: activeColor,
            strokeWidth: strokeWidth,
          });
          break;
        case "arrow":
          // Create arrow as a line with arrowhead
          const arrowLine = new Line([pointer.x, pointer.y, pointer.x + 100, pointer.y], {
            stroke: activeColor,
            strokeWidth: strokeWidth,
          });
          fabricCanvas.add(arrowLine);
          // Add arrowhead triangle
          const arrowHead = new Rect({
            left: pointer.x + 95,
            top: pointer.y - 5,
            width: 15,
            height: 10,
            fill: activeColor,
            angle: 0,
            originX: "center",
            originY: "center",
          });
          shape = arrowHead;
          break;
        case "text":
          shape = new Textbox("Type here", {
            left: pointer.x,
            top: pointer.y,
            fill: activeColor,
            fontSize: strokeWidth * 6,
            fontFamily: "sans-serif",
            width: 200,
          });
          break;
      }

      if (shape) {
        fabricCanvas.add(shape);
        fabricCanvas.setActiveObject(shape);
        fabricCanvas.renderAll();
      }
    };

    fabricCanvas.on("mouse:down", handleMouseDown);

    return () => {
      fabricCanvas.off("mouse:down", handleMouseDown);
    };
  }, [fabricCanvas, activeTool, activeColor, strokeWidth, fillShape]);

  const handleUndo = () => {
    if (!fabricCanvas || historyIndex <= 0) return;
    
    isLoadingHistory.current = true;
    const newIndex = historyIndex - 1;
    fabricCanvas.loadFromJSON(JSON.parse(history[newIndex])).then(() => {
      fabricCanvas.renderAll();
      setHistoryIndex(newIndex);
      isLoadingHistory.current = false;
    });
  };

  const handleRedo = () => {
    if (!fabricCanvas || historyIndex >= history.length - 1) return;
    
    isLoadingHistory.current = true;
    const newIndex = historyIndex + 1;
    fabricCanvas.loadFromJSON(JSON.parse(history[newIndex])).then(() => {
      fabricCanvas.renderAll();
      setHistoryIndex(newIndex);
      isLoadingHistory.current = false;
    });
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    saveState();
  };

  const handleDownload = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 2,
    });
    const link = document.createElement("a");
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
    { id: "select", icon: <MousePointer className="w-4 h-4" />, label: "Select & Move" },
    { id: "draw", icon: <Pencil className="w-4 h-4" />, label: "Draw" },
    { id: "eraser", icon: <Eraser className="w-4 h-4" />, label: "Eraser" },
    { id: "rectangle", icon: <Square className="w-4 h-4" />, label: "Rectangle" },
    { id: "circle", icon: <CircleIcon className="w-4 h-4" />, label: "Circle" },
    { id: "triangle", icon: <Triangle className="w-4 h-4" />, label: "Triangle" },
    { id: "line", icon: <Minus className="w-4 h-4" />, label: "Line" },
    { id: "arrow", icon: <ArrowRight className="w-4 h-4" />, label: "Arrow" },
    { id: "text", icon: <Type className="w-4 h-4" />, label: "Text" },
  ];

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col animate-fade-in"
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 bg-card border-b border-border">
        {/* Tools */}
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          {tools.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTool === tool.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTool(tool.id)}
                  className="h-8 w-8 p-0"
                >
                  {tool.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Colors */}
        <div className="flex items-center gap-1">
          {colors.map((color) => (
            <Tooltip key={color}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveColor(color)}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-transform hover:scale-110",
                    activeColor === color ? "border-primary ring-2 ring-primary/50" : "border-border"
                  )}
                  style={{ backgroundColor: color }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{color}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Stroke Width */}
        <div className="flex items-center gap-2 min-w-[120px]">
          <span className="text-xs text-muted-foreground">Size:</span>
          <Slider
            value={[strokeWidth]}
            onValueChange={([value]) => setStrokeWidth(value)}
            min={1}
            max={20}
            step={1}
            className="w-20"
          />
          <span className="text-xs text-muted-foreground w-6">{strokeWidth}</span>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Fill toggle for shapes */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={fillShape ? "default" : "outline"}
              size="sm"
              onClick={() => setFillShape(!fillShape)}
              className="h-8"
            >
              <Palette className="w-4 h-4 mr-1" />
              Fill
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{fillShape ? "Shapes are filled" : "Shapes are outline only"}</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="h-8 w-8 p-0"
              >
                <Undo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="h-8 w-8 p-0"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-8" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear all</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-8 w-8 p-0"
              >
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download as PNG</p>
            </TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-8" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Close whiteboard</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden bg-muted/30 p-4">
        <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Help text */}
      <div className="text-center py-2 text-xs text-muted-foreground bg-card border-t border-border">
        {activeTool === "select" && "Click and drag to select and move objects"}
        {activeTool === "draw" && "Draw freely on the canvas"}
        {activeTool === "eraser" && "Erase parts of your drawing"}
        {activeTool === "rectangle" && "Click to place a rectangle"}
        {activeTool === "circle" && "Click to place a circle"}
        {activeTool === "triangle" && "Click to place a triangle"}
        {activeTool === "line" && "Click to place a line"}
        {activeTool === "arrow" && "Click to place an arrow"}
        {activeTool === "text" && "Click to add text"}
      </div>
    </div>
  );
};

export default WhiteboardPanel;
