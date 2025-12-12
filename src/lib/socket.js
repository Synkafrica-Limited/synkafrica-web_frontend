import { io } from "socket.io-client";

export const createSocket = () => {
  if (typeof window === "undefined") return null;
  
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "wss://synkkafrica-backend-core.onrender.com/ws";
  
  return io(wsUrl, {
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });
};

let vendorSocketInstance = null;
let customerSocketInstance = null;

export const getVendorSocket = () => {
  if (!vendorSocketInstance) {
    vendorSocketInstance = createSocket();
  }
  return vendorSocketInstance;
};

export const getCustomerSocket = () => {
  if (!customerSocketInstance) {
    customerSocketInstance = createSocket();
  }
  return customerSocketInstance;
};

export const vendorSocket = getVendorSocket();
export const customerSocket = getCustomerSocket();
