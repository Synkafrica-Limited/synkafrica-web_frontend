export default function ReviewCard({ user, rating, date, text }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <img src={user.avatar}  className="w-7 h-7 rounded-full" />
        <span className="font-semibold">{user.name}</span>
        <span className="text-xs text-gray-400">{user.location}</span>
        <span className="text-xs text-orange-600">★{rating}</span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>
      <div className="text-gray-700 text-sm">{text}</div>
    </div>
  );
}