
import {
  Camera,
  Clapperboard,
  Mic2,
  Music2,
  LoaderCircle,
} from "lucide-react";

const studioTypes = [
  {
    icon: Camera,
    label: "Photography Studio",
  },
  {
    icon: Clapperboard,
    label: "Film Production",
  },
  {
    icon: Mic2,
    label: "Recording Studio",
  },
  {
    icon: Music2,
    label: "Music Studio",
  },
];

function StudioSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-[#EAE7E2] bg-white shadow-sm dark:border-[#374347] dark:bg-[#1C2629]"
    >
      <div className="aspect-[16/10] animate-pulse bg-[#EAE7E2] dark:bg-[#293638]" />

      <div className="space-y-4 p-5">
        <div className="h-3 w-24 animate-pulse rounded-full bg-[#EAE7E2] dark:bg-[#374347]" />

        <div className="h-5 w-4/5 animate-pulse rounded-full bg-[#EAE7E2] dark:bg-[#374347]" />

        <div className="h-4 w-2/3 animate-pulse rounded-full bg-[#EAE7E2] dark:bg-[#374347]" />

        <div className="flex items-center justify-between border-t border-[#EAE7E2] pt-4 dark:border-[#374347]">
          <div className="h-5 w-24 animate-pulse rounded-full bg-[#EAE7E2] dark:bg-[#374347]" />

          <div className="h-9 w-24 animate-pulse rounded-lg bg-[#EAE7E2] dark:bg-[#374347]" />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading StudioSpace"
      className="relative min-h-screen overflow-hidden bg-[#F5F3EE] px-4 py-12 transition-colors duration-300 dark:bg-[#12191C] sm:px-8 sm:py-16 lg:py-20"
    >
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#F16F50]/5 blur-3xl dark:bg-[#F16F50]/10" />

      <div className="pointer-events-none absolute -right-32 top-80 h-80 w-80 rounded-full bg-[#F16F50]/5 blur-3xl dark:bg-[#F16F50]/10" />

      <div className="relative z-10 mx-auto max-w-[1150px]">
        <div className="mx-auto max-w-[650px] text-center">
          <div className="mb-7 flex items-center justify-center gap-3">
            <span className="h-[2px] w-8 bg-[#F16F50]" />

            <p className="text-xs font-bold uppercase tracking-[2px] text-[#F16F50] sm:tracking-[3px]">
              StudioSpace
            </p>

            <span className="h-[2px] w-8 bg-[#F16F50]" />
          </div>

          <div className="relative mx-auto flex h-24 w-24 items-center justify-center sm:h-28 sm:w-28">
            <div className="absolute inset-0 rounded-full border border-[#F16F50]/20 bg-[#F16F50]/5" />

            <div className="absolute inset-3 rounded-full border border-[#F16F50]/20" />

            <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-[#F16F50]" />

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F16F50] text-white shadow-lg shadow-[#F16F50]/20 sm:h-16 sm:w-16">
              <Camera size={28} strokeWidth={1.8} />
            </div>
          </div>

          <h1 className="mt-8 text-2xl font-extrabold tracking-tight text-[#202729] dark:text-white sm:text-3xl lg:text-4xl">
            Preparing Your
            <span className="text-[#F16F50]"> Creative Space.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#777D7D] dark:text-[#B5BDBA] sm:text-base">
            We&apos;re getting everything ready for your next
            creative experience.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#EAE7E2] bg-white px-5 py-2.5 shadow-sm dark:border-[#374347] dark:bg-[#1C2629]">
            <LoaderCircle
              size={16}
              className="animate-spin text-[#F16F50]"
            />

            <span className="text-xs font-semibold text-[#202729] dark:text-[#E6E8E8] sm:text-sm">
              Loading StudioSpace...
            </span>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-4 sm:gap-4">
          {studioTypes.map((studio) => {
            const Icon = studio.icon;

            return (
              <div
                key={studio.label}
                className="flex flex-col items-center justify-center gap-3 rounded-xl border border-[#EAE7E2] bg-white px-3 py-5 text-center dark:border-[#374347] dark:bg-[#1C2629] sm:px-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F16F50]/10 text-[#F16F50]">
                  <Icon size={21} />
                </div>

                <span className="text-xs font-semibold text-[#777D7D] dark:text-[#B5BDBA]">
                  {studio.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-12 sm:mt-16">
          <div
            aria-hidden="true"
            className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="space-y-3">
              <div className="h-3 w-28 animate-pulse rounded-full bg-[#EAE7E2] dark:bg-[#374347]" />

              <div className="h-8 w-52 max-w-full animate-pulse rounded-full bg-[#EAE7E2] dark:bg-[#374347] sm:w-72" />

              <div className="h-4 w-64 max-w-full animate-pulse rounded-full bg-[#EAE7E2] dark:bg-[#374347]" />
            </div>

            <div className="h-10 w-32 animate-pulse rounded-xl bg-[#EAE7E2] dark:bg-[#374347]" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <StudioSkeleton />
            <StudioSkeleton />

            <div className="sm:col-span-2 lg:col-span-1">
              <StudioSkeleton />
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-xs font-medium text-[#929797] dark:text-[#8B9694]">
          Creative Spaces. Endless Possibilities.
        </p>
      </div>
    </main>
  );
}
