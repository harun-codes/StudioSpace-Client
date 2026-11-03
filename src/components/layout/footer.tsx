
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  Aperture,
  Camera,
} from "lucide-react";

import Logo from "@/components/branding/Logo";

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V21h3.4z" />
  </svg>
);

const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M6.94 8.5A1.5 1.5 0 1 1 6.94 5.5a1.5 1.5 0 0 1 0 3ZM5.5 9.75h2.9V18H5.5zm4.9 0h2.77v1.13h.04c.39-.73 1.34-1.5 2.76-1.5 2.96 0 3.51 1.95 3.51 4.48V18h-2.9v-16c0-1.4-.03-3.2-1.95-3.2-1.96 0-2.26 1.53-2.26 3.11V18h-2.9z" />
  </svg>
);

const exploreLinks = [
  { label: "Explore Studios", href: "/studios" },
  { label: "Photo Studios", href: "/studios?category=Photo%20Studio" },
  { label: "Sound Stages", href: "/studios?category=Film%20Stage" },
  { label: "Podcast Rooms", href: "/studios?category=Podcast%20Lounge" },
  { label: "Music Suites", href: "/studios?category=Music%20Suite" },
  { label: "Art Workshops", href: "/studios?category=Workshop" },
];

const hostLinks = [
  { label: "Become a Host", href: "/register" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Host Guarantee", href: "/#host-guarantee" },
  { label: "About StudioSpace", href: "/#host-guarantee" },
];

const accountLinks = [
  { label: "Login", href: "/login" },
  { label: "Create Account", href: "/register" },
  { label: "Browse Studios", href: "/studios" },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: Camera,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: FacebookIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: LinkedInIcon,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#F5F3EE] text-[#202729] transition-colors duration-300 dark:bg-[#12191C] dark:text-[#E6E8E8]">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-14 sm:px-8 sm:pt-16 lg:px-12 lg:pt-20">
        <div className="grid gap-10 border-b border-[#202729]/10 pb-12 dark:border-white/10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.9fr_0.9fr_0.9fr_1.25fr] lg:gap-8 xl:gap-10">
          <div className="max-w-sm sm:col-span-2 lg:col-span-1">
            <div className="inline-block rounded-xl bg-white p-2 dark:bg-[#1C2629]">
              <Logo />
            </div>

            <p className="mt-6 text-sm leading-7 text-[#727A77] dark:text-[#B5BDBA]">
              A creative space marketplace connecting creators
              with inspiring studios, production spaces and
              unique environments to bring ideas to life.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F16F50]/15 text-[#F16F50]">
                <Aperture size={21} />
              </div>

              <p className="text-sm font-semibold text-[#202729] dark:text-[#E6E8E8]">
                Discover. Connect. Create.
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[2px] text-[#202729] dark:text-white">
              Explore
            </h3>

            <ul className="space-y-4">
              {exploreLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#727A77] transition-colors hover:text-[#F16F50] dark:text-[#B5BDBA] dark:hover:text-[#F16F50]"
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
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[2px] text-[#202729] dark:text-white">
              For Hosts
            </h3>

            <ul className="space-y-4">
              {hostLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#727A77] transition-colors hover:text-[#F16F50] dark:text-[#B5BDBA] dark:hover:text-[#F16F50]"
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
            <h3 className="mb-6 text-sm font-bold uppercase tracking-[2px] text-[#202729] dark:text-white">
              Your Account
            </h3>

            <ul className="space-y-4">
              {accountLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#727A77] transition-colors hover:text-[#F16F50] dark:text-[#B5BDBA] dark:hover:text-[#F16F50]"
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

          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-5 flex items-center gap-2">
              <Mail size={19} className="text-[#F16F50]" />

              <h3 className="text-sm font-bold uppercase tracking-[2px] text-[#202729] dark:text-white">
                Stay in the Loop
              </h3>
            </div>

            <p className="mb-5 text-sm leading-7 text-[#727A77] dark:text-[#B5BDBA]">
              Get creative inspiration, studio updates and
              exciting news from the StudioSpace community.
            </p>

            <div className="flex w-full items-center gap-2 rounded-xl border border-[#EAE7E2] bg-white p-1.5 transition-colors dark:border-[#374347] dark:bg-[#1C2629]">
              <input
                type="email"
                aria-label="Newsletter email address"
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-[#202729] outline-none placeholder:text-[#929797] dark:text-[#E6E8E8] dark:placeholder:text-[#8B9694]"
              />

              <button
                type="button"
                disabled
                title="Newsletter subscription coming soon"
                className="flex h-10 shrink-0 items-center gap-1.5 rounded-lg bg-[#F16F50] px-3 text-xs font-bold text-white opacity-70 sm:px-4"
              >
                Subscribe
                <ArrowUpRight size={15} />
              </button>
            </div>

            <p className="mt-2 text-[11px] text-[#929797] dark:text-[#8B9694]">
              Newsletter signup coming soon.
            </p>

            <div className="mt-7">
              <p className="mb-4 text-xs font-bold uppercase tracking-[2px] text-[#202729] dark:text-white">
                Follow Our Community
              </p>

              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#202729]/10 text-[#727A77] transition-all duration-300 hover:border-[#F16F50] hover:bg-[#F16F50] hover:text-white dark:border-white/15 dark:text-[#B5BDBA] dark:hover:border-[#F16F50]"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}

                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#202729]/10 text-[#727A77] transition-all duration-300 hover:border-[#F16F50] hover:bg-[#F16F50] hover:text-white dark:border-white/15 dark:text-[#B5BDBA] dark:hover:border-[#F16F50]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-[17px] w-[17px]"
                    aria-hidden="true"
                  >
                    <path d="M18.901 1.153h3.68L14.54 10.92l9.449 12.86h-7.406l-5.8-7.584-6.636 7.584H.463l8.6-9.83L0 1.153h7.594l5.243 6.932zm-1.29 20.364h2.039L6.486 3.298H4.298z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs text-[#727A77] dark:text-[#B5BDBA]">
              © 2026 StudioSpace. All rights reserved.
            </p>

            <p className="max-w-md text-xs leading-6 text-[#929797] dark:text-[#8B9694]">
              By using StudioSpace, you agree to our platform terms
              and conditions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/"
              className="text-xs text-[#727A77] transition-colors hover:text-[#F16F50] dark:text-[#B5BDBA]"
            >
              Home
            </Link>

            <Link
              href="/#categories"
              className="text-xs text-[#727A77] transition-colors hover:text-[#F16F50] dark:text-[#B5BDBA]"
            >
              Categories
            </Link>

            <Link
              href="/#how-it-works"
              className="text-xs text-[#727A77] transition-colors hover:text-[#F16F50] dark:text-[#B5BDBA]"
            >
              How It Works
            </Link>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#727A77] dark:text-[#B5BDBA]">
            Made for Creators
            <Aperture size={15} className="text-[#F16F50]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
