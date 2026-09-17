import { useState } from "react";
import { X, Send, MessageCircleQuestion, ThumbsUp, Trash2, Star, StarOff, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";

export interface Question {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  upvotes: number;
  upvotedBy: string[];
  isAnswered: boolean;
  isHighlighted: boolean;
}

interface QAPanelProps {
  questions: Question[];
  isHost: boolean;
  currentUserId: string;
  onSubmitQuestion: (text: string) => void;
  onUpvote: (questionId: string) => void;
  onHighlight: (questionId: string) => void;
  onDismiss: (questionId: string) => void;
  onMarkAnswered: (questionId: string) => void;
  onClose: () => void;
}

const QAPanel = ({
  questions,
  isHost,
  currentUserId,
  onSubmitQuestion,
  onUpvote,
  onHighlight,
  onDismiss,
  onMarkAnswered,
  onClose,
}: QAPanelProps) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      onSubmitQuestion(newQuestion.trim());
      setNewQuestion("");
    }
  };

  const unansweredQuestions = questions.filter((q) => !q.isAnswered);
  const answeredQuestions = questions.filter((q) => q.isAnswered);
  const highlightedQuestion = questions.find((q) => q.isHighlighted);

  const sortedQuestions = [...unansweredQuestions].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="w-80 h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircleQuestion className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Q&A</h2>
          {unansweredQuestions.length > 0 && (
            <Badge variant="secondary">{unansweredQuestions.length}</Badge>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Highlighted Question */}
      {highlightedQuestion && (
        <div className="p-3 bg-primary/10 border-b border-primary/30 animate-fade-in">
          <div className="flex items-start gap-2">
            <Star className="w-4 h-4 text-primary fill-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary">Featured Question</p>
              <p className="text-sm mt-1">{highlightedQuestion.text}</p>
              <p className="text-xs text-muted-foreground mt-1">
                - {highlightedQuestion.authorName}
              </p>
            </div>
            {isHost && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onHighlight(highlightedQuestion.id)}
              >
                <StarOff className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-3">
          <TabsTrigger value="all" className="flex-1">
            Open ({unansweredQuestions.length})
          </TabsTrigger>
          <TabsTrigger value="answered" className="flex-1">
            Answered ({answeredQuestions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1 m-0 p-0">
          <ScrollArea className="flex-1 p-4">
            {sortedQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircleQuestion className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground text-sm">No questions yet</p>
                <p className="text-muted-foreground/70 text-xs mt-1">
                  Be the first to ask a question!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedQuestions.map((question) => {
                  const hasUpvoted = question.upvotedBy.includes(currentUserId);
                  return (
                    <div
                      key={question.id}
                      className={`rounded-lg p-3 transition-all ${
                        question.isHighlighted
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/50"
                      }`}
                    >
                      <p className="text-sm">{question.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {question.authorName}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant={hasUpvoted ? "default" : "outline"}
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => onUpvote(question.id)}
                        >
                          <ChevronUp className="w-3 h-3 mr-1" />
                          {question.upvotes}
                        </Button>
                        {isHost && (
                          <>
                            <Button
                              variant={question.isHighlighted ? "secondary" : "outline"}
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => onHighlight(question.id)}
                            >
                              <Star className={`w-3 h-3 ${question.isHighlighted ? "fill-current" : ""}`} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => onMarkAnswered(question.id)}
                            >
                              Answered
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-destructive"
                              onClick={() => onDismiss(question.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="answered" className="flex-1 m-0 p-0">
          <ScrollArea className="flex-1 p-4">
            {answeredQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground text-sm">No answered questions</p>
              </div>
            ) : (
              <div className="space-y-3">
                {answeredQuestions.map((question) => (
                  <div key={question.id} className="rounded-lg p-3 bg-muted/30 opacity-70">
                    <p className="text-sm">{question.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {question.authorName}
                      </span>
                      <Badge variant="secondary" className="text-[10px]">
                        Answered
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Submit Question */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1"
            maxLength={500}
          />
          <Button type="submit" size="icon" disabled={!newQuestion.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Questions are sorted by votes
        </p>
      </form>
    </div>
  );
};

export default QAPanel;
