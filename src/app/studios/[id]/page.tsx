
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
    ArrowLeft,
    MapPin,
    Star,
} from "lucide-react";

import StudioGallery from "@/components/studios/studio-gallery";
import StudioInformation, {
    type StudioDetails,
} from "@/components/studios/studio-information";
import StudioBooking from "@/components/studios/studio-booking";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

function StudioError() {
    return (
        <div className="mx-auto max-w-[1440px] px-5 py-24 text-center">
            <h2 className="text-2xl font-extrabold text-[#202729]">
                Unable to Load Studio
            </h2>

            <p className="mt-4 text-[#727A77]">
                Please check your backend connection and try again.
            </p>

            <Link
                href="/studios"
                className="mt-6 inline-flex rounded-xl bg-[#F16F50] px-6 py-3 text-sm font-bold text-white"
            >
                Back to Studios
            </Link>
        </div>
    );
}

async function StudioDetailsContent({ params }: Props) {
    const { id } = await params;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
        notFound();
    }

    let response: Response;

    try {
        response = await fetch(
            `http://localhost:5000/studios/${id}`,
            {
                cache: "no-store",
            }
        );
    } catch {
        return <StudioError />;
    }

    if (response.status === 404) {
        notFound();
    }

    if (!response.ok) {
        return <StudioError />;
    }

    let data: unknown;

    try {
        data = await response.json();
    } catch {
        return <StudioError />;
    }

    if (
        !data ||
        typeof data !== "object" ||
        !("_id" in data) ||
        !("title" in data)
    ) {
        return <StudioError />;
    }

    const studio = data as StudioDetails;

    return (
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
            <Link
                href="/studios"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#727A77] transition hover:text-[#F16F50]"
            >
                <ArrowLeft size={17} />
                Back to Explore Studios
            </Link>

            <div className="mb-10 mt-8">
                <span className="inline-flex rounded-full bg-[#F16F50]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#F16F50]">
                    {studio.category}
                </span>

                <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-[#202729] sm:text-4xl lg:text-5xl">
                    {studio.title}
                </h1>

                <div className="mt-5 flex flex-wrap items-center gap-5">
                    <div className="flex items-center gap-2 text-sm text-[#727A77]">
                        <MapPin size={18} className="text-[#F16F50]" />
                        {studio.location}
                    </div>

                    <div className="flex items-center gap-2 text-sm font-semibold text-[#202729]">
                        <Star
                            size={18}
                            className="fill-[#F5A623] text-[#F5A623]"
                        />

                        {studio.rating?.toFixed(1) ?? "New"}

                        <span className="font-normal text-[#929797]">
                            ({studio.reviewCount ?? 0} reviews)
                        </span>
                    </div>
                </div>
            </div>

            <StudioGallery
                title={studio.title}
                imageUrl={studio.imageUrl}
                galleryImages={studio.galleryImages}
            />

            <div className="mt-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                <section>
                    <StudioInformation studio={studio} />
                </section>

                <div className="lg:sticky lg:top-28">
                    <StudioBooking
                        hourlyRate={studio.hourlyRate}
                        securityDeposit={studio.securityDeposit ?? 0}
                    />
                </div>
            </div>
        </div>
    );
}

function StudioDetailsLoading() {
    return (
        <div className="mx-auto max-w-[1440px] animate-pulse px-5 py-12 sm:px-8 lg:px-12">
            <div className="h-5 w-36 rounded bg-[#EAE7E2]" />

            <div className="mt-10 h-12 max-w-2xl rounded bg-[#EAE7E2]" />

            <div className="mt-6 h-5 w-72 rounded bg-[#EAE7E2]" />

            <div className="mt-10 aspect-[16/9] rounded-2xl bg-[#EAE7E2]" />

            <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="h-72 rounded-2xl bg-[#EAE7E2]" />

                <div className="h-80 rounded-2xl bg-[#EAE7E2]" />
            </div>
        </div>
    );
}

export default function StudioDetailsPage({ params }: Props) {
    return (
        <main className="min-h-screen bg-[#F8F7F4]">
            <Suspense fallback={<StudioDetailsLoading />}>
                <StudioDetailsContent params={params} />
            </Suspense>
        </main>
    );
}
