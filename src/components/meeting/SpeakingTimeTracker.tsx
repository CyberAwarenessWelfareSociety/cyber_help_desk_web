import { useMemo } from "react";
import { Participant } from "@/types/meeting";
import { Mic } from "lucide-react";

export interface SpeakingTime {
  participantId: string;
  totalSeconds: number;
}

interface SpeakingTimeTrackerProps {
  participants: Participant[];
  speakingTimes: SpeakingTime[];
  meetingDuration: number; // in seconds
}

const SpeakingTimeTracker = ({ 
  participants, 
  speakingTimes, 
  meetingDuration 
}: SpeakingTimeTrackerProps) => {
  const sortedParticipants = useMemo(() => {
    return [...participants]
      .map((p) => ({
        ...p,
        speakingTime: speakingTimes.find((st) => st.participantId === p.id)?.totalSeconds || 0,
      }))
      .sort((a, b) => b.speakingTime - a.speakingTime);
  }, [participants, speakingTimes]);

  const maxSpeakingTime = Math.max(...sortedParticipants.map((p) => p.speakingTime), 1);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getPercentage = (seconds: number) => {
    if (meetingDuration === 0) return 0;
    return Math.round((seconds / meetingDuration) * 100);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Participant</span>
        <span>Speaking Time</span>
      </div>
      
      {sortedParticipants.map((participant) => {
        const percentage = getPercentage(participant.speakingTime);
        const barWidth = maxSpeakingTime > 0 
          ? (participant.speakingTime / maxSpeakingTime) * 100 
          : 0;

        return (
          <div key={participant.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-[10px] font-medium text-foreground">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                  {participant.name}
                </span>
                {participant.isActiveSpeaker && (
                  <Mic className="w-3 h-3 text-emerald-400 animate-pulse" />
                )}
              </div>
              <div className="text-right">
                <span className="text-sm font-mono text-foreground">
                  {formatTime(participant.speakingTime)}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({percentage}%)
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <div className="pt-3 mt-3 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Meeting Duration</span>
          <span className="font-mono text-foreground">{formatTime(meetingDuration)}</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-muted-foreground">Total Speaking</span>
          <span className="font-mono text-foreground">
            {formatTime(sortedParticipants.reduce((sum, p) => sum + p.speakingTime, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SpeakingTimeTracker;