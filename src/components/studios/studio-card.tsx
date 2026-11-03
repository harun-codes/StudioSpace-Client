
import Link from "next/link";
import { MapPin, Star, ArrowUpRight } from "lucide-react";

export type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  isActive?: boolean;
  createdAt?: string | { $date?: string };
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function StudioCard({ studio }: { studio: Studio }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#EAE7E2] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#F16F50]/50 hover:shadow-xl hover:shadow-black/[0.06] dark:border-[#374347] dark:bg-[#1C2629] dark:hover:border-[#F16F50]/60 dark:hover:shadow-black/30">
      <Link
        href={`/studios/${studio._id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#EDEAE5] dark:bg-[#233034]"
      >
        {studio.imageUrl ? (
          <img
            src={studio.imageUrl}
            alt={studio.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#929797] dark:text-[#B5BDBA]">
            Image unavailable
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#202729] shadow-sm dark:bg-[#1C2629]/95 dark:text-[#E6E8E8]">
          {studio.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/studios/${studio._id}`}>
            <h3 className="text-lg font-bold text-[#202729] transition-colors hover:text-[#F16F50] dark:text-[#E6E8E8]">
              {studio.title}
            </h3>
          </Link>

          <div className="flex shrink-0 items-center gap-1 text-sm font-bold text-[#202729] dark:text-[#E6E8E8]">
            <Star
              size={15}
              className="fill-[#F5A623] text-[#F5A623]"
            />
            {typeof studio.rating === "number"
              ? studio.rating.toFixed(1)
              : "New"}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-[#777D7D] dark:text-[#B5BDBA]">
          <MapPin size={16} className="shrink-0 text-[#F16F50]" />
          <span className="line-clamp-1">{studio.location}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#EEECE8] pt-5 dark:border-[#374347]">
          <div>
            <p className="text-xs text-[#929797] dark:text-[#A0AAA8]">
              Hourly rate
            </p>

            <p className="mt-1 text-xl font-extrabold text-[#202729] dark:text-[#E6E8E8]">
              {formatPrice(studio.hourlyRate)}
              <span className="ml-1 text-sm font-medium text-[#929797] dark:text-[#A0AAA8]">
                / hr
              </span>
            </p>

            <p className="mt-1 text-xs text-[#929797] dark:text-[#A0AAA8]">
              {studio.reviewCount ?? 0} reviews
            </p>
          </div>

          <Link
            href={`/studios/${studio._id}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#202729] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#F16F50] dark:bg-[#E6E8E8] dark:text-[#202729] dark:hover:bg-[#F16F50] dark:hover:text-white"
          >
            View Details
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
