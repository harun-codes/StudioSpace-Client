
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Aperture,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const slides = [
  {
    id: "01",
    category: "CREATIVE WORKSPACE",
    title: "A space for every great idea.",
    description:
      "Discover inspiring environments designed for collaboration, creativity and production.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=90",
  },
  {
    id: "02",
    category: "MUSIC & RECORDING STUDIO",
    title: "Give your ideas a voice.",
    description:
      "Discover inspiring spaces built for music recording, mixing and sound production.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=90",
  },
  {
    id: "03",
    category: "ART & CREATIVE WORKSHOP",
    title: "Make space for creativity.",
    description:
      "Explore unique creative environments where imagination comes alive.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=90",
  },
];

export default function Bannar() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  const previousSlide = () => {
    setActiveSlide(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  const nextSlide = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  return (
    <section className="overflow-hidden bg-[#F5F3EE] transition-colors duration-300 dark:bg-[#12191C]">
      <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:px-12 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <div className="flex flex-col items-start">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#F16F50]" />

              <p className="text-xs font-bold uppercase tracking-[4px] text-[#F16F50] sm:text-sm">
                StudioSpace Creative Marketplace
              </p>
            </div>

            <h1 className="max-w-[680px] text-[46px] font-extrabold leading-[1.08] tracking-[-2.5px] text-[#202729] transition-colors duration-300 dark:text-[#E6E8E8] sm:text-6xl lg:text-[68px] xl:text-[76px]">
              Find your space.
              <span className="block text-[#F16F50]">
                Create your story.
              </span>
            </h1>

            <p className="mt-6 max-w-[520px] text-base leading-8 text-[#727A77] dark:text-[#B5BDBA] sm:text-lg">
              Discover and book inspiring creative spaces for photography,
              filmmaking, podcasting, music and everything in between.
              Your next big idea deserves the perfect space.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/studios"
                className="group flex items-center gap-3 rounded-xl bg-[#F16F50] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#DF5D40] hover:shadow-lg hover:shadow-[#F16F50]/20"
              >
                Explore Studios

                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>

              <Link
                href="/register"
                className="group flex items-center gap-3 rounded-xl border border-[#202729]/20 px-7 py-4 text-sm font-bold text-[#202729] transition-all duration-300 hover:border-[#202729] hover:bg-[#202729] hover:text-white dark:border-white/20 dark:text-[#E6E8E8] dark:hover:border-[#E6E8E8] dark:hover:bg-[#E6E8E8] dark:hover:text-[#202729]"
              >
                Host Your Space

                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3 border-t border-[#202729]/10 pt-5 dark:border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCE6DA] text-[#202729] dark:bg-[#233034] dark:text-[#E6E8E8]">
                <Aperture size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#202729] dark:text-[#E6E8E8]">
                  One platform. Endless creativity.
                </p>

                <p className="mt-1 text-xs text-[#727A77] dark:text-[#B5BDBA]">
                  Discover spaces. Connect. Create.
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-w-0">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#DCE6DA] blur-3xl dark:bg-[#233D35]/60" />

            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#F16F50]/10 blur-3xl" />

            <div className="relative z-10 overflow-hidden rounded-[26px] bg-[#202729] p-2 shadow-2xl shadow-[#202729]/10 transition-colors duration-300 dark:bg-[#233034] dark:shadow-black/30 sm:rounded-[30px] sm:p-3">
              <div className="relative h-[430px] overflow-hidden rounded-[20px] sm:h-[520px] lg:h-[570px]">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    aria-hidden={index !== activeSlide}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === activeSlide
                        ? "z-10 opacity-100"
                        : "z-0 opacity-0"
                    }`}
                    style={{
                      backgroundImage: `url("${slide.image}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101717]/90 via-[#101717]/25 to-[#101717]/10" />

                    <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/30 bg-[#202729]/40 px-4 py-2 backdrop-blur-md sm:left-8 sm:top-8">
                      <span className="h-2 w-2 rounded-full bg-[#F16F50]" />

                      <span className="text-[10px] font-bold uppercase tracking-[2px] text-white sm:text-xs">
                        {slide.category}
                      </span>
                    </div>

                    <div className="absolute right-6 top-5 text-5xl font-extrabold tracking-tight text-white/40 sm:right-8 sm:top-7 sm:text-6xl">
                      {slide.id}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-7 pb-16 sm:p-10 sm:pb-20">
                      <p className="mb-4 text-xs font-bold uppercase tracking-[3px] text-[#F16F50]">
                        DISCOVER YOUR NEXT SPACE
                      </p>

                      <h2 className="max-w-[450px] text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                        {slide.title}
                      </h2>

                      <p className="mt-4 max-w-[390px] text-sm leading-7 text-white/75 sm:text-base">
                        {slide.description}
                      </p>

                      <Link
                        href="/studios"
                        tabIndex={index === activeSlide ? 0 : -1}
                        className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-[#F16F50]"
                      >
                        Discover spaces
                        <ArrowUpRight size={17} />
                      </Link>
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-6 left-7 z-20 flex items-center gap-2 sm:left-10">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      aria-label={`Go to slide ${index + 1}`}
                      aria-current={index === activeSlide}
                      onClick={() => setActiveSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === activeSlide
                          ? "w-8 bg-[#F16F50]"
                          : "w-2 bg-white/60 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-5 right-6 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Previous slide"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-[#202729]/30 text-white backdrop-blur-md transition-colors hover:bg-[#F16F50]"
                  >
                    <ChevronLeft size={19} />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-[#202729]/30 text-white backdrop-blur-md transition-colors hover:bg-[#F16F50]"
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 right-5 z-20 flex items-center gap-4 rounded-2xl border border-[#202729]/5 bg-white px-5 py-3 shadow-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#1C2629] sm:-right-4 sm:px-7 sm:py-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-[#202729] dark:text-[#E6E8E8]">
                  0{activeSlide + 1}
                </span>

                <span className="text-sm font-medium text-[#727A77] dark:text-[#B5BDBA]">
                  / 03
                </span>
              </div>

              <div className="h-8 w-px bg-[#202729]/15 dark:bg-white/15" />

              <div>
                <p className="text-xs font-bold text-[#202729] dark:text-[#E6E8E8]">
                  Explore More
                </p>

                <p className="mt-1 text-[10px] text-[#727A77] dark:text-[#B5BDBA]">
                  Find your inspiration
                </p>
              </div>

              <ArrowUpRight
                size={19}
                className="text-[#F16F50]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
