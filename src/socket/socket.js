// src/lib/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8600";

// Single shared socket instance
export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false, // connect only when user starts joining
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 800,
});
