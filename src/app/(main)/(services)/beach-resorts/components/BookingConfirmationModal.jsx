export default function BookingConfirmationModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full relative">
        <button className="absolute top-3 right-3 text-gray-400" onClick={onClose}>✕</button>
        <div className="mb-4">Your reservation has been made, go to my booking page to complete your payment. Reservation expires in 3hrs.</div>
        <div className="text-xs text-gray-500">Thank you for choosing us.</div>
      </div>
    </div>
  );
}