import { X, Check, Ban, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface WaitingParticipant {
  id: string;
  name: string;
  avatar?: string;
  waitingSince: Date;
}

interface WaitingParticipantsPanelProps {
  waitingParticipants: WaitingParticipant[];
  onAdmit: (id: string) => void;
  onDeny: (id: string) => void;
  onAdmitAll: () => void;
  onClose: () => void;
}

const WaitingParticipantsPanel = ({
  waitingParticipants,
  onAdmit,
  onDeny,
  onAdmitAll,
  onClose,
}: WaitingParticipantsPanelProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getWaitTime = (since: Date) => {
    const seconds = Math.floor((new Date().getTime() - since.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  return (
    <div className="w-80 h-full bg-card/95 backdrop-blur-xl border-l border-border/50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <h2 className="font-semibold text-foreground">
            Waiting Room ({waitingParticipants.length})
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Admit all button */}
      {waitingParticipants.length > 0 && (
        <div className="p-4 border-b border-border/30">
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={onAdmitAll}
          >
            <Check className="w-4 h-4 mr-2" />
            Admit all ({waitingParticipants.length})
          </Button>
        </div>
      )}

      {/* Waiting participants list */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {waitingParticipants.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm">
              No one is waiting to join
            </p>
          </div>
        ) : (
          waitingParticipants.map((participant) => (
            <div
              key={participant.id}
              className="p-3 rounded-xl bg-muted/50 border border-border/30 animate-fade-in"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  {participant.avatar ? (
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-foreground">
                      {getInitials(participant.name)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {participant.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Waiting for {getWaitTime(participant.waitingSince)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => onAdmit(participant.id)}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Admit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onDeny(participant.id)}
                >
                  <Ban className="w-4 h-4 mr-1" />
                  Deny
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WaitingParticipantsPanel;
