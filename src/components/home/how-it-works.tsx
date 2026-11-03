
import Link from "next/link";

import {
  Search,
  CalendarDays,
  ClipboardCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Explore creative studios and find a space that matches your project, style and production needs.",
    icon: Search,
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description:
      "Choose your preferred date, available time slot and booking duration for your creative session.",
    icon: CalendarDays,
  },
  {
    number: "03",
    title: "Book Instantly",
    description:
      "Review your booking details, check the total price and submit your studio reservation.",
    icon: ClipboardCheck,
  },
  {
    number: "04",
    title: "Create & Produce",
    description:
      "Arrive at your selected creative space and bring your next big idea to life.",
    icon: Sparkles,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-white px-5 py-16 transition-colors duration-300 dark:bg-[#12191C] sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#F16F50]" />

              <p className="text-xs font-bold uppercase tracking-[4px] text-[#F16F50]">
                Simple Process
              </p>
            </div>

            <h2 className="text-3xl font-extrabold leading-tight tracking-[-1.5px] text-[#202729] transition-colors duration-300 dark:text-[#E6E8E8] sm:text-5xl lg:text-6xl">
              From your idea
              <span className="block text-[#F16F50]">
                to your creation.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#727A77] dark:text-[#B5BDBA] sm:text-lg">
              Finding and booking your perfect creative space
              should be simple. Here is how StudioSpace makes it happen.
            </p>
          </div>

          <Link
            href="/studios"
            className="group inline-flex w-fit shrink-0 items-center gap-3 border-b border-[#202729]/30 pb-2 text-sm font-bold text-[#202729] transition-colors hover:border-[#F16F50] hover:text-[#F16F50] dark:border-white/30 dark:text-[#E6E8E8] dark:hover:border-[#F16F50]"
          >
            Find Your Studio

            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative flex h-full flex-col rounded-2xl border border-[#202729]/10 bg-[#F5F3EE] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#F16F50]/40 hover:shadow-xl hover:shadow-[#202729]/5 dark:border-[#374347] dark:bg-[#1C2629] dark:hover:border-[#F16F50]/50 dark:hover:shadow-black/20 sm:p-8"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-extrabold tracking-widest text-[#F16F50]">
                    STEP {step.number}
                  </span>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#202729] transition-all duration-300 group-hover:bg-[#F16F50] group-hover:text-white dark:bg-[#233034] dark:text-[#E6E8E8] dark:group-hover:bg-[#F16F50] dark:group-hover:text-white">
                    <Icon size={23} strokeWidth={1.8} />
                  </div>
                </div>

                <div className="mb-7 mt-10 h-[2px] w-10 bg-[#F16F50] transition-all duration-300 group-hover:w-16" />

                <h3 className="text-xl font-bold tracking-tight text-[#202729] dark:text-[#E6E8E8]">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#727A77] dark:text-[#B5BDBA]">
                  {step.description}
                </p>

                <div className="mt-auto flex items-center justify-between border-t border-[#202729]/10 pt-5 dark:border-white/10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#727A77] dark:text-[#B5BDBA]">
                    StudioSpace
                  </span>

                  <span className="text-sm font-bold text-[#202729]/20 transition-colors group-hover:text-[#F16F50] dark:text-white/20">
                    {step.number}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col justify-between gap-6 rounded-2xl bg-[#202729] p-6 transition-colors duration-300 dark:border dark:border-[#374347] dark:bg-[#1C2629] sm:mt-12 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[3px] text-[#F16F50]">
              Have a Creative Space?
            </p>

            <h3 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
              Your space could inspire someone&apos;s next big idea.
            </h3>

            <p className="mt-3 text-sm leading-7 text-white/60">
              Share your studio with creators and become part of
              the StudioSpace community.
            </p>
          </div>

          <Link
            href="/register"
            className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-xl bg-[#F16F50] px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#DF5D40] sm:px-7"
          >
            Become a Host

            <ArrowUpRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
