// VideoGrid.tsx
import React, { useState } from "react";
import { Participant } from "@/types/meeting";
import ParticipantVideo from "./ParticipantVideo";
import { VirtualBackgroundOption } from "./VirtualBackgroundSelector";
import { GripVertical } from "lucide-react";
import LocalVideoPiP from "./LocalVideoPiP";

export type ViewMode = "grid" | "speaker";

interface VideoGridProps {
  participants: Participant[];
  selectedBackground?: VirtualBackgroundOption;
  spotlightedParticipantIds?: string[];
  viewMode?: ViewMode;
  onReorderSpotlights?: (newOrder: string[]) => void;
  isLocalPiPVisible?: boolean;

  /** ✅ IMPORTANT: pass your real local id (socket.id) */
  currentUserId: string | null;
}

const VideoGrid = ({
  participants,
  selectedBackground,
  spotlightedParticipantIds = [],
  viewMode = "grid",
  onReorderSpotlights,
  isLocalPiPVisible = true,
  currentUserId,
}: VideoGridProps) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const safeParticipants = Array.isArray(participants) ? participants : [];

  // ✅ Normalize remote tiles: if stream tracks are disabled, reflect in UI flags
  const normalizedParticipants = safeParticipants.map((p) => {
    const v = p.stream?.getVideoTracks?.()?.[0] || null;
    const a = p.stream?.getAudioTracks?.()?.[0] || null;

    const videoLive = !!v && v.readyState === "live" && v.enabled !== false;
    const audioLive = !!a && a.readyState === "live" && a.enabled !== false;

    return {
      ...p,
      isCameraOff: !!p.isCameraOff || (!!v && !videoLive),
      isMuted: !!p.isMuted || (!!a && !audioLive),
    };
  });

  // Find active speaker or first participant for speaker view
  const activeSpeaker =
    normalizedParticipants.find((p) => p.isActiveSpeaker) ||
    normalizedParticipants[0];

  const localParticipant = currentUserId
    ? normalizedParticipants.find((p) => p.id === currentUserId)
    : undefined;

  const spotlightedParticipants = spotlightedParticipantIds
    .map((id) => normalizedParticipants.find((p) => p.id === id))
    .filter(Boolean) as Participant[];

  const otherParticipants =
    spotlightedParticipantIds.length > 0
      ? normalizedParticipants.filter(
          (p) => !spotlightedParticipantIds.includes(p.id),
        )
      : normalizedParticipants;

  const getGridClass = () => {
    const count = otherParticipants.length;
    if (count === 0) return "grid-cols-1 max-w-4xl mx-auto";
    if (count === 1) return "grid-cols-1 max-w-2xl mx-auto";
    if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
    if (count <= 4) return "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto";
    if (count <= 6) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
  };

  const getSpotlightGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 md:grid-cols-2";
    if (count === 3) return "grid-cols-1 md:grid-cols-3";
    if (count === 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-2 md:grid-cols-3";
    return "grid-cols-2 md:grid-cols-4";
  };

  const handleDragStart = (e: React.DragEvent, participantId: string) => {
    setDraggedId(participantId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", participantId);
  };

  const handleDragOver = (e: React.DragEvent, participantId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (participantId !== draggedId) setDragOverId(participantId);
  };

  const handleDragLeave = () => setDragOverId(null);

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain");

    if (sourceId && sourceId !== targetId && onReorderSpotlights) {
      const newOrder = [...spotlightedParticipantIds];
      const sourceIndex = newOrder.indexOf(sourceId);
      const targetIndex = newOrder.indexOf(targetId);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        newOrder.splice(sourceIndex, 1);
        newOrder.splice(targetIndex, 0, sourceId);
        onReorderSpotlights(newOrder);
      }
    }

    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const isLocalInSpotlight =
    !!currentUserId && spotlightedParticipantIds.includes(currentUserId);

  const isLocalActiveSpeaker =
    !!currentUserId && activeSpeaker?.id === currentUserId;

  const showLocalPiP =
    !!currentUserId &&
    !!localParticipant &&
    isLocalPiPVisible &&
    ((spotlightedParticipants.length > 0 && !isLocalInSpotlight) ||
      (viewMode === "speaker" && !isLocalActiveSpeaker));

  // Spotlight layout
  if (spotlightedParticipants.length > 0) {
    return (
      <div className="flex flex-col gap-4 p-4 h-full relative">
        {localParticipant && showLocalPiP && (
          <LocalVideoPiP
            participant={localParticipant}
            selectedBackground={selectedBackground}
            isVisible={true}
          />
        )}

        <div
          className={`flex-1 grid ${getSpotlightGridClass(
            spotlightedParticipants.length,
          )} gap-3 max-w-6xl mx-auto w-full`}
        >
          {spotlightedParticipants.map((participant, index) => (
            <div
              key={participant.id}
              draggable={!!onReorderSpotlights}
              onDragStart={(e) => handleDragStart(e, participant.id)}
              onDragOver={(e) => handleDragOver(e, participant.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, participant.id)}
              onDragEnd={handleDragEnd}
              className={`animate-scale-in relative group transition-all duration-200 ${
                draggedId === participant.id ? "opacity-50 scale-95" : ""
              } ${
                dragOverId === participant.id
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : ""
              } ${
                onReorderSpotlights ? "cursor-grab active:cursor-grabbing" : ""
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {onReorderSpotlights && (
                <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-md p-1">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
              )}

              <ParticipantVideo
                participant={participant}
                isLocal={!!currentUserId && participant.id === currentUserId}
                isSpotlighted={true}
                selectedBackground={
                  !!currentUserId && participant.id === currentUserId
                    ? selectedBackground
                    : undefined
                }
              />
            </div>
          ))}
        </div>

        {otherParticipants.filter((p) =>
          showLocalPiP ? p.id !== currentUserId : true,
        ).length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
            {otherParticipants
              .filter((p) => (showLocalPiP ? p.id !== currentUserId : true))
              .map((participant, index) => (
                <div
                  key={participant.id}
                  className="w-40 md:w-48 flex-shrink-0 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ParticipantVideo
                    participant={participant}
                    isLocal={!!currentUserId && participant.id === currentUserId}
                    selectedBackground={
                      !!currentUserId && participant.id === currentUserId
                        ? selectedBackground
                        : undefined
                    }
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  // Speaker view layout
  if (viewMode === "speaker" && activeSpeaker) {
    const speakerOthers = normalizedParticipants.filter(
      (p) => p.id !== activeSpeaker.id,
    );

    const showLocalPiPInSpeaker =
      !!currentUserId &&
      !!localParticipant &&
      isLocalPiPVisible &&
      activeSpeaker.id !== currentUserId;

    return (
      <div className="flex flex-col gap-4 p-4 h-full relative">
        {localParticipant && showLocalPiPInSpeaker && (
          <LocalVideoPiP
            participant={localParticipant}
            selectedBackground={selectedBackground}
            isVisible={true}
          />
        )}

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-4xl aspect-video animate-scale-in">
            <ParticipantVideo
              participant={activeSpeaker}
              isLocal={!!currentUserId && activeSpeaker.id === currentUserId}
              isSpotlighted={true}
              selectedBackground={
                !!currentUserId && activeSpeaker.id === currentUserId
                  ? selectedBackground
                  : undefined
              }
            />
          </div>
        </div>

        {speakerOthers.filter((p) =>
          showLocalPiPInSpeaker ? p.id !== currentUserId : true,
        ).length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 justify-center items-center">
            {speakerOthers
              .filter((p) =>
                showLocalPiPInSpeaker ? p.id !== currentUserId : true,
              )
              .map((participant, index) => (
                <div
                  key={participant.id}
                  className="w-40 md:w-48 flex-shrink-0 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ParticipantVideo
                    participant={participant}
                    isLocal={!!currentUserId && participant.id === currentUserId}
                    selectedBackground={
                      !!currentUserId && participant.id === currentUserId
                        ? selectedBackground
                        : undefined
                    }
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  // Default grid layout
  return (
    <div className={`grid gap-3 p-4 ${getGridClass()}`}>
      {normalizedParticipants.map((participant, index) => (
        <div
          key={participant.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <ParticipantVideo
            participant={participant}
            isLocal={!!currentUserId && participant.id === currentUserId}
            selectedBackground={
              !!currentUserId && participant.id === currentUserId
                ? selectedBackground
                : undefined
            }
          />
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
