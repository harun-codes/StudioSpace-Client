
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";

export const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

export const categoryOptions = ["All Studios", ...categories];

export type SortOption =
  | "newest"
  | "price-low"
  | "price-high"
  | "rating";

type Props = {
  searchTerm: string;
  selectedCategory: string;
  sortBy: SortOption;
};

function getCategoryUrl(
  category: string,
  searchTerm: string,
  sortBy: SortOption
) {
  const params = new URLSearchParams();

  if (category !== "All Studios") {
    params.set("category", category);
  }

  if (searchTerm) {
    params.set("search", searchTerm);
  }

  if (sortBy !== "newest") {
    params.set("sort", sortBy);
  }

  const query = params.toString();

  return query ? `/studios?${query}` : "/studios";
}

export default function StudioFilters({
  searchTerm,
  selectedCategory,
  sortBy,
}: Props) {
  return (
    <div className="rounded-2xl border border-[#EAE7E2] bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5 flex items-center gap-2">
        <SlidersHorizontal size={19} className="text-[#F16F50]" />

        <h2 className="font-bold text-[#202729]">
          Find Your Perfect Studio
        </h2>
      </div>

      <form
        action="/studios"
        method="GET"
        className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_auto]"
      >
        <div className="relative">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#929797]"
          />

          <input
            type="text"
            name="search"
            defaultValue={searchTerm}
            placeholder="Search studio name or location..."
            className="h-12 w-full rounded-xl border border-[#EAE7E2] bg-[#FAF9F7] pl-11 pr-4 text-sm text-[#202729] outline-none transition focus:border-[#F16F50] focus:ring-2 focus:ring-[#F16F50]/10"
          />
        </div>

        <select
          name="category"
          defaultValue={selectedCategory}
          className="h-12 w-full rounded-xl border border-[#EAE7E2] bg-[#FAF9F7] px-4 text-sm text-[#202729] outline-none transition focus:border-[#F16F50]"
        >
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          name="sort"
          defaultValue={sortBy}
          className="h-12 w-full rounded-xl border border-[#EAE7E2] bg-[#FAF9F7] px-4 text-sm text-[#202729] outline-none transition focus:border-[#F16F50]"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>

        <button
          type="submit"
          className="h-12 rounded-xl bg-[#F16F50] px-6 text-sm font-bold text-white transition hover:bg-[#DF5D40]"
        >
          Apply Filters
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        {categoryOptions.map((category) => (
          <Link
            key={category}
            href={getCategoryUrl(category, searchTerm, sortBy)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
              selectedCategory === category
                ? "border-[#F16F50] bg-[#F16F50] text-white"
                : "border-[#EAE7E2] bg-white text-[#777D7D] hover:border-[#F16F50] hover:text-[#F16F50]"
            }`}
          >
            {category}
          </Link>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#777D7D] transition hover:text-[#F16F50]"
        >
          <X size={16} />
          Clear Filters
        </Link>
      </div>
    </div>
  );
}
