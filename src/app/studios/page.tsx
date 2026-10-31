
import { Suspense } from "react";

import StudioHeader from "@/components/studios/studio-header";
import StudioFilters, {
  categoryOptions,
  type SortOption,
} from "@/components/studios/studio-filters";
import StudioCard, {
  type Studio,
} from "@/components/studios/studio-card";

type SearchParams = {
  category?: string | string[];
  search?: string | string[];
  sort?: string | string[];
};

type Props = {
  searchParams: Promise<SearchParams>;
};

function getParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getTimestamp(date?: Studio["createdAt"]) {
  if (!date) return 0;

  const value = typeof date === "string" ? date : date.$date;

  return value ? new Date(value).getTime() || 0 : 0;
}

async function StudiosContent({ searchParams }: Props) {
  const params = await searchParams;

  const category = getParam(params.category);
  const search = getParam(params.search).trim().toLowerCase();
  const requestedSort = getParam(params.sort);

  const selectedCategory = categoryOptions.includes(category)
    ? category
    : "All Studios";

  const sortBy: SortOption = [
    "newest",
    "price-low",
    "price-high",
    "rating",
  ].includes(requestedSort)
    ? (requestedSort as SortOption)
    : "newest";

  let studios: Studio[] = [];
  let error = "";

  try {
    const response = await fetch("http://localhost:5000/studios", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch studios.");
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid studio data received.");
    }

    studios = data as Studio[];
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Something went wrong.";
  }

  let filteredStudios = studios.filter(
    (studio) => studio.isActive !== false
  );

  if (selectedCategory !== "All Studios") {
    filteredStudios = filteredStudios.filter(
      (studio) => studio.category === selectedCategory
    );
  }

  if (search) {
    filteredStudios = filteredStudios.filter((studio) =>
      `${studio.title} ${studio.location} ${studio.category}`
        .toLowerCase()
        .includes(search)
    );
  }

  filteredStudios.sort((a, b) => {
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

  return (
    <>
      <StudioFilters
        searchTerm={getParam(params.search)}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
      />

      <div className="mb-7 mt-12">
        <h2 className="text-2xl font-extrabold text-[#202729] sm:text-3xl">
          Explore Studios
        </h2>

        <p className="mt-2 text-sm text-[#929797]">
          {error
            ? "Unable to load studios"
            : `Showing ${filteredStudios.length} studios`}
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-white px-6 py-16 text-center">
          <h3 className="text-xl font-bold text-[#202729]">
            Unable to load studios
          </h3>

          <p className="mt-3 text-sm text-[#777D7D]">
            Please check your backend server and try again.
          </p>
        </div>
      ) : filteredStudios.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#DAD6CF] bg-white px-6 py-20 text-center">
          <h3 className="text-xl font-bold text-[#202729]">
            No studios found
          </h3>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#929797]">
            Try another search or select a different category.
          </p>
        </div>
      )}
    </>
  );
}

function StudiosLoading() {
  return (
    <div className="space-y-10">
      <div className="h-48 animate-pulse rounded-2xl bg-[#EAE7E2]" />

      <div className="space-y-4">
        <div className="h-8 w-56 animate-pulse rounded bg-[#EAE7E2]" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-white"
            >
              <div className="aspect-[4/3] animate-pulse bg-[#EAE7E2]" />

              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-[#EAE7E2]" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-[#EAE7E2]" />
                <div className="h-8 w-1/3 animate-pulse rounded bg-[#EAE7E2]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StudiosPage({ searchParams }: Props) {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <StudioHeader />

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:py-16">
        <Suspense fallback={<StudiosLoading />}>
          <StudiosContent searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
