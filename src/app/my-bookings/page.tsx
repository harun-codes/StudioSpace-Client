
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  CalendarDays,
  ClipboardList,
  UserRound,
  ArrowUpRight,
} from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import BookingCard, {
  type Booking,
} from "@/components/bookings/booking-card";

const panelClass =
  "rounded-2xl border border-[#EAE7E2] bg-white dark:border-[#374347] dark:bg-[#1C2629]";

const mutedClass =
  "text-[#777D7D] dark:text-[#B5BDBA]";

function BookingsLoading() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className={`${panelClass} flex animate-pulse flex-col overflow-hidden sm:flex-row`}
        >
          <div className="h-48 w-full bg-[#EAE7E2] dark:bg-[#293638] sm:h-48 sm:w-52 sm:shrink-0" />

          <div className="flex-1 space-y-4 p-5 sm:p-6">
            <div className="h-4 w-28 rounded bg-[#EAE7E2] dark:bg-[#374347]" />
            <div className="h-6 w-3/4 rounded bg-[#EAE7E2] dark:bg-[#374347]" />
            <div className="h-4 w-1/2 rounded bg-[#EAE7E2] dark:bg-[#374347]" />
            <div className="h-10 w-full rounded bg-[#EAE7E2] dark:bg-[#374347] sm:w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyBookingsPage() {
  const { data: session, isPending } = authClient.useSession();

  const userEmail = session?.user?.email?.trim().toLowerCase();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!userEmail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookings([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const loadBookings = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient(
          `/my-bookings?userEmail=${encodeURIComponent(userEmail)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch bookings."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid booking data received.");
        }

        if (!controller.signal.aborted) {
          setBookings(data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load bookings."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadBookings();

    return () => controller.abort();
  }, [userEmail, isPending]);

  return (
    <main className="min-h-screen bg-[#F5F3EE] px-4 py-8 transition-colors duration-300 dark:bg-[#12191C] sm:px-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-[1150px]">

        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 shrink-0 bg-[#F16F50]" />

              <p className="text-xs font-bold uppercase tracking-[2px] text-[#F16F50] sm:tracking-[3px]">
                Your Reservations
              </p>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#202729] dark:text-white sm:text-4xl lg:text-5xl">
              My
              <span className="text-[#F16F50]"> Bookings.</span>
            </h1>

            <p className={`mt-3 max-w-xl text-sm leading-7 ${mutedClass}`}>
              View your creative studio reservations and their
              current booking status.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F16F50] px-6 text-sm font-semibold text-white transition hover:bg-[#DF5D40] sm:w-auto"
          >
            Explore Studios
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {!isPending && !loading && !error && userEmail && (
          <div className={`mb-7 inline-flex items-center gap-3 px-5 py-3 ${panelClass}`}>
            <ClipboardList
              size={19}
              className="shrink-0 text-[#F16F50]"
            />

            <span className="text-sm font-semibold text-[#202729] dark:text-white">
              Total Bookings: {bookings.length}
            </span>
          </div>
        )}

        {isPending || loading ? (
          <BookingsLoading />
        ) : !userEmail ? (
          <div className={`${panelClass} px-5 py-12 text-center sm:px-8 sm:py-16`}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F16F50]/10">
              <UserRound
                size={40}
                className="text-[#F16F50]"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#202729] dark:text-white">
              Login to View Your Bookings
            </h2>

            <p className={`mx-auto mt-3 max-w-md text-sm leading-7 ${mutedClass}`}>
              Sign in to see your studio reservations and
              manage your upcoming creative sessions.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#F16F50] px-6 text-sm font-semibold text-white transition hover:bg-[#DF5D40]"
            >
              Go to Login
            </Link>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-5 py-12 text-center dark:border-red-900/50 dark:bg-[#1C2629] sm:px-8">
            <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
              Failed to Load Bookings
            </h2>

            <p className={`mt-3 text-sm leading-7 ${mutedClass}`}>
              {error}
            </p>
          </div>
        ) : bookings.length === 0 ? (
          <div className={`${panelClass} px-5 py-12 text-center sm:px-8 sm:py-16`}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F16F50]/10">
              <CalendarDays
                size={42}
                className="text-[#F16F50]"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#202729] dark:text-white">
              No Bookings Yet
            </h2>

            <p className={`mx-auto mt-3 max-w-md text-sm leading-7 ${mutedClass}`}>
              Your studio bookings will appear here after
              you make a reservation.
            </p>

            <Link
              href="/studios"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F16F50] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#DF5D40]"
            >
              Discover Studios
              <ArrowUpRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-5">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancelled={(bookingId) => {
                  setBookings((previous) =>
                    previous.map((item) =>
                      item._id === bookingId
                        ? {
                            ...item,
                            status: "Cancelled" as const,
                          }
                        : item
                    )
                  );
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
