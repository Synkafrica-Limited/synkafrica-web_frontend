import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (token) => {
  if (socket) return socket;

  if (!token) {
    console.warn("Socket initialization skipped: No token provided");
    return null;
  }

  const SOCKET_URL = "https://api.synkkafrica.com";

  socket = io(SOCKET_URL, {
    path: "/socket.io",
    transports: ["websocket"],
    auth: {
      token,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on("connect", () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Socket connected:", socket.id);
    }
  });

  socket.on("connect_error", (err) => {
    if (process.env.NODE_ENV === "development") {
      console.error("Socket connection error:", err.message);
    }
  });

  socket.on("disconnect", (reason) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Socket disconnected:", reason);
    }
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
