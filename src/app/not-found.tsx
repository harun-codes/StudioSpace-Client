
import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  Clapperboard,
  Home,
  Mic2,
  Music2,
  SearchX,
} from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found | StudioSpace",
  description:
    "The page you're looking for doesn't exist. Explore creative studios on StudioSpace.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#F5F3EE] px-4 py-14 transition-colors duration-300 dark:bg-[#12191C] sm:px-8 sm:py-20">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#F16F50]/5 blur-3xl dark:bg-[#F16F50]/10" />

      <div className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-[#F16F50]/5 blur-3xl dark:bg-[#F16F50]/10" />

      <div className="relative z-10 mx-auto w-full max-w-[900px] text-center">
        <div className="mb-10 flex items-center justify-center gap-3">
          <span className="h-[2px] w-8 bg-[#F16F50]" />

          <p className="text-xs font-bold uppercase tracking-[3px] text-[#F16F50]">
            Lost Your Way?
          </p>

          <span className="h-[2px] w-8 bg-[#F16F50]" />
        </div>

        <div className="relative mx-auto mb-12 w-full max-w-[660px]">
          <div className="relative overflow-hidden rounded-[28px] border border-[#EAE7E2] bg-white p-4 shadow-[0_20px_80px_rgba(32,39,41,0.06)] dark:border-[#374347] dark:bg-[#1C2629] dark:shadow-black/10 sm:rounded-[32px] sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-[#EAE7E2] pb-4 dark:border-[#374347] sm:mb-6 sm:pb-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#F16F50]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#F6C56D]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#B9C2BF] dark:bg-[#465457]" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#929797] dark:text-[#B5BDBA] sm:text-xs">
                Studio Unavailable
              </span>

              <SearchX
                size={18}
                className="text-[#929797] dark:text-[#B5BDBA]"
              />
            </div>

            <div className="relative flex min-h-[230px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#E3DFD9] bg-[#F8F7F4] dark:border-[#465457] dark:bg-[#233034] sm:min-h-[300px]">
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F16F50]/10 sm:h-64 sm:w-64" />

              <div className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F16F50]/5 sm:h-44 sm:w-44" />

              <div className="absolute left-4 top-5 flex h-11 w-11 -rotate-12 items-center justify-center rounded-xl border border-[#EAE7E2] bg-white text-[#F16F50] shadow-sm dark:border-[#374347] dark:bg-[#1C2629] sm:left-10 sm:top-8 sm:h-14 sm:w-14">
                <Camera size={22} />
              </div>

              <div className="absolute right-4 top-6 flex h-11 w-11 rotate-12 items-center justify-center rounded-xl border border-[#EAE7E2] bg-white text-[#F16F50] shadow-sm dark:border-[#374347] dark:bg-[#1C2629] sm:right-10 sm:top-10 sm:h-14 sm:w-14">
                <Mic2 size={22} />
              </div>

              <div className="absolute bottom-5 left-5 flex h-11 w-11 rotate-6 items-center justify-center rounded-xl border border-[#EAE7E2] bg-white text-[#F16F50] shadow-sm dark:border-[#374347] dark:bg-[#1C2629] sm:bottom-10 sm:left-14 sm:h-14 sm:w-14">
                <Clapperboard size={22} />
              </div>

              <div className="absolute bottom-5 right-5 flex h-11 w-11 -rotate-12 items-center justify-center rounded-xl border border-[#EAE7E2] bg-white text-[#F16F50] shadow-sm dark:border-[#374347] dark:bg-[#1C2629] sm:bottom-10 sm:right-14 sm:h-14 sm:w-14">
                <Music2 size={22} />
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="select-none text-[100px] font-black leading-none tracking-[-10px] text-[#202729] dark:text-white sm:text-[150px] sm:tracking-[-15px]">
                  4<span className="text-[#F16F50]">0</span>4
                </div>

                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#F16F50]/20 bg-white px-4 py-2 shadow-sm dark:border-[#F16F50]/30 dark:bg-[#1C2629]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#F16F50]" />

                  <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#202729] dark:text-[#E6E8E8] sm:text-xs">
                    No Studio Found
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 px-1 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#929797] dark:text-[#8B9694] sm:mt-5 sm:text-xs">
              <span>StudioSpace</span>
              <span>Creative Spaces, Endless Possibilities</span>
            </div>
          </div>
        </div>

        <h1 className="mx-auto max-w-[720px] text-3xl font-extrabold leading-tight tracking-tight text-[#202729] dark:text-white sm:text-4xl lg:text-5xl">
          Looks Like This Space
          <span className="text-[#F16F50]"> Doesn&apos;t Exist.</span>
        </h1>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F16F50] px-7 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#DF5D40] hover:shadow-lg hover:shadow-[#F16F50]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16F50] sm:w-auto"
          >
            <Home size={18} />

            Back to Home

            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>

          <Link
            href="/studios"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#EAE7E2] bg-white px-7 text-sm font-bold text-[#202729] transition-all duration-300 hover:border-[#F16F50] hover:text-[#F16F50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16F50] dark:border-[#465457] dark:bg-[#1C2629] dark:text-white dark:hover:border-[#F16F50] dark:hover:text-[#F16F50] sm:w-auto"
          >
            Explore Studios

            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

      </div>
    </main>
  );
}
