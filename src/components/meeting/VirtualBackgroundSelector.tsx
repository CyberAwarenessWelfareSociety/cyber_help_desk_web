import { useState } from "react";
import { X, Sparkles, Image as ImageIcon, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";

export type BackgroundType = "none" | "blur" | "image";

export interface VirtualBackgroundOption {
  type: BackgroundType;
  value?: string; // For images, this is the URL
  label: string;
}

const defaultBackgrounds: VirtualBackgroundOption[] = [
  { type: "none", label: "None" },
  { type: "blur", label: "Blur" },
  { type: "image", value: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=640", label: "Office" },
  { type: "image", value: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640", label: "Mountains" },
  { type: "image", value: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640", label: "Beach" },
  { type: "image", value: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=640", label: "Night Sky" },
];

interface VirtualBackgroundSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBackground: VirtualBackgroundOption;
  onSelectBackground: (background: VirtualBackgroundOption) => void;
  isProcessing: boolean;
}

const VirtualBackgroundSelector = ({
  isOpen,
  onClose,
  selectedBackground,
  onSelectBackground,
  isProcessing,
}: VirtualBackgroundSelectorProps) => {
  const [customImages, setCustomImages] = useState<VirtualBackgroundOption[]>([]);

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newImage: VirtualBackgroundOption = {
        type: "image",
        value: url,
        label: "Custom",
      };
      setCustomImages((prev) => [...prev, newImage]);
      onSelectBackground(newImage);
    }
  };

  if (!isOpen) return null;

  const allBackgrounds = [...defaultBackgrounds, ...customImages];

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-80 bg-card/95 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl animate-slide-up overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Virtual Background</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 rounded-full"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="px-4 py-2 bg-primary/10 border-b border-border/30">
          <div className="flex items-center gap-2 text-sm text-primary">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Applying background...</span>
          </div>
        </div>
      )}

      {/* Background options */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {allBackgrounds.map((bg, index) => (
            <button
              key={`${bg.type}-${index}`}
              onClick={() => onSelectBackground(bg)}
              className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                selectedBackground.type === bg.type &&
                selectedBackground.value === bg.value
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border/50 hover:border-border"
              }`}
            >
              {bg.type === "none" && (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Ban className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              {bg.type === "blur" && (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 backdrop-blur-xl flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary/50 blur-sm" />
                </div>
              )}
              {bg.type === "image" && bg.value && (
                <img
                  src={bg.value}
                  alt={bg.label}
                  className="w-full h-full object-cover"
                />
              )}
              <span className="absolute bottom-1 left-1 right-1 text-[10px] text-center text-white bg-black/50 rounded px-1 truncate">
                {bg.label}
              </span>
            </button>
          ))}

          {/* Upload custom image */}
          <label className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-border/50 hover:border-primary/50 transition-all cursor-pointer flex items-center justify-center bg-muted/50 hover:bg-muted">
            <input
              type="file"
              accept="image/*"
              onChange={handleCustomImageUpload}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-1">
              <ImageIcon className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Add</span>
            </div>
          </label>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pb-4">
        <p className="text-xs text-muted-foreground text-center">
          Virtual backgrounds use AI to separate you from your background
        </p>
      </div>
    </div>
  );
};

export default VirtualBackgroundSelector;
export { defaultBackgrounds };
