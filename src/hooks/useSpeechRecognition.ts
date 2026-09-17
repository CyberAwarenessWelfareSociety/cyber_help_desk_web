import { useState, useEffect, useCallback, useRef } from "react";

export interface Caption {
  id: string;
  speaker: string;
  text: string;
  timestamp: Date;
  isFinal: boolean;
}

interface UseSpeechRecognitionResult {
  isListening: boolean;
  isSupported: boolean;
  captions: Caption[];
  currentTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  clearCaptions: () => void;
}

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export const useSpeechRecognition = (): UseSpeechRecognitionResult => {
  const [isListening, setIsListening] = useState(false);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isListeningRef = useRef(isListening);

  // Keep ref in sync with state
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Check if browser supports Web Speech API
  const isSupported = typeof window !== "undefined" && 
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionConstructor();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setCurrentTranscript(interimTranscript);

      if (finalTranscript) {
        const newCaption: Caption = {
          id: `caption-${Date.now()}-${Math.random()}`,
          speaker: "You",
          text: finalTranscript.trim(),
          timestamp: new Date(),
          isFinal: true,
        };
        setCaptions((prev) => [...prev.slice(-50), newCaption]); // Keep last 50 captions
        setCurrentTranscript("");
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech" && event.error !== "aborted") {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Auto-restart if still supposed to be listening
      if (isListeningRef.current && recognitionRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Ignore if already started
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSupported]);

  // Handle listening state changes
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started
      }
    } else {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const startListening = useCallback(() => {
    if (isSupported) {
      setIsListening(true);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    setCurrentTranscript("");
  }, []);

  const clearCaptions = useCallback(() => {
    setCaptions([]);
    setCurrentTranscript("");
  }, []);

  return {
    isListening,
    isSupported,
    captions,
    currentTranscript,
    startListening,
    stopListening,
    clearCaptions,
  };
};
