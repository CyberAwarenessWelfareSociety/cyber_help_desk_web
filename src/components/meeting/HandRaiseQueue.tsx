import { X, Hand, MessageCircle, ChevronDown, User, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export interface HandRaiseEntry {
  participantId: string;
  participantName: string;
  avatar?: string;
  raisedAt: Date;
}

interface HandRaiseQueueProps {
  queue: HandRaiseEntry[];
  isHost: boolean;
  currentSpeakerId: string | null;
  onCallOn: (participantId: string) => void;
  onLowerHand: (participantId: string) => void;
  onLowerAllHands: () => void;
  onClose: () => void;
}

const HandRaiseQueue = ({
  queue,
  isHost,
  currentSpeakerId,
  onCallOn,
  onLowerHand,
  onLowerAllHands,
  onClose,
}: HandRaiseQueueProps) => {
  return (
    <div className="w-80 h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hand className="w-5 h-5 text-amber-500" />
          <h2 className="font-semibold">Hand Raise Queue</h2>
          {queue.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {queue.length}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Host Controls */}
      {isHost && queue.length > 0 && (
        <div className="p-3 border-b border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onLowerAllHands}
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Lower All Hands
          </Button>
        </div>
      )}

      {/* Queue List */}
      <ScrollArea className="flex-1 p-4">
        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <Hand className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground text-sm">
              No raised hands
            </p>
            <p className="text-muted-foreground/70 text-xs mt-1">
              Participants who raise their hand will appear here in order
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {queue.map((entry, index) => {
              const isSpeaking = currentSpeakerId === entry.participantId;
              return (
                <div
                  key={entry.participantId}
                  className={`rounded-lg p-3 transition-all ${
                    isSpeaking
                      ? "bg-primary/10 border border-primary/30 animate-pulse"
                      : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Position Badge */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? "bg-amber-500 text-white"
                          : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>

                    {/* Avatar */}
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.avatar} alt={entry.participantName} />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>

                    {/* Name and Time */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {entry.participantName}
                        {isSpeaking && (
                          <Badge variant="default" className="ml-2 text-[10px] bg-green-500">
                            <Mic className="w-2.5 h-2.5 mr-1" />
                            Unmuted
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isSpeaking ? "Speaking now" : formatDistanceToNow(entry.raisedAt, { addSuffix: true })}
                      </p>
                    </div>

                    {/* Status Icon */}
                    {isSpeaking ? (
                      <Mic className="w-4 h-4 text-green-500" />
                    ) : (
                      <Hand className="w-4 h-4 text-amber-500 animate-pulse" />
                    )}
                  </div>

                  {/* Host Actions */}
                  {isHost && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant={isSpeaking ? "secondary" : "default"}
                        size="sm"
                        className="flex-1"
                        onClick={() => onCallOn(entry.participantId)}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {isSpeaking ? "Speaking..." : "Call On"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onLowerHand(entry.participantId)}
                      >
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          {queue.length > 0
            ? `${queue[0]?.participantName} is next in queue`
            : "Click the hand icon to raise your hand"}
        </p>
      </div>
    </div>
  );
};

export default HandRaiseQueue;
