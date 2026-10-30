
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  Aperture,
} from "lucide-react";

import Logo from "@/components/branding/Logo";

const exploreLinks = [
  { label: "Explore Studios", href: "/studios" },
  { label: "Photo Studios", href: "/studios?category=Photo%20Studios" },
  { label: "Sound Stages", href: "/studios?category=Sound%20Stages" },
  { label: "Podcast Rooms", href: "/studios?category=Podcast%20Rooms" },
  { label: "Music Suites", href: "/studios?category=Music%20Suites" },
];

const hostLinks = [
  { label: "Become a Host", href: "/register" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Host Guarantee", href: "/#host-guarantee" },
  { label: "About StudioSpace", href: "/#about-us" },
];

const accountLinks = [
  { label: "Login", href: "/login" },
  { label: "Create Account", href: "/register" },
  { label: "Browse Studios", href: "/studios" },
];

export default function Footer() {
  return (
    <footer className="bg-[#171D1F] text-white">

      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-16 sm:px-8 lg:px-12 lg:pt-20">

        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">

          <div className="max-w-sm">

            <div className="inline-block rounded-xl bg-[#F5F3EE] p-2">
              <Logo />
            </div>

            <p className="mt-7 text-sm leading-7 text-white/55">
              A creative space marketplace connecting creators
              with inspiring studios, production spaces and
              unique environments to bring ideas to life.
            </p>

            <div className="mt-7 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F16F50]/15 text-[#F16F50]">
                <Aperture size={21} />
              </div>

              <p className="text-sm font-semibold text-white/80">
                Discover. Connect. Create.
              </p>

            </div>

          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[2px] text-white">
              Explore
            </h3>

            <ul className="space-y-4">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-[#F16F50]"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[2px] text-white">
              For Hosts
            </h3>

            <ul className="space-y-4">
              {hostLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-[#F16F50]"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[2px] text-white">
              Your Account
            </h3>

            <ul className="space-y-4">
              {accountLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-[#F16F50]"
                  >
                    {item.label}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>


        <div className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-white/45">
            © 2026 StudioSpace. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/"
              className="text-xs text-white/45 transition-colors hover:text-[#F16F50]"
            >
              Home
            </Link>

            <Link
              href="/#categories"
              className="text-xs text-white/45 transition-colors hover:text-[#F16F50]"
            >
              Categories
            </Link>

            <Link
              href="/#how-it-works"
              className="text-xs text-white/45 transition-colors hover:text-[#F16F50]"
            >
              How It Works
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-white/60">
            Made for Creators
            <Aperture size={15} className="text-[#F16F50]" />
          </div>

        </div>

      </div>

    </footer>
  );
}
