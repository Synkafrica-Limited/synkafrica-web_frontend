import { getCustomerSocket } from "./socket";

export const customerSocket = getCustomerSocket();

export const setupCustomerSocketListeners = (handlers) => {
  if (!customerSocket) return;

  customerSocket.on("booking:accepted", handlers.onBookingAccepted);
  customerSocket.on("booking:timer", handlers.onBookingTimer);
  customerSocket.on("payment:update", handlers.onPaymentUpdate);
  customerSocket.on("booking:rejected", handlers.onBookingRejected);
  customerSocket.on("booking:completed", handlers.onBookingCompleted);
};

export const removeCustomerSocketListeners = (handlers) => {
  if (!customerSocket) return;

  customerSocket.off("booking:accepted", handlers.onBookingAccepted);
  customerSocket.off("booking:timer", handlers.onBookingTimer);
  customerSocket.off("payment:update", handlers.onPaymentUpdate);
  customerSocket.off("booking:rejected", handlers.onBookingRejected);
  customerSocket.off("booking:completed", handlers.onBookingCompleted);
};

export default getCustomerSocket;
