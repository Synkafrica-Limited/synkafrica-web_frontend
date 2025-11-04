"use client";

export default function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-28 justify-between">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="text-gray-700 leading-7 space-y-4 text-sm sm:text-base">{children}</div>
    </section>
  );
}
