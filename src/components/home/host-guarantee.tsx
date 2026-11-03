
import Link from "next/link";

import {
  ShieldCheck,
  BadgeCheck,
  Wrench,
  Headset,
  ArrowUpRight,
} from "lucide-react";

const assurances = [
  {
    number: "01",
    title: "Liability Protection",
    description:
      "Clear booking terms and responsibility guidelines help hosts and creators understand their expectations.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Verified Profiles",
    description:
      "Build a more trusted creative community through verified host and creator profiles.",
    icon: BadgeCheck,
  },
  {
    number: "03",
    title: "Equipment Safety",
    description:
      "Promote responsible equipment handling and safer use of professional studio facilities.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "24/7 Host Support",
    description:
      "Get support for booking questions, hosting concerns and operational assistance.",
    icon: Headset,
  },
];

export default function HostGuarantee() {
  return (
    <section
      id="host-guarantee"
      className="overflow-hidden bg-white px-5 py-16 transition-colors duration-300 dark:bg-[#12191C] sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-[2px] w-9 bg-[#F16F50]" />

              <p className="text-xs font-bold uppercase tracking-[4px] text-[#F16F50]">
                Trust & Protection
              </p>
            </div>

            <h2 className="max-w-xl text-3xl font-extrabold leading-[1.15] tracking-[-1.5px] text-[#202729] transition-colors duration-300 dark:text-[#E6E8E8] sm:text-5xl lg:text-6xl">
              Create with confidence.
              <span className="mt-2 block text-[#F16F50]">
                Host with peace of mind.
              </span>
            </h2>

            <p className="mt-7 max-w-lg text-base leading-8 text-[#727A77] dark:text-[#B5BDBA] sm:text-lg">
              Great creative experiences begin with trust.
              StudioSpace is designed to support both hosts
              and creators with protection, transparency
              and dedicated assistance.
            </p>

            <Link
              href="/register"
              className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-[#F16F50] px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#DF5D40] hover:shadow-xl hover:shadow-[#F16F50]/20 sm:mt-9 sm:px-7"
            >
              Become a Host

              <ArrowUpRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>

            <div className="mt-10 border-t border-[#202729]/10 pt-6 dark:border-white/10 sm:mt-12">
              <p className="text-sm font-semibold text-[#202729] dark:text-[#E6E8E8]">
                Built for creators. Designed for hosts.
              </p>

              <p className="mt-2 text-sm text-[#727A77] dark:text-[#B5BDBA]">
                One community, better creative experiences.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5">
            {assurances.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.number}
                  className="group flex h-full flex-col rounded-2xl border border-[#202729]/10 bg-[#F5F3EE] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#F16F50]/50 hover:shadow-xl hover:shadow-[#202729]/5 dark:border-[#374347] dark:bg-[#1C2629] dark:hover:border-[#F16F50]/50 dark:hover:shadow-black/20 sm:p-7 lg:p-8"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#F16F50] transition-all duration-300 group-hover:bg-[#F16F50] group-hover:text-white dark:bg-[#233034] dark:text-[#F16F50] dark:group-hover:bg-[#F16F50] dark:group-hover:text-white">
                      <Icon size={24} strokeWidth={1.8} />
                    </div>

                    <span className="text-sm font-bold tracking-widest text-[#202729]/25 dark:text-white/25">
                      {item.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold text-[#202729] dark:text-[#E6E8E8] sm:mt-8">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#727A77] dark:text-[#B5BDBA]">
                    {item.description}
                  </p>

                  <div className="mb-1 mt-auto pt-7">
                    <div className="h-[2px] w-8 bg-[#F16F50] transition-all duration-300 group-hover:w-16" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
