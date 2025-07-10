"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Reusable image carousel card for previewing images.
 * 
 * Props:
 * - images: array of image URLs (required)
 * - alt: alt text for images (optional)
 * - className: additional classes for the card (optional)
 * - children: content to render below the image (optional)
 */
export default function ImageCarouselCard({ images = [], alt = "", className = "", children }) {
  const [idx, setIdx] = useState(0);

  if (!images.length) return null;

  function prev() {
    setIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  }
  function next() {
    setIdx((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <div className={`relative rounded-xl overflow-hidden bg-white shadow ${className}`}>
      <div className="relative w-full h-40">
        <img
          src={images[idx]}
          alt={alt}
          className="w-full h-40 object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow"
              onClick={e => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              type="button"
            >
              <ChevronLeft />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow"
              onClick={e => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              type="button"
            >
              <ChevronRight />
            </button>
            <div className="absolute right-3 bottom-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
              {idx + 1}/{images.length}
            </div>
          </>
        )}
      </div>
      {children && <div className="p-4">{children}</div>}
    </div>
  );
}