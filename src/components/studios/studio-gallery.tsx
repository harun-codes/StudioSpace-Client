
"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";

type Props = {
  title: string;
  imageUrl: string;
  galleryImages?: string[];
};

export default function StudioGallery({
  title,
  imageUrl,
  galleryImages = [],
}: Props) {
  const images = Array.from(
    new Set([imageUrl, ...galleryImages].filter(Boolean))
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const previousImage = () => {
    setActiveIndex(
      (current) => (current - 1 + images.length) % images.length
    );
  };

  const nextImage = () => {
    setActiveIndex((current) => (current + 1) % images.length);
  };

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#EAE7E2] sm:aspect-[16/9]">
        {images.length > 0 ? (
          <img
            src={images[activeIndex]}
            alt={`${title} - Image ${activeIndex + 1}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#777D7D]">
            Image unavailable
          </div>
        )}

        <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-[#202729]/80 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
          <Images size={16} />
          {images.length > 0 ? activeIndex + 1 : 0} / {images.length}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-5 right-5 flex items-center gap-2">
            <button
              type="button"
              onClick={previousImage}
              aria-label="Previous image"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#202729] transition hover:bg-[#F16F50] hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#202729] transition hover:bg-[#F16F50] hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View studio image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all ${
                activeIndex === index
                  ? "border-[#F16F50]"
                  : "border-transparent hover:border-[#F16F50]/50"
              }`}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
