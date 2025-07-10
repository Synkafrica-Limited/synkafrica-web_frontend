export default function ServiceFeatureCard({ icon, title, description }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl shadow p-4 mb-4">
      {icon && <div className="text-2xl">{icon}</div>}
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-gray-500 text-sm">{description}</div>
      </div>
    </div>
  );
}