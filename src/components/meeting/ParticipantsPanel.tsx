import { useState } from "react";
import { X, Mic, MicOff, Crown, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Participant } from "@/types/meeting";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SpeakingTimeTracker, { SpeakingTime } from "./SpeakingTimeTracker";

interface ParticipantsPanelProps {
  participants: Participant[];
  isHost: boolean;
  spotlightedParticipantIds: string[];
  speakingTimes: SpeakingTime[];
  meetingDuration: number;
  onSpotlight: (participantId: string) => void;
  onClearSpotlights: () => void;
  onClose: () => void;
}

const ParticipantsPanel = ({
  participants,
  isHost,
  spotlightedParticipantIds,
  speakingTimes,
  meetingDuration,
  onSpotlight,
  onClearSpotlights,
  onClose,
}: ParticipantsPanelProps) => {
  const [activeTab, setActiveTab] = useState("participants");

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full md:w-80 h-full flex flex-col glass-panel rounded-l-2xl animate-slide-right">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          People ({participants.length})
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="participants" className="text-xs">
              Participants
            </TabsTrigger>
            <TabsTrigger value="speaking" className="text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Speaking Time
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Participants Tab */}
        <TabsContent value="participants" className="flex-1 flex flex-col mt-0 overflow-hidden">
        {/* Spotlight info */}
          {spotlightedParticipantIds.length > 0 && isHost && (
            <div className="px-4 py-2 bg-primary/10 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-xs text-primary font-medium">
                    {spotlightedParticipantIds.length} spotlighted
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={onClearSpotlights}
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}

          {/* Participants list */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {participants.map((participant) => {
                const isSpotlighted = spotlightedParticipantIds.includes(participant.id);
                return (
                  <div
                    key={participant.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isSpotlighted
                        ? "bg-primary/10 ring-1 ring-primary/30"
                        : "hover:bg-secondary/50"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                        {participant.avatar ? (
                          <img
                            src={participant.avatar}
                            alt={participant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-foreground">
                            {getInitials(participant.name)}
                          </span>
                        )}
                      </div>
                      {participant.isActiveSpeaker && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-popover" />
                      )}
                    </div>

                    {/* Name and role */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground truncate">
                          {participant.name}
                        </span>
                        {participant.isHost && (
                          <Crown className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        )}
                        {isSpotlighted && (
                          <span className="flex items-center justify-center w-4 h-4 rounded-full bg-primary text-[10px] text-primary-foreground font-medium">
                            {spotlightedParticipantIds.indexOf(participant.id) + 1}
                          </span>
                        )}
                      </div>
                      {participant.id === "1" && (
                        <span className="text-xs text-muted-foreground">You</span>
                      )}
                    </div>

                    {/* Spotlight button (Host only) */}
                    {isHost && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isSpotlighted ? "default" : "ghost"}
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onSpotlight(participant.id)}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                isSpotlighted ? "fill-primary-foreground" : ""
                              }`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isSpotlighted ? "Remove spotlight" : "Add spotlight"}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Mic status */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        participant.isMuted ? "bg-destructive/20" : "bg-secondary"
                      }`}
                    >
                      {participant.isMuted ? (
                        <MicOff className="w-4 h-4 text-destructive" />
                      ) : (
                        <Mic className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Speaking Time Tab */}
        <TabsContent value="speaking" className="flex-1 mt-0 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <SpeakingTimeTracker
              participants={participants}
              speakingTimes={speakingTimes}
              meetingDuration={meetingDuration}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticipantsPanel;