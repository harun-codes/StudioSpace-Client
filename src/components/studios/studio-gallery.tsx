
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
    <div className="w-full min-w-0">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#EAE7E2] dark:bg-[#263437] sm:aspect-[16/9]">
        {images.length > 0 ? (
          <img
            src={images[activeIndex]}
            alt={`${title} - Image ${activeIndex + 1}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#777D7D] dark:text-[#A1AAAA]">
            Image unavailable
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-[#202729]/80 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md sm:bottom-5 sm:left-5 sm:px-4">
          <Images size={16} />
          {images.length > 0 ? activeIndex + 1 : 0} / {images.length}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 sm:bottom-5 sm:right-5">
            <button
              type="button"
              onClick={previousImage}
              aria-label="Previous image"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#202729] shadow-md transition hover:bg-[#F16F50] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16F50] sm:h-11 sm:w-11 dark:bg-[#1C2629] dark:text-white dark:hover:bg-[#F16F50]"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#202729] shadow-md transition hover:bg-[#F16F50] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16F50] sm:h-11 sm:w-11 dark:bg-[#1C2629] dark:text-white dark:hover:bg-[#F16F50]"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View studio image ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={`aspect-[4/3] min-w-0 overflow-hidden rounded-xl border-2 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16F50] ${
                activeIndex === index
                  ? "border-[#F16F50]"
                  : "border-transparent hover:border-[#F16F50]/50"
              }`}
            >
              <img
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
