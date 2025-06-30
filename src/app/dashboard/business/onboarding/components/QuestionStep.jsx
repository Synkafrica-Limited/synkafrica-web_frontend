export default function QuestionStep({ title, description, children }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="text-sm text-gray-400">Step 1</div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
