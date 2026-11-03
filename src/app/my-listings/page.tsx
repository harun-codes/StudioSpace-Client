
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  ArrowUpRight,
  Building2,
  Eye,
  MapPin,
  Plus,
  SquarePen,
  Users,
  UserRound,
} from "lucide-react";

import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import UpdateEdit from "@/components/studios/update-edit";
import DeleteStudio from "@/components/studios/delete-studio";

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

const panelClass =
  "rounded-2xl border border-[#EAE7E2] bg-white dark:border-[#374347] dark:bg-[#1C2629]";

const mutedClass =
  "text-[#777D7D] dark:text-[#B5BDBA]";

export default function MyListingsPage() {
  const router = useRouter();

  const { data: session, isPending } =
    authClient.useSession();

  const userEmail =
    session?.user?.email?.trim().toLowerCase();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedEmail, setLoadedEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!userEmail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStudios([]);
      setLoading(false);
      setLoadedEmail("");
      return;
    }

    const controller = new AbortController();

    const loadStudios = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient(
          `/my-listings?ownerEmail=${encodeURIComponent(userEmail)}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please login again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "You are not authorized to view these listings."
          );
        }

        if (!response.ok) {
          throw new Error(
            "Failed to fetch studio listings."
          );
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid studio data received."
          );
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
          setLoadedEmail(userEmail);
          setLoading(false);
        }
      }
    };

    void loadStudios();

    return () => controller.abort();
  }, [userEmail, isPending]);

  const handleStudioUpdated = (
    updatedStudio: Studio
  ) => {
    setStudios((previous) =>
      previous.map((studio) =>
        studio._id === updatedStudio._id
          ? { ...studio, ...updatedStudio }
          : studio
      )
    );
  };

  const handleStudioDeleted = (
    deletedId: string
  ) => {
    setStudios((previous) =>
      previous.filter(
        (studio) => studio._id !== deletedId
      )
    );
  };

  const isPageLoading =
    isPending ||
    (Boolean(userEmail) &&
      (loading || loadedEmail !== userEmail));

  return (
    <main className="min-h-screen bg-[#F5F3EE] px-4 py-8 transition-colors duration-300 dark:bg-[#12191C] sm:px-8 sm:py-10 lg:py-14">
      <div className="mx-auto max-w-[1150px]">
        <div className="mb-8 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-8 shrink-0 bg-[#F16F50]" />

              <p className="text-xs font-bold uppercase tracking-[2px] text-[#F16F50] sm:tracking-[3px]">
                Studio Management
              </p>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#202729] dark:text-white sm:text-4xl">
              My Studio
              <span className="text-[#F16F50]">
                {" "}Listings.
              </span>
            </h1>

            <p className={`mt-3 text-sm leading-6 ${mutedClass}`}>
              View, edit and manage your creative workspaces.
            </p>
          </div>

          <Link
            href="/add-studio"
            className={cn(
              buttonVariants(),
              "h-11 w-full shrink-0 justify-center gap-2 rounded-xl bg-[#F16F50] px-6 font-semibold text-white transition-colors hover:bg-[#DF5D40] sm:w-auto"
            )}
          >
            <Plus size={18} />
            Add New Studio
          </Link>
        </div>

        {!isPageLoading &&
          !error &&
          userEmail && (
            <div className={`mb-6 inline-flex items-center gap-3 px-5 py-3 ${panelClass}`}>
              <Building2
                size={18}
                className="shrink-0 text-[#F16F50]"
              />

              <span className="text-sm font-semibold text-[#202729] dark:text-[#E6E8E8]">
                Total Listings: {studios.length}
              </span>
            </div>
          )}

        {isPageLoading ? (
          <Card
            role="status"
            className={`${panelClass} items-center gap-4 px-5 py-14 text-center sm:py-16`}
          >
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F16F50]/20 border-t-[#F16F50]" />

            <p className={`text-sm ${mutedClass}`}>
              Loading your studio listings...
            </p>
          </Card>
        ) : !userEmail ? (
          <Card className={`${panelClass} items-center gap-4 px-5 py-12 text-center sm:px-8 sm:py-14`}>
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F16F50]/10">
              <UserRound
                size={40}
                className="text-[#F16F50]"
              />
            </div>

            <h2 className="text-xl font-bold text-[#202729] dark:text-white">
              Login to view your studios
            </h2>

            <p className={`max-w-md text-sm leading-7 ${mutedClass}`}>
              Your studio listings are associated
              with your account email.
            </p>

            <Link
              href="/login"
              className={cn(
                buttonVariants(),
                "mt-3 rounded-xl bg-[#F16F50] px-6 font-semibold text-white hover:bg-[#DF5D40]"
              )}
            >
              Go to Login
            </Link>
          </Card>
        ) : error ? (
          <Card className="items-center gap-3 rounded-2xl border border-red-200 bg-white px-5 py-12 text-center dark:border-red-900/50 dark:bg-[#1C2629] sm:px-8">
            <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
              Failed to load listings
            </h2>

            <p className={`max-w-md text-sm leading-7 ${mutedClass}`}>
              {error}
            </p>

            <Button
              type="button"
              onClick={() => router.refresh()}
              className="mt-2 rounded-xl bg-[#F16F50] text-white hover:bg-[#DF5D40]"
            >
              Try Again
            </Button>
          </Card>
        ) : studios.length === 0 ? (
          <Card className={`${panelClass} items-center gap-4 px-5 py-12 text-center sm:px-8 sm:py-14`}>
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#F16F50]/10">
              <Building2
                size={42}
                className="text-[#F16F50]"
              />
            </div>

            <h2 className="text-xl font-bold text-[#202729] dark:text-white">
              No studios listed yet
            </h2>

            <p className={`max-w-md text-sm leading-7 ${mutedClass}`}>
              Create your first studio listing and
              start sharing your creative space with others.
            </p>

            <Link
              href="/add-studio"
              className={cn(
                buttonVariants(),
                "mt-3 gap-2 rounded-xl bg-[#F16F50] px-6 font-semibold text-white hover:bg-[#DF5D40]"
              )}
            >
              Add Your First Studio
              <ArrowUpRight size={17} />
            </Link>
          </Card>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-5">
            {studios.map((studio) => (
              <Card
                key={studio._id}
                className="flex flex-col gap-0 overflow-hidden rounded-2xl border border-[#EAE7E2] bg-white py-0 shadow-sm transition-all duration-200 hover:shadow-md dark:border-[#374347] dark:bg-[#1C2629] dark:hover:border-[#465457] md:flex-row"
              >
                <div className="relative h-48 w-full shrink-0 bg-[#EAE7E2] dark:bg-[#263437] sm:h-56 md:h-auto md:w-48 lg:w-52 xl:w-56">
                  {studio.imageUrl ? (
                    <Image
                      src={studio.imageUrl}
                      alt={studio.title}
                      fill
                      unoptimized
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 192px, (max-width: 1279px) 208px, 224px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2
                        size={40}
                        className="text-[#A3A8A5] dark:text-[#7F8D8D]"
                      />
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col lg:flex-row">
                  <CardContent className="flex min-w-0 flex-1 flex-col justify-center px-4 py-5 sm:px-6 sm:py-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#F16F50] sm:tracking-[2px]">
                        {studio.category}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          studio.isActive === false
                            ? "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                            : "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                        }`}
                      >
                        {studio.isActive === false
                          ? "Inactive"
                          : "Active"}
                      </span>
                    </div>

                    <h2 className="mt-3 line-clamp-2 break-words text-lg font-bold leading-7 text-[#202729] dark:text-white">
                      {studio.title}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
                      <div className={`flex min-w-0 items-center gap-2 text-sm ${mutedClass}`}>
                        <MapPin
                          size={15}
                          className="shrink-0 text-[#F16F50]"
                        />

                        <span className="line-clamp-1 break-all">
                          {studio.location}
                        </span>
                      </div>

                      <div className={`flex shrink-0 items-center gap-2 text-sm ${mutedClass}`}>
                        <Users
                          size={15}
                          className="shrink-0 text-[#F16F50]"
                        />

                        <span>
                          {studio.maxCapacity} guests
                        </span>
                      </div>
                    </div>

                    <div className={`mt-3 flex min-w-0 items-center gap-2 text-sm ${mutedClass}`}>
                      <UserRound
                        size={15}
                        className="shrink-0 text-[#F16F50]"
                      />

                      <span className="line-clamp-1 break-all">
                        Hosted by{" "}
                        {studio.ownerName || "Studio Host"}
                      </span>
                    </div>
                  </CardContent>

                  <div className="flex shrink-0 flex-col justify-between gap-5 border-t border-[#EAE7E2] px-4 py-5 dark:border-[#374347] sm:px-6 lg:w-[260px] lg:items-end lg:border-l lg:border-t-0 lg:px-5">
                    <div className="lg:text-right">
                      <p className="text-xs font-medium text-[#929797] dark:text-[#8B9694]">
                        Hourly Rate
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-[#202729] dark:text-white">
                        ${studio.hourlyRate}

                        <span className={`ml-1 text-xs font-normal ${mutedClass}`}>
                          / hour
                        </span>
                      </p>
                    </div>

                    <div className="flex w-full flex-wrap items-center gap-2 lg:justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/studios/${studio._id}`)
                        }
                        className="h-9 gap-1 rounded-lg border-[#EAE7E2] px-2.5 text-xs font-semibold text-[#202729] hover:border-[#F16F50] hover:text-[#F16F50] dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:hover:border-[#F16F50] dark:hover:text-[#F16F50]"
                      >
                        <Eye size={15} />
                        View
                      </Button>

                      <UpdateEdit
                        studio={studio}
                        onUpdated={handleStudioUpdated}
                      />

                      <Link
                        href={`/studios/edit/${studio._id}`}
                        aria-label={`Edit ${studio.title} on full page`}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#F16F50]/40 bg-[#F16F50]/5 px-3 text-xs font-semibold text-[#F16F50] transition-colors hover:border-[#F16F50] hover:bg-[#F16F50]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16F50] dark:border-[#F16F50]/50 dark:bg-[#F16F50]/10 dark:hover:bg-[#F16F50]/20"
                      >
                        <SquarePen size={15} />
                        Edit Full Page
                      </Link>

                      <DeleteStudio
                        studioId={studio._id}
                        studioTitle={studio.title}
                        onDeleted={handleStudioDeleted}
                      />
                    </div>
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
