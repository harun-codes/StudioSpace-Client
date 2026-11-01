
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
    <div className="space-y-10">
      <section className="rounded-2xl border border-[#EAE7E2] bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold text-[#202729]">
          About This Studio
        </h2>

        <p className="mt-5 whitespace-pre-line text-base leading-8 text-[#727A77]">
          {studio.overview || "No studio description available."}
        </p>
      </section>

      <section className="rounded-2xl border border-[#EAE7E2] bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold text-[#202729]">
          Studio Specifications
        </h2>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl bg-[#F8F7F4] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#F16F50]">
              <Users size={22} />
            </div>

            <div>
              <p className="text-xs text-[#929797]">
                Maximum Capacity
              </p>

              <p className="mt-1 font-bold text-[#202729]">
                {studio.maxCapacity
                  ? `${studio.maxCapacity} Guests`
                  : "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-[#F8F7F4] p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#F16F50]">
              <ShieldCheck size={22} />
            </div>

            <div>
              <p className="text-xs text-[#929797]">
                Security Deposit
              </p>

              <p className="mt-1 font-bold text-[#202729]">
                ${studio.securityDeposit ?? 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl bg-[#F8F7F4] p-5 sm:col-span-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#F16F50]">
              <MapPin size={22} />
            </div>

            <div>
              <p className="text-xs text-[#929797]">
                Studio Location
              </p>

              <p className="mt-1 font-bold text-[#202729]">
                {studio.location}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#EAE7E2] bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold text-[#202729]">
          Amenities & Equipment
        </h2>

        {amenities.length > 0 ? (
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F16F50]/10 text-[#F16F50]">
                  <Check size={18} />
                </span>

                <span className="text-sm font-medium text-[#202729]">
                  {amenity}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-[#727A77]">
            No amenities listed.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-[#EAE7E2] bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold text-[#202729]">
          Meet Your Host
        </h2>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#F16F50]/10 text-[#F16F50]">
            <UserRound size={28} />
          </div>

          <div>
            <p className="text-lg font-bold text-[#202729]">
              {studio.ownerName || "Studio Host"}
            </p>

            <p className="mt-1 text-sm text-[#727A77]">
              StudioSpace Host
            </p>
          </div>
        </div>

        {studio.ownerEmail && (
          <div className="mt-6 flex items-center gap-3 border-t border-[#EAE7E2] pt-5 text-sm text-[#727A77]">
            <Mail size={18} className="shrink-0 text-[#F16F50]" />
            <span className="break-all">{studio.ownerEmail}</span>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#EAE7E2] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold text-[#202729]">
            Guest Reviews
          </h2>

          <div className="flex items-center gap-2 text-sm font-bold text-[#202729]">
            <Star
              size={18}
              className="fill-[#F5A623] text-[#F5A623]"
            />
            {studio.rating?.toFixed(1) ?? "New"}
            <span className="font-normal text-[#929797]">
              ({studio.reviewCount ?? reviews.length} reviews)
            </span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-7 space-y-5">
            {reviews.map((review, index) => (
              <div
                key={`${review.reviewerName}-${index}`}
                className="rounded-xl bg-[#F8F7F4] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-bold text-[#202729]">
                    {review.reviewerName}
                  </p>

                  <span className="flex items-center gap-1 text-sm font-semibold text-[#202729]">
                    <Star
                      size={15}
                      className="fill-[#F5A623] text-[#F5A623]"
                    />
                    {review.rating.toFixed(1)}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-[#727A77]">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-sm text-[#727A77]">
            No reviews have been added yet.
          </p>
        )}
      </section>
    </div>
  );
}
