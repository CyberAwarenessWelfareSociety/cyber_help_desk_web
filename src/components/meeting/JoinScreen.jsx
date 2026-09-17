import { useState } from "react";
import { Video, Keyboard, Copy, Check, Link, Share2, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateMeetingCode } from "@/data/dummyData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";


const JoinScreen = ({ onJoinMeeting }) => {
  const [meetingCode, setMeetingCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getMeetingLink = (code) => {
    return `${window.location.origin}?code=${code}`;
  };

  const handleCreateMeeting = () => {
    const newCode = generateMeetingCode();
    setGeneratedCode(newCode);
    setIsShareModalOpen(true);
  };

  const handleStartMeeting = () => {
    setIsShareModalOpen(false);
    onJoinMeeting(generatedCode);
  };

  const handleJoinMeeting = () => {
    if (meetingCode.trim()) {
      onJoinMeeting(meetingCode.trim());
    }
  };

  const handleCopyLink = async () => {
    const link = getMeetingLink(generatedCode);
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      toast.success("Meeting link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast.success("Meeting code copied!");
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleShareVia = (method) => {
    const link = getMeetingLink(generatedCode);
    const subject = "Join my MeetApp meeting";
    const body = `You're invited to join a video meeting!\n\nMeeting Link: ${link}\nMeeting Code: ${generatedCode}\n\nClick the link or enter the code to join.`;

    if (method === "email") {
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    } else if (method === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${subject}\n\n${body}`)}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Live Classes</h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Video calls for
            <span className="text-primary block">everyone</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect, collaborate, and celebrate from anywhere with secure video meetings.
          </p>
        </div>

        {/* Right side - Actions */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="glass-panel rounded-2xl p-8 space-y-6">
            <Button
              variant="hero"
              size="xl"
              className="w-full"
              onClick={handleCreateMeeting}
            >
              <Video className="w-5 h-5 mr-2" />
              New Meeting
            </Button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-muted-foreground text-sm">or join with a code</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter meeting code"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoinMeeting()}
                  className="pl-12 h-14 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button
                variant="hero-secondary"
                size="xl"
                onClick={handleJoinMeeting}
                disabled={!meetingCode.trim()}
              >
                Join
              </Button>
            </div>
          </div>

          {/* Preview card */}
          <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-video-card flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold">Y</span>
              </div>
            </div>
            <div>
              <p className="font-medium text-foreground">Ready to join?</p>
              <p className="text-sm text-muted-foreground">Your camera and mic are ready</p>
            </div>
            <div className="ml-auto flex gap-2">
              <div className="w-3 h-3 rounded-full bg-online animate-pulse-soft" />
            </div>
          </div>
        </div>
      </div>

      {/* Share Meeting Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Share Meeting Invite
            </DialogTitle>
            <DialogDescription>
              Share this link with others to invite them to your meeting
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Meeting Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Meeting Link</label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    readOnly
                    value={getMeetingLink(generatedCode)}
                    className="pl-10 pr-4 bg-secondary text-foreground"
                  />
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Meeting Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Meeting Code</label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 rounded-lg bg-secondary border border-border font-mono text-lg text-center tracking-wider">
                  {generatedCode}
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleCopyCode}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Share Options */}
            <div className="pt-2">
              <label className="text-sm font-medium text-foreground mb-3 block">Share via</label>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleShareVia("email")}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => handleShareVia("whatsapp")}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setIsShareModalOpen(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleStartMeeting}>
              <Video className="w-4 h-4 mr-2" />
              Start Meeting
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoinScreen;
