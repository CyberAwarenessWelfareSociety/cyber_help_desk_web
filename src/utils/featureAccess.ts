import { SubscriptionTier } from "@/contexts/AuthContext";

export interface FeatureAccess {
  virtualBackgrounds: boolean;
  recording: boolean;
  breakoutRooms: boolean;
  pollsQA: boolean;
  unlimitedDuration: boolean;
  maxParticipants: number;
  hdVideo: boolean;
  fullHdVideo: boolean;
  video4K: boolean;
}

export const getFeatureAccess = (subscription: SubscriptionTier | undefined): FeatureAccess => {
  const tier = subscription || "none";
  
  switch (tier) {
    case "ultimate":
      return {
        virtualBackgrounds: true,
        recording: true,
        breakoutRooms: true,
        pollsQA: true,
        unlimitedDuration: true,
        maxParticipants: 500,
        hdVideo: true,
        fullHdVideo: true,
        video4K: true,
      };
    case "premium":
      return {
        virtualBackgrounds: true,
        recording: true,
        breakoutRooms: false,
        pollsQA: false,
        unlimitedDuration: true,
        maxParticipants: 50,
        hdVideo: true,
        fullHdVideo: true,
        video4K: false,
      };
    case "basic":
      return {
        virtualBackgrounds: false,
        recording: false,
        breakoutRooms: false,
        pollsQA: false,
        unlimitedDuration: false,
        maxParticipants: 4,
        hdVideo: true,
        fullHdVideo: false,
        video4K: false,
      };
    default:
      return {
        virtualBackgrounds: false,
        recording: false,
        breakoutRooms: false,
        pollsQA: false,
        unlimitedDuration: false,
        maxParticipants: 4,
        hdVideo: true,
        fullHdVideo: false,
        video4K: false,
      };
  }
};

export const getRequiredTier = (feature: keyof FeatureAccess): SubscriptionTier => {
  switch (feature) {
    case "breakoutRooms":
    case "pollsQA":
    case "video4K":
      return "ultimate";
    case "virtualBackgrounds":
    case "recording":
    case "fullHdVideo":
    case "unlimitedDuration":
      return "premium";
    default:
      return "basic";
  }
};
