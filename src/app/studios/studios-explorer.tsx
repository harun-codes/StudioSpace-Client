
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  Search,
  MapPin,
  Star,
  ArrowUpRight,
  SlidersHorizontal,
  RefreshCw,
  X,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const categoryOptions = ["All Studios", ...categories];

type SortOption = "newest" | "price-low" | "price-high" | "rating";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt?: string | { $date?: string };
};

function getTimestamp(date?: Studio["createdAt"]) {
  if (!date) return 0;

  const value = typeof date === "string" ? date : date.$date;

  return value ? new Date(value).getTime() : 0;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAE7E2] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#F16F50]/50 hover:shadow-xl hover:shadow-black/[0.06]">
      <Link
        href={`/studios/${studio._id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#EDEAE5]"
      >
        <img
          src={studio.imageUrl}
          alt={studio.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#202729] shadow-sm">
          {studio.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/studios/${studio._id}`}>
            <h2 className="text-lg font-bold text-[#202729] transition-colors hover:text-[#F16F50]">
              {studio.title}
            </h2>
          </Link>

          <div className="flex shrink-0 items-center gap-1 text-sm font-bold text-[#202729]">
            <Star size={15} className="fill-[#F5A623] text-[#F5A623]" />
            {typeof studio.rating === "number"
              ? studio.rating.toFixed(1)
              : "New"}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-[#777D7D]">
          <MapPin size={16} className="shrink-0 text-[#F16F50]" />
          <span>{studio.location}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#EEECE8] pt-5 mt-5">
          <div>
            <p className="text-xs text-[#929797]">Hourly rate</p>

            <p className="mt-1 text-xl font-extrabold text-[#202729]">
              {formatPrice(studio.hourlyRate)}
              <span className="ml-1 text-sm font-medium text-[#929797]">
                / hr
              </span>
            </p>

            <p className="mt-1 text-xs text-[#929797]">
              {studio.reviewCount ?? 0} reviews
            </p>
          </div>

          <Link
            href={`/studios/${studio._id}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#202729] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#F16F50]"
          >
            View Details
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function StudioSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#EAE7E2] bg-white">
      <div className="aspect-[4/3] animate-pulse bg-[#EAE7E2]" />

      <div className="space-y-4 p-5">
        <div className="h-6 w-3/4 animate-pulse rounded bg-[#EAE7E2]" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#EAE7E2]" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-[#EAE7E2]" />
        <div className="h-10 w-full animate-pulse rounded bg-[#EAE7E2]" />
      </div>
    </div>
  );
}

export default function StudiosExplorer({
  initialCategory,
}: {
  initialCategory: string;
}) {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(
    categoryOptions.includes(initialCategory)
      ? initialCategory
      : "All Studios"
  );

  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    setSelectedCategory(
      categoryOptions.includes(initialCategory)
        ? initialCategory
        : "All Studios"
    );
  }, [initialCategory]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchStudios() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/studios`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load studios.");
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid studio data received.");
        }

        setStudios(data as Studio[]);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchStudios();

    return () => controller.abort();
  }, []);

  const filteredStudios = useMemo(() => {
    let result = studios.filter((studio) => studio.isActive !== false);

    if (selectedCategory !== "All Studios") {
      result = result.filter(
        (studio) => studio.category === selectedCategory
      );
    }

    if (searchTerm.trim()) {
      const search = searchTerm.trim().toLowerCase();

      result = result.filter((studio) => {
        return (
          studio.title.toLowerCase().includes(search) ||
          studio.location.toLowerCase().includes(search) ||
          studio.category.toLowerCase().includes(search)
        );
      });
    }

    return result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.hourlyRate - b.hourlyRate;

        case "price-high":
          return b.hourlyRate - a.hourlyRate;

        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);

        default:
          return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
      }
    });
  }, [studios, selectedCategory, searchTerm, sortBy]);

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("All Studios");
    setSortBy("newest");
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <section className="border-b border-[#EAE7E2] bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:py-20">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-[2px] w-9 bg-[#F16F50]" />

            <p className="text-xs font-bold uppercase tracking-[4px] text-[#F16F50]">
              Explore Creative Spaces
            </p>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#202729] sm:text-5xl lg:text-6xl">
            Find your next
            <span className="block text-[#F16F50]">
              creative space.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#777D7D] sm:text-lg">
            Discover inspiring studios, professional production
            spaces and creative environments built for your next
            big idea.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="rounded-2xl border border-[#EAE7E2] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-2">
            <SlidersHorizontal size={19} className="text-[#F16F50]" />

            <h2 className="font-bold text-[#202729]">
              Find Your Perfect Studio
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929797]"
              />

              <input
                type="text"
                placeholder="Search studio name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full rounded-xl border border-[#EAE7E2] bg-[#FAF9F7] pl-11 pr-4 text-sm text-[#202729] outline-none transition focus:border-[#F16F50] focus:ring-2 focus:ring-[#F16F50]/10"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#EAE7E2] bg-[#FAF9F7] px-4 text-sm text-[#202729] outline-none transition focus:border-[#F16F50]"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-12 w-full rounded-xl border border-[#EAE7E2] bg-[#FAF9F7] px-4 text-sm text-[#202729] outline-none transition focus:border-[#F16F50]"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {categoryOptions.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === category
                    ? "border-[#F16F50] bg-[#F16F50] text-white"
                    : "border-[#EAE7E2] bg-white text-[#777D7D] hover:border-[#F16F50] hover:text-[#F16F50]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-7 mt-12 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#202729] sm:text-3xl">
              Explore Studios
            </h2>

            <p className="mt-2 text-sm text-[#929797]">
              {loading
                ? "Finding creative spaces..."
                : `Showing ${filteredStudios.length} studios`}
            </p>
          </div>

          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#777D7D] transition hover:text-[#F16F50]"
          >
            <X size={16} />
            Clear Filters
          </button>
        </div>

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <StudioSkeleton key={index} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-bold text-[#202729]">
              Unable to load studios
            </h3>

            <p className="mt-3 text-sm text-[#777D7D]">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F16F50] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#DF5D40]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filteredStudios.length > 0 && (
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}

        {!loading && !error && filteredStudios.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#DAD6CF] bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F16F50]/10">
              <Search size={28} className="text-[#F16F50]" />
            </div>

            <h3 className="mt-6 text-xl font-bold text-[#202729]">
              No studios found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#929797]">
              No studios match your search. Try another keyword
              or choose a different category.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-[#202729] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#F16F50]"
            >
              Explore All Studios
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
