"use client";

export default function QuickMenu({ items, show, onToggle, onJump }) {
  return (
    <div>
      <div className="lg:hidden mb-2">
        <button
          type="button"
          onClick={onToggle}
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left font-medium text-gray-800"
        >
          Quick menu
        </button>
      </div>
      <nav className={`${show ? "block" : "hidden"} lg:block lg:sticky lg:top-24 rounded-2xl border border-gray-100 bg-white`}>
        <div className="px-4 py-4 text-sm font-semibold text-gray-800">Quick menu</div>
        <ul className="divide-y divide-gray-100">
          {items.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onJump(s.id)}
                className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
