import { MessageCircleQuestion, Star } from "lucide-react";
import { Question } from "./QAPanel";

interface QADisplayProps {
  question: Question | null;
}

const QADisplay = ({ question }: QADisplayProps) => {
  if (!question) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 max-w-2xl w-full px-4 z-30 animate-fade-in">
      <div className="bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-primary/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-primary fill-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <MessageCircleQuestion className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Featured Question</span>
            </div>
            <p className="text-foreground text-lg">{question.text}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Asked by {question.authorName} • {question.upvotes} upvote{question.upvotes !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QADisplay;
