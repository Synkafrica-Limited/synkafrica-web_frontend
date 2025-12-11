import { getVendorSocket } from "./socket";

export const vendorSocket = getVendorSocket();

export const setupVendorSocketListeners = (handlers) => {
  if (!vendorSocket) return;

  vendorSocket.on("booking:new", handlers.onBookingNew);
  vendorSocket.on("support:message", handlers.onSupportMessage);
  vendorSocket.on("verification:update", handlers.onVerificationUpdate);
  vendorSocket.on("booking:expired", handlers.onBookingExpired);
  vendorSocket.on("booking:cancelled", handlers.onBookingCancelled);
};

export const removeVendorSocketListeners = (handlers) => {
  if (!vendorSocket) return;

  vendorSocket.off("booking:new", handlers.onBookingNew);
  vendorSocket.off("support:message", handlers.onSupportMessage);
  vendorSocket.off("verification:update", handlers.onVerificationUpdate);
  vendorSocket.off("booking:expired", handlers.onBookingExpired);
  vendorSocket.off("booking:cancelled", handlers.onBookingCancelled);
};

export default getVendorSocket;
