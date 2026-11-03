
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Building2,
  CalendarCheck2,
  Clock3,
  CalendarX2,
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";

type Booking = {
  _id: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
};

type DashboardStats = {
  totalStudios: number;
  totalBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
};

const panelClass =
  "rounded-2xl border border-[#EAE7E2] bg-white shadow-sm dark:border-[#374347] dark:bg-[#1C2629]";

const mutedClass =
  "text-[#777D7D] dark:text-[#B5BDBA]";

function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[#F5F3EE] px-4 py-8 dark:bg-[#12191C] sm:px-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-[1150px] animate-pulse">
        <div className="mb-10 space-y-4">
          <div className="h-4 w-44 rounded-full bg-[#EAE7E2] dark:bg-[#374347]" />

          <div className="h-10 w-64 max-w-full rounded-xl bg-[#EAE7E2] dark:bg-[#374347] sm:w-80" />

          <div className="h-4 w-full max-w-lg rounded-full bg-[#EAE7E2] dark:bg-[#374347]" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className={`${panelClass} space-y-5 p-5 sm:p-6`}
            >
              <div className="h-12 w-12 rounded-xl bg-[#EAE7E2] dark:bg-[#374347]" />

              <div className="h-4 w-32 rounded-full bg-[#EAE7E2] dark:bg-[#374347]" />

              <div className="h-10 w-20 rounded-xl bg-[#EAE7E2] dark:bg-[#374347]" />
            </div>
          ))}
        </div>

        <div className={`mt-8 p-5 sm:mt-10 sm:p-8 ${panelClass}`}>
          <div className="h-6 w-36 rounded-lg bg-[#EAE7E2] dark:bg-[#374347]" />

          <div className="mt-4 h-4 w-64 max-w-full rounded-full bg-[#EAE7E2] dark:bg-[#374347]" />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl bg-[#F8F7F4] p-5 dark:bg-[#233034]"
              >
                <div className="h-11 w-11 shrink-0 rounded-xl bg-[#EAE7E2] dark:bg-[#374347]" />

                <div className="flex-1 space-y-3">
                  <div className="h-4 w-32 rounded-full bg-[#EAE7E2] dark:bg-[#374347]" />

                  <div className="h-3 w-40 max-w-full rounded-full bg-[#EAE7E2] dark:bg-[#374347]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  const userEmail = session?.user?.email?.trim().toLowerCase();

  const [stats, setStats] = useState<DashboardStats>({
    totalStudios: 0,
    totalBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [loadedEmail, setLoadedEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending || !userEmail) return;

    const controller = new AbortController();

    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [studiosResponse, bookingsResponse] =
          await Promise.all([
            apiClient(
              `/my-listings?ownerEmail=${encodeURIComponent(userEmail)}`,
              {
                signal: controller.signal,
                cache: "no-store",
              }
            ),
            apiClient(
              `/my-bookings?userEmail=${encodeURIComponent(userEmail)}`,
              {
                signal: controller.signal,
                cache: "no-store",
              }
            ),
          ]);

        if (!studiosResponse.ok || !bookingsResponse.ok) {
          throw new Error("Failed to load dashboard data.");
        }

        const [studios, bookings]: [unknown, Booking[]] =
          await Promise.all([
            studiosResponse.json(),
            bookingsResponse.json(),
          ]);

        if (!Array.isArray(studios) || !Array.isArray(bookings)) {
          throw new Error("Invalid dashboard data.");
        }

        if (!controller.signal.aborted) {
          setStats({
            totalStudios: studios.length,
            totalBookings: bookings.length,
            pendingBookings: bookings.filter(
              (booking) => booking.status === "Pending"
            ).length,
            cancelledBookings: bookings.filter(
              (booking) => booking.status === "Cancelled"
            ).length,
          });
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Unable to load your dashboard.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadedEmail(userEmail);
          setLoading(false);
        }
      }
    };

    void fetchDashboard();

    return () => controller.abort();
  }, [userEmail, isPending]);

  const statCards = [
    {
      label: "My Studios",
      value: stats.totalStudios,
      icon: Building2,
      background: "bg-[#FFF0EB] dark:bg-[#F16F50]/15",
      color: "text-[#F16F50]",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: CalendarCheck2,
      background: "bg-[#EAF3FF] dark:bg-blue-500/15",
      color: "text-[#3478CB] dark:text-blue-400",
    },
    {
      label: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Clock3,
      background: "bg-[#FFF5DF] dark:bg-amber-500/15",
      color: "text-[#D59A24] dark:text-amber-400",
    },
    {
      label: "Cancelled Bookings",
      value: stats.cancelledBookings,
      icon: CalendarX2,
      background: "bg-[#FDECEC] dark:bg-red-500/15",
      color: "text-[#D85A5A] dark:text-red-400",
    },
  ];

  const isPageLoading =
    isPending ||
    (Boolean(userEmail) &&
      (loading || loadedEmail !== userEmail));

  if (isPageLoading) {
    return <DashboardLoading />;
  }

  if (!userEmail) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F5F3EE] px-4 py-12 transition-colors duration-300 dark:bg-[#12191C] sm:px-8">
        <div className={`mx-auto w-full max-w-xl p-6 text-center sm:p-10 ${panelClass}`}>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F16F50]/10">
            <LayoutDashboard
              size={42}
              className="text-[#F16F50]"
            />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-[#202729] dark:text-white">
            Login to View Dashboard
          </h1>

          <p className={`mx-auto mt-3 max-w-sm text-sm leading-7 ${mutedClass}`}>
            Please sign in to access your studio dashboard
            and manage your creative workspaces.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#F16F50] px-7 text-sm font-semibold text-white transition hover:bg-[#DF5D40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16F50]"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F3EE] px-4 py-8 transition-colors duration-300 dark:bg-[#12191C] sm:px-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-[1150px]">
        <div className="mb-8 sm:mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 shrink-0 bg-[#F16F50]" />

            <p className="text-xs font-bold uppercase tracking-[2px] text-[#F16F50] sm:tracking-[3px]">
              StudioSpace Dashboard
            </p>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#202729] dark:text-white sm:text-4xl lg:text-5xl">
            Dashboard
            <span className="text-[#F16F50]"> Overview.</span>
          </h1>

          <p className={`mt-3 max-w-2xl text-sm leading-7 ${mutedClass} sm:text-base`}>
            Welcome back, {session?.user?.name || "Creator"}.
            Manage your studios and track your reservations
            in one place.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-5 py-12 text-center dark:border-red-900/50 dark:bg-[#1C2629] sm:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400">
              <LayoutDashboard size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-red-600 dark:text-red-400">
              Unable to Load Dashboard
            </h2>

            <p className={`mt-3 text-sm leading-7 ${mutedClass}`}>
              {error}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="group rounded-2xl border border-[#EAE7E2] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-[#374347] dark:bg-[#1C2629] dark:hover:border-[#465457] sm:p-6"
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.background}`}
                    >
                      <Icon
                        size={23}
                        className={card.color}
                      />
                    </div>

                    <p className={`mt-6 text-sm font-medium ${mutedClass}`}>
                      {card.label}
                    </p>

                    <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-[#202729] dark:text-white">
                      {card.value}
                    </h2>
                  </div>
                );
              })}
            </div>

            <div className={`mt-8 p-5 sm:mt-10 sm:p-8 ${panelClass}`}>
              <div>
                <h2 className="text-xl font-extrabold text-[#202729] dark:text-white sm:text-2xl">
                  Quick Actions
                </h2>

                <p className={`mt-2 text-sm leading-6 ${mutedClass}`}>
                  Access your studios and reservations easily.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  href="/my-listings"
                  className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#EAE7E2] bg-[#FAF9F7] p-4 transition-all duration-300 hover:border-[#F16F50] hover:bg-[#FFF8F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16F50] dark:border-[#374347] dark:bg-[#233034] dark:hover:border-[#F16F50] dark:hover:bg-[#29383A] sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EB] text-[#F16F50] dark:bg-[#F16F50]/15">
                      <Building2 size={21} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#202729] dark:text-white">
                        My Studio Listings
                      </h3>

                      <p className={`mt-1 text-xs leading-5 ${mutedClass}`}>
                        View and manage your studios
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="shrink-0 text-[#929797] transition-colors group-hover:text-[#F16F50] dark:text-[#8B9694]"
                  />
                </Link>

                <Link
                  href="/my-bookings"
                  className="group flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[#EAE7E2] bg-[#FAF9F7] p-4 transition-all duration-300 hover:border-[#F16F50] hover:bg-[#FFF8F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16F50] dark:border-[#374347] dark:bg-[#233034] dark:hover:border-[#F16F50] dark:hover:bg-[#29383A] sm:p-5"
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EB] text-[#F16F50] dark:bg-[#F16F50]/15">
                      <CalendarCheck2 size={21} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#202729] dark:text-white">
                        My Bookings
                      </h3>

                      <p className={`mt-1 text-xs leading-5 ${mutedClass}`}>
                        View your studio reservations
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight
                    size={19}
                    className="shrink-0 text-[#929797] transition-colors group-hover:text-[#F16F50] dark:text-[#8B9694]"
                  />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
