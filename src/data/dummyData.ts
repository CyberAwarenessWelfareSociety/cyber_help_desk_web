import { Participant, ChatMessage, NetworkQuality } from "@/types/meeting";

// Dummy participants data
export const dummyParticipants: Participant[] = [
  {
    id: "1",
    name: "You",
    isMuted: false,
    isCameraOff: false,
    isActiveSpeaker: false,
    isHost: true,
    networkQuality: "excellent" as NetworkQuality,
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    isMuted: false,
    isCameraOff: false,
    isActiveSpeaker: true,
    networkQuality: "good" as NetworkQuality,
  },
  {
    id: "3",
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    isMuted: true,
    isCameraOff: false,
    isActiveSpeaker: false,
    networkQuality: "fair" as NetworkQuality,
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    isMuted: false,
    isCameraOff: true,
    isActiveSpeaker: false,
    networkQuality: "poor" as NetworkQuality,
  },
  {
    id: "5",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    isMuted: true,
    isCameraOff: false,
    isActiveSpeaker: false,
    networkQuality: "excellent" as NetworkQuality,
  },
];

// Dummy chat messages
export const dummyMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: "2",
    senderName: "Sarah Chen",
    content: "Hi everyone! Can you hear me okay?",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    senderId: "3",
    senderName: "Marcus Johnson",
    content: "Yes, loud and clear! 👍",
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: "3",
    senderId: "4",
    senderName: "Emily Rodriguez",
    content: "I'm having some camera issues, will be joining video shortly",
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: "4",
    senderId: "2",
    senderName: "Sarah Chen",
    content: "No worries Emily, take your time!",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "5",
    senderId: "5",
    senderName: "David Kim",
    content: "Should we start with the agenda?",
    timestamp: new Date(Date.now() - 60000),
  },
];

// Generate a random meeting code
export const generateMeetingCode = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const segments = [3, 4, 3];
  return segments
    .map((len) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    )
    .join("-");
};
