import { useState } from "react";
import { X, Plus, BarChart3, CheckCircle2, Trash2, Play, Square, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isActive: boolean;
  createdAt: Date;
  totalVotes: number;
  votedBy: string[]; // participant IDs who voted
}

interface PollsPanelProps {
  polls: Poll[];
  isHost: boolean;
  currentUserId: string;
  onCreatePoll: (question: string, options: string[]) => void;
  onDeletePoll: (id: string) => void;
  onStartPoll: (id: string) => void;
  onEndPoll: (id: string) => void;
  onVote: (pollId: string, optionId: string) => void;
  onClose: () => void;
}

const PollsPanel = ({
  polls,
  isHost,
  currentUserId,
  onCreatePoll,
  onDeletePoll,
  onStartPoll,
  onEndPoll,
  onVote,
  onClose,
}: PollsPanelProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);

  const handleAddOption = () => {
    if (newOptions.length < 6) {
      setNewOptions([...newOptions, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (newOptions.length > 2) {
      setNewOptions(newOptions.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };

  const handleCreatePoll = () => {
    const validOptions = newOptions.filter((o) => o.trim());
    if (newQuestion.trim() && validOptions.length >= 2) {
      onCreatePoll(newQuestion.trim(), validOptions);
      setNewQuestion("");
      setNewOptions(["", ""]);
      setIsCreating(false);
    }
  };

  const hasVoted = (poll: Poll) => poll.votedBy.includes(currentUserId);

  const getVotePercentage = (option: PollOption, poll: Poll) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((option.votes / poll.totalVotes) * 100);
  };

  const activePoll = polls.find((p) => p.isActive);
  const inactivePolls = polls.filter((p) => !p.isActive);

  return (
    <div className="w-96 h-full bg-card/95 backdrop-blur-xl border-l border-border/50 flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Polls</h2>
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

      {/* Create poll button (host only) */}
      {isHost && !isCreating && (
        <div className="p-4 border-b border-border/30">
          <Button
            variant="default"
            className="w-full"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Poll
          </Button>
        </div>
      )}

      {/* Create poll form */}
      {isCreating && (
        <div className="p-4 border-b border-border/30 space-y-4 animate-fade-in">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Question
            </label>
            <Input
              placeholder="Ask a question..."
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Options
            </label>
            <div className="space-y-2">
              {newOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  {newOptions.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {newOptions.length < 6 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={handleAddOption}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add option
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsCreating(false);
                setNewQuestion("");
                setNewOptions(["", ""]);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="flex-1"
              onClick={handleCreatePoll}
              disabled={!newQuestion.trim() || newOptions.filter((o) => o.trim()).length < 2}
            >
              Create
            </Button>
          </div>
        </div>
      )}

      {/* Polls list */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {polls.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground text-sm">
              {isHost ? "Create a poll to get feedback from participants" : "No polls yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Active poll */}
            {activePoll && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  LIVE POLL
                </div>
                <PollCard
                  poll={activePoll}
                  isHost={isHost}
                  hasVoted={hasVoted(activePoll)}
                  onVote={(optionId) => onVote(activePoll.id, optionId)}
                  onEnd={() => onEndPoll(activePoll.id)}
                  onDelete={() => onDeletePoll(activePoll.id)}
                  getVotePercentage={(option) => getVotePercentage(option, activePoll)}
                />
              </div>
            )}

            {/* Inactive polls */}
            {inactivePolls.length > 0 && (
              <div className="space-y-3">
                {activePoll && (
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Previous Polls
                  </div>
                )}
                {inactivePolls.map((poll) => (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    isHost={isHost}
                    hasVoted={hasVoted(poll)}
                    onVote={(optionId) => onVote(poll.id, optionId)}
                    onStart={() => onStartPoll(poll.id)}
                    onDelete={() => onDeletePoll(poll.id)}
                    getVotePercentage={(option) => getVotePercentage(option, poll)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface PollCardProps {
  poll: Poll;
  isHost: boolean;
  hasVoted: boolean;
  onVote: (optionId: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onDelete: () => void;
  getVotePercentage: (option: PollOption) => number;
}

const PollCard = ({
  poll,
  isHost,
  hasVoted,
  onVote,
  onStart,
  onEnd,
  onDelete,
  getVotePercentage,
}: PollCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const showResults = hasVoted || !poll.isActive || isHost;

  return (
    <div
      className={`p-4 rounded-xl border animate-fade-in ${
        poll.isActive
          ? "bg-primary/5 border-primary/30"
          : "bg-muted/50 border-border/30"
      }`}
    >
      {/* Question */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <h3 className="font-medium text-foreground">{poll.question}</h3>
        {isHost && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {poll.options.map((option) => {
          const percentage = getVotePercentage(option);
          const isSelected = selectedOption === option.id;

          return (
            <div key={option.id}>
              {showResults ? (
                // Results view
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{option.text}</span>
                    <span className="text-muted-foreground">
                      {percentage}% ({option.votes})
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              ) : (
                // Voting view
                <button
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-3 rounded-lg border text-left text-sm transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border/50 bg-background/50 text-foreground hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-primary" : "border-muted-foreground"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    {option.text}
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {poll.totalVotes} vote{poll.totalVotes !== 1 ? "s" : ""}
        </div>

        {poll.isActive && !hasVoted && !isHost && selectedOption && (
          <Button
            size="sm"
            onClick={() => {
              onVote(selectedOption);
              setSelectedOption(null);
            }}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Vote
          </Button>
        )}

        {isHost && poll.isActive && onEnd && (
          <Button size="sm" variant="outline" onClick={onEnd}>
            <Square className="w-4 h-4 mr-1" />
            End
          </Button>
        )}

        {isHost && !poll.isActive && onStart && (
          <Button size="sm" variant="outline" onClick={onStart}>
            <Play className="w-4 h-4 mr-1" />
            Reopen
          </Button>
        )}

        {hasVoted && poll.isActive && (
          <span className="text-xs text-primary flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Voted
          </span>
        )}
      </div>
    </div>
  );
};

export default PollsPanel;
