import { useState } from "react";
import { X, Plus, Users, Play, Square, Shuffle, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Participant } from "@/types/meeting";

export interface BreakoutRoom {
  id: string;
  name: string;
  participantIds: string[];
}

interface BreakoutRoomsPanelProps {
  participants: Participant[];
  breakoutRooms: BreakoutRoom[];
  isBreakoutActive: boolean;
  onCreateRoom: (name: string) => void;
  onDeleteRoom: (id: string) => void;
  onAssignParticipant: (participantId: string, roomId: string | null) => void;
  onStartBreakout: () => void;
  onEndBreakout: () => void;
  onShuffleParticipants: () => void;
  onClose: () => void;
}

const BreakoutRoomsPanel = ({
  participants,
  breakoutRooms,
  isBreakoutActive,
  onCreateRoom,
  onDeleteRoom,
  onAssignParticipant,
  onStartBreakout,
  onEndBreakout,
  onShuffleParticipants,
  onClose,
}: BreakoutRoomsPanelProps) => {
  const [newRoomName, setNewRoomName] = useState("");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUnassignedParticipants = () => {
    const assignedIds = breakoutRooms.flatMap((room) => room.participantIds);
    return participants.filter((p) => !assignedIds.includes(p.id) && p.id !== "1"); // Exclude host
  };

  const getParticipantsInRoom = (roomId: string) => {
    const room = breakoutRooms.find((r) => r.id === roomId);
    if (!room) return [];
    return participants.filter((p) => room.participantIds.includes(p.id));
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      onCreateRoom(newRoomName.trim());
      setNewRoomName("");
    }
  };

  const unassignedParticipants = getUnassignedParticipants();

  return (
    <div className="w-96 h-full bg-card/95 backdrop-blur-xl border-l border-border/50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Breakout Rooms</h2>
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

      {/* Status banner */}
      {isBreakoutActive && (
        <div className="px-4 py-3 bg-primary/10 border-b border-primary/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Breakout sessions in progress</span>
        </div>
      )}

      {/* Controls */}
      <div className="p-4 border-b border-border/30 space-y-3">
        {!isBreakoutActive ? (
          <>
            {/* Create room input */}
            <div className="flex gap-2">
              <Input
                placeholder="Room name..."
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateRoom()}
                className="flex-1"
              />
              <Button
                variant="default"
                size="icon"
                onClick={handleCreateRoom}
                disabled={!newRoomName.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={onShuffleParticipants}
                disabled={breakoutRooms.length === 0 || participants.length <= 1}
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Shuffle
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={onStartBreakout}
                disabled={breakoutRooms.length === 0}
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={onEndBreakout}
          >
            <Square className="w-4 h-4 mr-2" />
            End all breakout rooms
          </Button>
        )}
      </div>

      {/* Rooms list */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {breakoutRooms.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm">
              Create rooms to split participants into smaller groups
            </p>
          </div>
        ) : (
          <>
            {/* Rooms */}
            {breakoutRooms.map((room) => {
              const roomParticipants = getParticipantsInRoom(room.id);
              return (
                <div
                  key={room.id}
                  className="p-3 rounded-xl bg-muted/50 border border-border/30 animate-fade-in"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{room.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {roomParticipants.length} participant{roomParticipants.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    {!isBreakoutActive && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onDeleteRoom(room.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>

                  {/* Participants in room */}
                  <div className="space-y-2">
                    {roomParticipants.length === 0 ? (
                      <p className="text-xs text-muted-foreground/70 italic py-2 text-center">
                        No participants assigned
                      </p>
                    ) : (
                      roomParticipants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-background/50"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                              {participant.avatar ? (
                                <img
                                  src={participant.avatar}
                                  alt={participant.name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-semibold text-foreground">
                                  {getInitials(participant.name)}
                                </span>
                              )}
                            </div>
                            <span className="text-sm text-foreground">{participant.name}</span>
                          </div>
                          {!isBreakoutActive && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => onAssignParticipant(participant.id, null)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}

            {/* Unassigned participants */}
            {unassignedParticipants.length > 0 && !isBreakoutActive && (
              <div className="p-3 rounded-xl bg-muted/30 border border-dashed border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-3">
                  Unassigned ({unassignedParticipants.length})
                </p>
                <div className="space-y-2">
                  {unassignedParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-background/50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                          {participant.avatar ? (
                            <img
                              src={participant.avatar}
                              alt={participant.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-foreground">
                              {getInitials(participant.name)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-foreground">{participant.name}</span>
                      </div>
                      {breakoutRooms.length > 0 && (
                        <div className="flex gap-1">
                          {breakoutRooms.map((room, index) => (
                            <Button
                              key={room.id}
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-xs"
                              onClick={() => onAssignParticipant(participant.id, room.id)}
                              title={`Assign to ${room.name}`}
                            >
                              <ArrowRight className="w-3 h-3" />
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground text-center">
          {isBreakoutActive
            ? "Participants are in their breakout rooms"
            : "Assign participants to rooms, then start the session"}
        </p>
      </div>
    </div>
  );
};

export default BreakoutRoomsPanel;
