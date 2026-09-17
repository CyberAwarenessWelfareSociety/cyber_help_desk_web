import { Keyboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: "M", description: "Toggle mute/unmute microphone" },
  { key: "V", description: "Toggle camera on/off" },
  { key: "S", description: "Toggle screen sharing" },
  { key: "H", description: "Raise or lower hand" },
  { key: "C", description: "Open/close chat panel" },
  { key: "P", description: "Open/close participants panel" },
  { key: "F", description: "Toggle focus mode" },
  { key: "Esc", description: "Exit focus mode" },
  { key: "?", description: "Show keyboard shortcuts" },
];

const KeyboardShortcutsModal = ({ isOpen, onClose }: KeyboardShortcutsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-primary" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-1 py-4">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <kbd className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 rounded-md bg-secondary border border-border text-xs font-semibold text-foreground">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Press <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-semibold">?</kbd> anytime to show this help
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsModal;
