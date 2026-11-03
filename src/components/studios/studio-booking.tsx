
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
      <aside className="w-full min-w-0 rounded-2xl border border-[#EAE7E2] bg-white p-5 shadow-sm transition-colors duration-300 dark:border-[#374347] dark:bg-[#1C2629] sm:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[3px] text-[#F16F50] sm:tracking-[4px]">
            Your Creative Session
          </p>

          <div className="mt-5 flex flex-wrap items-end gap-2 sm:mt-6">
            <h3 className="text-3xl font-extrabold tracking-tight text-[#202729] dark:text-white sm:text-4xl">
              {formatPrice(hourlyRate)}
            </h3>

            <span className="mb-1 text-sm text-[#929797] dark:text-[#A1AAAA] sm:text-base">
              / hour
            </span>
          </div>
        </div>

        <div className="my-6 border-t border-[#EEECE8] dark:border-[#374347] sm:my-7" />

        <div className="space-y-5 sm:space-y-6">
          <div className="flex items-center gap-4">
            <CalendarDays
              size={23}
              className="shrink-0 text-[#F16F50]"
            />

            <span className="text-sm text-[#777D7D] dark:text-[#B5BDBA] sm:text-base">
              Flexible booking dates
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Clock
              size={23}
              className="shrink-0 text-[#F16F50]"
            />

            <span className="text-sm text-[#777D7D] dark:text-[#B5BDBA] sm:text-base">
              Hourly studio rental
            </span>
          </div>

          {securityDeposit > 0 && (
            <div className="flex items-center gap-4">
              <ShieldCheck
                size={23}
                className="shrink-0 text-[#F16F50]"
              />

              <span className="text-sm leading-6 text-[#777D7D] dark:text-[#B5BDBA] sm:text-base">
                Security deposit: {formatPrice(securityDeposit)}
              </span>
            </div>
          )}
        </div>

        <div className="my-6 border-t border-[#EEECE8] dark:border-[#374347] sm:my-7" />

        <button
          type="button"
          onClick={() => setBookingOpen(true)}
          className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#F16F50] px-4 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#DF5D40] hover:shadow-lg hover:shadow-[#F16F50]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16F50] sm:px-5 sm:py-5"
        >
          Book Workspace Now

          <ArrowUpRight
            size={21}
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </button>

        <p className="mt-5 text-center text-xs leading-6 text-[#929797] dark:text-[#8B9694] sm:text-sm">
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
