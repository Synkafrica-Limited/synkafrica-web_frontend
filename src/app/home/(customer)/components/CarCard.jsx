import React from "react";

export default function CarCard({
  image,
  label,
  labelColor = "bg-purple-700",
  title,
  subtitle,
  features = [],
  priceRows = [],
  rightLogo,
  children,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden p-4 w-full max-w-xs">
      {label && (
        <span
          className={`inline-block px-4 py-2 rounded-full text-base font-semibold text-white mb-3 ${labelColor}`}
        >
          {label}
        </span>
      )}
      {image && (
        <img
          src={image}
          alt={title}
          className="h-32 w-full object-contain mb-2"
        />
      )}
      <div className="font-bold text-xl mb-1">{title}</div>
      <div className="text-gray-700 text-base mb-4">{subtitle}</div>
      {/* Features and Prices */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-2 items-center mb-2">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2 text-base text-gray-900">
            {f.icon && <span className="text-xl">{f.icon}</span>}
            <span>{f.text}</span>
          </div>
        ))}
        {priceRows.map((row, i) => (
          <div
            key={i}
            className={`flex items-center justify-between text-base font-semibold text-gray-900 ${
              row.logo ? "col-span-2" : ""
            }`}
          >
            {row.logo ? (
              <img src={row.logo} alt="logo" className="h-6 w-auto" />
            ) : (
              <span>{row.label}</span>
            )}
            <span>{row.price}</span>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}