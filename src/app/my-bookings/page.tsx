
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    CalendarDays,
    ClipboardList,
    UserRound,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import BookingCard, {
    type Booking,
} from "@/components/bookings/booking-card";

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
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const loadBookings = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `http://localhost:5000/my-bookings?userEmail=${encodeURIComponent(userEmail)}`,
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
        <main className="min-h-screen bg-[#F5F3EE] px-4 py-10 sm:px-8 lg:py-14">
            <div className="mx-auto max-w-[1150px]">

                <div className="mb-10">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-[2px] w-8 bg-[#F16F50]" />

                        <p className="text-xs font-bold uppercase tracking-[3px] text-[#F16F50]">
                            Your Reservations
                        </p>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight text-[#202729] sm:text-4xl">
                        My
                        <span className="text-[#F16F50]"> Bookings.</span>
                    </h1>

                    <p className="mt-3 text-sm leading-7 text-[#777D7D]">
                        View your creative studio reservations and their current status.
                    </p>
                </div>

                {!isPending && !loading && !error && userEmail && (
                    <div className="mb-7 inline-flex items-center gap-3 rounded-xl border border-[#EAE7E2] bg-white px-5 py-3">
                        <ClipboardList
                            size={19}
                            className="text-[#F16F50]"
                        />

                        <span className="text-sm font-semibold text-[#202729]">
                            Total Bookings: {bookings.length}
                        </span>
                    </div>
                )}

                {isPending || loading ? (
                    <div className="rounded-2xl border border-[#EAE7E2] bg-white p-12 text-center">
                        <p className="text-sm text-[#777D7D]">
                            Loading your bookings...
                        </p>
                    </div>
                ) : !userEmail ? (
                    <div className="rounded-2xl border border-[#EAE7E2] bg-white px-6 py-14 text-center">
                        <UserRound
                            size={46}
                            className="mx-auto text-[#F16F50]"
                        />

                        <h2 className="mt-5 text-xl font-bold text-[#202729]">
                            Login to view your bookings
                        </h2>

                        <p className="mt-3 text-sm text-[#777D7D]">
                            Sign in to see your studio reservations.
                        </p>

                        <Link
                            href="/login"
                            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#F16F50] px-6 text-sm font-semibold text-white hover:bg-[#DF5D40]"
                        >
                            Go to Login
                        </Link>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-white p-10 text-center">
                        <h2 className="text-lg font-bold text-red-600">
                            Failed to load bookings
                        </h2>

                        <p className="mt-3 text-sm text-[#777D7D]">
                            {error}
                        </p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="rounded-2xl border border-[#EAE7E2] bg-white px-6 py-16 text-center">
                        <CalendarDays
                            size={48}
                            className="mx-auto text-[#F16F50]"
                        />

                        <h2 className="mt-5 text-xl font-bold text-[#202729]">
                            No bookings yet
                        </h2>

                        <p className="mt-3 text-sm text-[#777D7D]">
                            Your studio bookings will appear here after you make a reservation.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
                        {bookings.map((booking) => (

                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                onCancelled={(bookingId) => {
                                    setBookings((previous) =>
                                        previous.map((item) =>
                                            item._id === bookingId
                                                ? { ...item, status: "Cancelled" as const }
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

