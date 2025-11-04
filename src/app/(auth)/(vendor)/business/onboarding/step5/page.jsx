"use client";
import { useState, useRef } from "react";
import Buttons from "@/components/ui/Buttons";

function ImagePriceModal({ open, onClose, onSave, initial }) {
  const [image, setImage] = useState(initial?.image || null);
  const [mainPrice, setMainPrice] = useState(initial?.mainPrice || "");
  const [discountPrice, setDiscountPrice] = useState(initial?.discountPrice || "");
  const fileInput = useRef();

  function handleFile(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center">
        <h3 className="text-2xl font-bold mb-8 text-center">Add your business pictures and prices</h3>
        <div className="flex flex-col md:flex-row gap-8 w-full items-center justify-center mb-12">
          <div className="flex flex-col items-center">
            {image ? (
              <div className="w-56 h-40 rounded-xl overflow-hidden mb-2 relative">
                <img src={image} alt="preview" className="w-full h-full object-cover" />
                <button
                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1 text-sm"
                  onClick={() => setImage(null)}
                  type="button"
                >Remove</button>
              </div>
            ) : (
              <div
                className="w-56 h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer mb-2"
                onClick={() => fileInput.current.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                <Buttons variant="filled" size="md">Upload image</Buttons>
                <span className="text-xs text-gray-400 mt-2">or drop an image</span>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-2 max-w-xs w-full">
            <div className="font-semibold mb-2">Add prices below</div>
            <input
              className="w-full border rounded-md px-4 py-2 text-base mb-2"
              placeholder="Main price"
              value={mainPrice}
              onChange={e => setMainPrice(e.target.value)}
              type="text"
            />
            <input
              className="w-full border rounded-md px-4 py-2 text-base"
              placeholder="Discounted price"
              value={discountPrice}
              onChange={e => setDiscountPrice(e.target.value)}
              type="text"
            />
          </div>
        </div>
        <div className="flex w-full justify-between mt-8 border-t pt-8">
          <Buttons variant="outline" onClick={onClose}>Cancel</Buttons>
          <Buttons
            variant="filled"
            onClick={() => image && mainPrice && discountPrice && onSave({ image, mainPrice, discountPrice })}
            disabled={!image || !mainPrice || !discountPrice}
          >
            Save
          </Buttons>
        </div>
      </div>
    </div>
  );
}

export default function Step5Page() {
  const [slides, setSlides] = useState(Array(10).fill(null));
  const [modalIdx, setModalIdx] = useState(null);

  function handleSave(idx, data) {
    setSlides(slides => {
      const copy = [...slides];
      copy[idx] = data;
      return copy;
    });
    setModalIdx(null);
  }

  function handleRemove(idx) {
    setSlides(slides => {
      const copy = [...slides];
      copy[idx] = null;
      return copy;
    });
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-gray-400 text-base mb-2 mt-4">Step 5</div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Add your business pictures and prices</h2>
        <p className="text-gray-500 mb-8">You can add up to 10 quality slides, guest will not see this</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-10">
          {slides.map((slide, idx) => (
            <div key={idx} className="relative group">
              <div
                className="bg-white rounded-xl shadow flex flex-col items-center justify-center aspect-square cursor-pointer border border-gray-200 hover:border-primary-500 transition overflow-hidden"
                onClick={() => setModalIdx(idx)}
              >
                {slide ? (
                  <>
                    <img src={slide.image} alt="slide" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition">
                      <Buttons size="sm" variant="outline" onClick={e => { e.stopPropagation(); handleRemove(idx); }}>Remove</Buttons>
                    </div>
                    <div className="absolute left-2 bottom-2 bg-white/80 rounded px-2 py-1 text-xs font-semibold text-gray-800">
                      Price: ${slide.mainPrice}/{slide.discountPrice}
                    </div>
                  </>
                ) : (
                  <span className="text-4xl text-gray-400 font-bold">+</span>
                )}
              </div>
              {modalIdx === idx && (
                <ImagePriceModal
                  open={true}
                  onClose={() => setModalIdx(null)}
                  onSave={data => handleSave(idx, data)}
                  initial={slides[idx]}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Footer navigation handled by layout */}
    </div>
  );
}
