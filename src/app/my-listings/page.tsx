
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
    ArrowUpRight,
    Building2,
    Eye,
    MapPin,
    Pencil,
    Plus,
    Trash2,
    Users,
    UserRound,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type Studio = {
    _id: string;
    title: string;
    category: string;
    hourlyRate: number;
    securityDeposit: number;
    maxCapacity: number;
    location: string;
    imageUrl: string;
    overview: string;
    amenities: string[];
    ownerName: string;
    ownerEmail: string;
    isActive?: boolean;
};

export default function MyListingsPage() {
    const { data: session, isPending } = authClient.useSession();

    const userEmail = session?.user?.email?.trim().toLowerCase();

    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isPending) return;

        if (!userEmail) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStudios([]);
            setLoading(false);
            setError("");
            return;
        }

        const controller = new AbortController();

        const loadStudios = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `http://localhost:5000/my-listings?ownerEmail=${encodeURIComponent(userEmail)}`,
                    {
                        cache: "no-store",
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch studio listings.");
                }

                const data: unknown = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid studio data received.");
                }

                if (!controller.signal.aborted) {
                    setStudios(data as Studio[]);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load studios."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void loadStudios();

        return () => controller.abort();
    }, [userEmail, isPending]);

    return (
        <main className="min-h-screen bg-[#F5F3EE] px-4 py-10 sm:px-8 lg:py-14">
            <div className="mx-auto max-w-[1150px]">
                <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-[2px] w-8 bg-[#F16F50]" />

                            <p className="text-xs font-bold uppercase tracking-[3px] text-[#F16F50]">
                                Studio Management
                            </p>
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-[#202729] sm:text-4xl">
                            My Studio
                            <span className="text-[#F16F50]"> Listings.</span>
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-[#777D7D]">
                            View and manage your creative workspaces.
                        </p>
                    </div>

                    <Link
                        href="/add-studio"
                        className={cn(
                            buttonVariants(),
                            "h-11 rounded-xl bg-[#F16F50] px-6 font-semibold text-white hover:bg-[#DF5D40]"
                        )}
                    >
                        <Plus size={18} />
                        Add New Studio
                    </Link>
                </div>

                {!isPending && !loading && !error && userEmail && (
                    <div className="mb-6 inline-flex items-center gap-3 rounded-xl border border-[#EAE7E2] bg-white px-5 py-3">
                        <Building2
                            size={18}
                            className="text-[#F16F50]"
                        />

                        <span className="text-sm font-semibold text-[#202729]">
                            Total Listings: {studios.length}
                        </span>
                    </div>
                )}

                {isPending || loading ? (
                    <Card className="rounded-2xl border-[#EAE7E2] bg-white p-12 text-center">
                        <p className="text-sm text-[#777D7D]">
                            Loading your studio listings...
                        </p>
                    </Card>
                ) : !userEmail ? (
                    <Card className="items-center rounded-2xl border-[#EAE7E2] bg-white px-6 py-14 text-center">
                        <UserRound
                            size={44}
                            className="text-[#F16F50]"
                        />

                        <h2 className="text-xl font-bold text-[#202729]">
                            Login to view your studios
                        </h2>

                        <p className="text-sm text-[#777D7D]">
                            Your studio listings are associated with your account email.
                        </p>
                        <Link
                            href="/login"
                            className={cn(
                                buttonVariants(),
                                "mt-6 bg-[#F16F50] font-semibold text-white hover:bg-[#DF5D40]"
                            )}
                        >
                            Go to Login
                        </Link>
                    </Card>
                ) : error ? (
                    <Card className="rounded-2xl border-red-200 bg-white p-10 text-center">
                        <h2 className="text-lg font-bold text-red-600">
                            Failed to load listings
                        </h2>

                        <p className="text-sm text-[#777D7D]">
                            {error}
                        </p>
                    </Card>
                ) : studios.length === 0 ? (
                    <Card className="items-center rounded-2xl border-[#EAE7E2] bg-white px-6 py-14 text-center">
                        <Building2
                            size={46}
                            className="text-[#F16F50]"
                        />

                        <h2 className="text-xl font-bold text-[#202729]">
                            No studios listed yet
                        </h2>

                        <p className="max-w-md text-sm leading-7 text-[#777D7D]">
                            Create your first studio listing and start sharing
                            your creative space with others.
                        </p>
                        <Link
                            href="/add-studio"
                            className={cn(
                                buttonVariants(),
                                "mt-3 rounded-xl bg-[#F16F50] font-semibold text-white hover:bg-[#DF5D40]"
                            )}
                        >
                            Add Your First Studio
                            <ArrowUpRight size={17} />
                        </Link>                    </Card>
                ) : (
                    <div className="flex flex-col gap-4">
                        {studios.map((studio) => (
                            <Card
                                key={studio._id}
                                className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-[#EAE7E2] bg-white py-0 shadow-sm transition-shadow duration-200 hover:shadow-md sm:min-h-[185px] sm:flex-row"
                            >
                                <div className="relative h-48 w-full shrink-0 bg-[#EAE7E2] sm:h-auto sm:w-48 lg:w-56">
                                    {studio.imageUrl ? (
                                        <Image
                                            src={studio.imageUrl}
                                            alt={studio.title}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 640px) 100vw, 224px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Building2
                                                size={40}
                                                className="text-[#A3A8A5]"
                                            />
                                        </div>
                                    )}
                                </div>

                                <CardContent className="flex min-w-0 flex-1 flex-col justify-center px-5 py-5 sm:px-6">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-[11px] font-bold uppercase tracking-[2px] text-[#F16F50]">
                                            {studio.category}
                                        </span>

                                        <span
                                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${studio.isActive === false
                                                ? "bg-red-50 text-red-600"
                                                : "bg-green-50 text-green-700"
                                                }`}
                                        >
                                            {studio.isActive === false ? "Inactive" : "Active"}
                                        </span>
                                    </div>

                                    <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-7 text-[#202729]">
                                        {studio.title}
                                    </h2>

                                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                                        <div className="flex min-w-0 items-center gap-2 text-sm text-[#777D7D]">
                                            <MapPin
                                                size={15}
                                                className="shrink-0"
                                            />

                                            <span className="line-clamp-1">
                                                {studio.location}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-[#777D7D]">
                                            <Users
                                                size={15}
                                                className="shrink-0"
                                            />

                                            <span>
                                                {studio.maxCapacity} guests
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-2 text-sm text-[#777D7D]">
                                        <UserRound size={15} className="shrink-0" />

                                        <span className="line-clamp-1">
                                            Hosted by {studio.ownerName || "Studio Host"}
                                        </span>
                                    </div>
                                </CardContent>

                                <div className="flex shrink-0 flex-col justify-between gap-5 border-t border-[#EAE7E2] px-5 py-5 sm:w-[250px] sm:border-l sm:border-t-0 sm:items-end sm:px-5">
                                    <div className="sm:text-right">
                                        <p className="text-xs font-medium text-[#929797]">
                                            Hourly Rate
                                        </p>

                                        <p className="mt-1 text-2xl font-extrabold text-[#202729]">
                                            ${studio.hourlyRate}
                                            <span className="ml-1 text-xs font-normal text-[#777D7D]">
                                                / hour
                                            </span>
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled
                                            className="h-9 gap-1 rounded-lg border-[#EAE7E2] px-2.5 text-xs font-semibold text-[#202729]"
                                        >
                                            <Eye size={15} />
                                            View
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled
                                            className="h-9 gap-1 rounded-lg border-[#EAE7E2] px-2.5 text-xs font-semibold text-[#202729]"
                                        >
                                            <Pencil size={15} />
                                            Edit
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled
                                            className="h-9 gap-1 rounded-lg border-red-200 px-2.5 text-xs font-semibold text-red-600"
                                        >
                                            <Trash2 size={15} />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
