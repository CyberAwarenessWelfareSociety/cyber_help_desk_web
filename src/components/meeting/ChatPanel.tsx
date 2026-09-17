import { useState } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types/meeting";

interface ChatPanelProps {
  messages: ChatMessage[];
  onClose: () => void;
  onSendMessage: (content: string) => void;
}

const ChatPanel = ({ messages, onClose, onSendMessage }: ChatPanelProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full md:w-80 h-full flex flex-col glass-panel rounded-l-2xl animate-slide-right">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">In-call messages</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {message.senderName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{message.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            placeholder="Send a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
          <Button
            variant="default"
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
