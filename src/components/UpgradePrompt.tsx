import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, Zap, Lock } from "lucide-react";
import { SubscriptionTier } from "@/contexts/AuthContext";

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  requiredTier: SubscriptionTier;
}

const tierInfo = {
  basic: {
    name: "Basic",
    icon: Lock,
    price: "Free",
    color: "text-muted-foreground",
  },
  premium: {
    name: "Premium",
    icon: Zap,
    price: "₹599/mo",
    color: "text-primary",
  },
  ultimate: {
    name: "Ultimate",
    icon: Crown,
    price: "₹999/mo",
    color: "text-primary",
  },
  none: {
    name: "None",
    icon: Lock,
    price: "Free",
    color: "text-muted-foreground",
  },
};

const UpgradePrompt = ({ isOpen, onClose, featureName, requiredTier }: UpgradePromptProps) => {
  const navigate = useNavigate();
  const tier = tierInfo[requiredTier];
  const TierIcon = tier.icon;

  const handleUpgrade = () => {
    onClose();
    navigate("/subscription");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10">
            <TierIcon className={`w-8 h-8 ${tier.color}`} />
          </div>
          <DialogTitle className="text-xl">Upgrade to {tier.name}</DialogTitle>
          <DialogDescription className="text-base pt-2">
            <span className="font-medium text-foreground">{featureName}</span> is available on the{" "}
            <span className={`font-semibold ${tier.color}`}>{tier.name}</span> plan and above.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-secondary/50 rounded-lg p-4 my-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{tier.name} Plan</p>
              <p className="text-sm text-muted-foreground">
                {requiredTier === "premium"
                  ? "Virtual backgrounds, recording, 50 participants"
                  : "All features, breakout rooms, polls, 500 participants"}
              </p>
            </div>
            <p className="text-xl font-bold">{tier.price}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Maybe Later
          </Button>
          <Button className="flex-1" onClick={handleUpgrade}>
            Upgrade Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePrompt;
