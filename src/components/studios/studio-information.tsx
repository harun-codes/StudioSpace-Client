
import {
  Users,
  ShieldCheck,
  MapPin,
  Check,
  UserRound,
  Star,
  Mail,
} from "lucide-react";

import type { Studio } from "@/components/studios/studio-card";

export type StudioReview = {
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt?: string | { $date?: string };
};

export type StudioDetails = Studio & {
  securityDeposit?: number;
  maxCapacity?: number;
  overview?: string;
  galleryImages?: string[];
  amenities?: string[];
  ownerName?: string;
  ownerEmail?: string;
  reviews?: StudioReview[];
};

type Props = {
  studio: StudioDetails;
};

export default function StudioInformation({ studio }: Props) {
  const amenities = studio.amenities ?? [];
  const reviews = studio.reviews ?? [];

  return (
    <div className="min-w-0 space-y-7 sm:space-y-10">
      <section className="rounded-2xl border border-[#EAE7E2] bg-white p-5 transition-colors duration-300 dark:border-[#374347] dark:bg-[#1C2629] sm:p-8">
        <h2 className="text-xl font-extrabold text-[#202729] dark:text-white sm:text-2xl">
          About This Studio
        </h2>

        <p className="mt-5 whitespace-pre-line break-words text-sm leading-8 text-[#727A77] dark:text-[#B5BDBA] sm:text-base">
          {studio.overview || "No studio description available."}
        </p>
      </section>

      <section className="rounded-2xl border border-[#EAE7E2] bg-white p-5 transition-colors duration-300 dark:border-[#374347] dark:bg-[#1C2629] sm:p-8">
        <h2 className="text-xl font-extrabold text-[#202729] dark:text-white sm:text-2xl">
          Studio Specifications
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4">
          <div className="flex min-w-0 items-center gap-3 rounded-xl bg-[#F8F7F4] p-4 dark:bg-[#233034] sm:gap-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#F16F50] dark:bg-[#1C2629]">
              <Users size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-[#929797] dark:text-[#8B9694]">
                Maximum Capacity
              </p>

              <p className="mt-1 break-words text-sm font-bold text-[#202729] dark:text-[#E6E8E8] sm:text-base">
                {studio.maxCapacity
                  ? `${studio.maxCapacity} Guests`
                  : "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-xl bg-[#F8F7F4] p-4 dark:bg-[#233034] sm:gap-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#F16F50] dark:bg-[#1C2629]">
              <ShieldCheck size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-[#929797] dark:text-[#8B9694]">
                Security Deposit
              </p>

              <p className="mt-1 font-bold text-[#202729] dark:text-[#E6E8E8]">
                ${studio.securityDeposit ?? 0}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 rounded-xl bg-[#F8F7F4] p-4 dark:bg-[#233034] sm:col-span-2 sm:gap-4 sm:p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#F16F50] dark:bg-[#1C2629]">
              <MapPin size={22} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-[#929797] dark:text-[#8B9694]">
                Studio Location
              </p>

              <p className="mt-1 break-words text-sm font-bold text-[#202729] dark:text-[#E6E8E8] sm:text-base">
                {studio.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#EAE7E2] bg-white p-5 transition-colors duration-300 dark:border-[#374347] dark:bg-[#1C2629] sm:p-8">
        <h2 className="text-xl font-extrabold text-[#202729] dark:text-white sm:text-2xl">
          Amenities & Equipment
        </h2>

        {amenities.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-7 sm:grid-cols-2">
            {amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex min-w-0 items-center gap-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F16F50]/10 text-[#F16F50]">
                  <Check size={18} />
                </span>

                <span className="break-words text-sm font-medium text-[#202729] dark:text-[#E6E8E8]">
                  {amenity}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-[#727A77] dark:text-[#B5BDBA]">
            No amenities listed.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-[#EAE7E2] bg-white p-5 transition-colors duration-300 dark:border-[#374347] dark:bg-[#1C2629] sm:p-8">
        <h2 className="text-xl font-extrabold text-[#202729] dark:text-white sm:text-2xl">
          Meet Your Host
        </h2>

        <div className="mt-6 flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F16F50]/10 text-[#F16F50] sm:h-16 sm:w-16">
            <UserRound size={28} />
          </div>

          <div className="min-w-0">
            <p className="break-words text-lg font-bold text-[#202729] dark:text-[#E6E8E8]">
              {studio.ownerName || "Studio Host"}
            </p>

            <p className="mt-1 text-sm text-[#727A77] dark:text-[#B5BDBA]">
              StudioSpace Host
            </p>
          </div>
        </div>

        {studio.ownerEmail && (
          <div className="mt-6 flex min-w-0 items-start gap-3 border-t border-[#EAE7E2] pt-5 text-sm text-[#727A77] dark:border-[#374347] dark:text-[#B5BDBA]">
            <Mail size={18} className="mt-0.5 shrink-0 text-[#F16F50]" />
            <span className="break-all">{studio.ownerEmail}</span>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#EAE7E2] bg-white p-5 transition-colors duration-300 dark:border-[#374347] dark:bg-[#1C2629] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-[#202729] dark:text-white sm:text-2xl">
            Guest Reviews
          </h2>

          <div className="flex shrink-0 items-center gap-2 text-sm font-bold text-[#202729] dark:text-[#E6E8E8]">
            <Star
              size={18}
              className="fill-[#F5A623] text-[#F5A623]"
            />

            {studio.rating?.toFixed(1) ?? "New"}

            <span className="font-normal text-[#929797] dark:text-[#8B9694]">
              ({studio.reviewCount ?? reviews.length} reviews)
            </span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-6 space-y-4 sm:mt-7 sm:space-y-5">
            {reviews.map((review, index) => (
              <div
                key={`${review.reviewerName}-${index}`}
                className="rounded-xl bg-[#F8F7F4] p-4 dark:bg-[#233034] sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="break-words font-bold text-[#202729] dark:text-[#E6E8E8]">
                    {review.reviewerName}
                  </p>

                  <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#202729] dark:text-[#E6E8E8]">
                    <Star
                      size={15}
                      className="fill-[#F5A623] text-[#F5A623]"
                    />
                    {review.rating.toFixed(1)}
                  </span>
                </div>

                <p className="mt-3 break-words text-sm leading-7 text-[#727A77] dark:text-[#B5BDBA]">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-[#727A77] dark:text-[#B5BDBA]">
            No reviews have been added yet.
          </p>
        )}
      </section>
    </div>
  );
}
