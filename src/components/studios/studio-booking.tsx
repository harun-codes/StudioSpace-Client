
"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

import BookingModal from "@/components/bookings/booking-modal";


type Props = {
  studioId: string;
  studioTitle: string;
  hourlyRate: number;
  securityDeposit?: number;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export default function StudioBooking({
  studioId,
  studioTitle,
  hourlyRate,
  securityDeposit = 0,
}: Props) {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <>
      <aside className="rounded-2xl border border-[#EAE7E2] bg-white p-7 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[4px] text-[#F16F50]">
            Your Creative Session
          </p>

          <div className="mt-6 flex items-end gap-2">
            <h3 className="text-4xl font-extrabold tracking-tight text-[#202729]">
              {formatPrice(hourlyRate)}
            </h3>

            <span className="mb-1 text-base text-[#929797]">
              / hour
            </span>
          </div>
        </div>

        <div className="my-7 border-t border-[#EEECE8]" />

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <CalendarDays
              size={23}
              className="shrink-0 text-[#F16F50]"
            />

            <span className="text-sm text-[#777D7D] sm:text-base">
              Flexible booking dates
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Clock
              size={23}
              className="shrink-0 text-[#F16F50]"
            />

            <span className="text-sm text-[#777D7D] sm:text-base">
              Hourly studio rental
            </span>
          </div>

          {securityDeposit > 0 && (
            <div className="flex items-center gap-4">
              <ShieldCheck
                size={23}
                className="shrink-0 text-[#F16F50]"
              />

              <span className="text-sm text-[#777D7D] sm:text-base">
                Security deposit: {formatPrice(securityDeposit)}
              </span>
            </div>
          )}
        </div>

        <div className="my-7 border-t border-[#EEECE8]" />

        <button
          type="button"
          onClick={() => setBookingOpen(true)}
          className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#F16F50] px-5 py-5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#DF5D40] hover:shadow-lg hover:shadow-[#F16F50]/20"
        >
          Book Workspace Now

          <ArrowUpRight
            size={21}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </button>

        <p className="mt-5 text-center text-sm text-[#929797]">
          Preview your session details before booking.
        </p>
      </aside>

      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        studioTitle={studioTitle}
        hourlyRate={hourlyRate}
        studioId={studioId}
      />
    </>
  );
}
