
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import StudioCard, {
  type Studio,
} from "@/components/studios/studio-card";

export default async function FeaturedStudios() {
  let studios: Studio[] = [];
  let error = false;

  try {
    const res = await fetch("http://localhost:5000/featured-studios", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch featured studios");
    }

    const data: unknown = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid studio data");
    }

    studios = (data as Studio[])
      .filter((studio) => studio.isActive !== false)
      .slice(0, 6);
  } catch {
    error = true;
  }

  return (
    <section
      id="featured-studios"
      className="bg-[#F8F7F4] px-5 py-20 sm:px-8 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#F16F50]" />

              <p className="text-xs font-bold uppercase tracking-[4px] text-[#F16F50]">
                Handpicked Creative Spaces
              </p>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-[#202729] sm:text-5xl lg:text-6xl">
              Spaces worth
              <span className="block text-[#F16F50]">
                discovering.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#777D7D] sm:text-lg">
              Explore some of the best creative spaces available
              for your next photography session, film production,
              podcast or music project.
            </p>
          </div>

          <Link
            href="/studios"
            className="group inline-flex w-fit items-center gap-3 border-b border-[#202729]/30 pb-2 text-sm font-bold text-[#202729] transition-colors hover:border-[#F16F50] hover:text-[#F16F50]"
          >
            View All Studios

            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-bold text-[#202729]">
              Unable to load featured studios
            </h3>

            <p className="mt-3 text-sm text-[#929797]">
              Please try again later.
            </p>
          </div>
        ) : studios.length > 0 ? (
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard
                key={studio._id}
                studio={studio}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#DAD6CF] bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-bold text-[#202729]">
              No featured studios available
            </h3>

            <p className="mt-3 text-sm text-[#929797]">
              New creative spaces will appear here soon.
            </p>

            <Link
              href="/studios"
              className="mt-6 inline-flex rounded-xl bg-[#F16F50] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#DF5D40]"
            >
              Explore All Studios
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
