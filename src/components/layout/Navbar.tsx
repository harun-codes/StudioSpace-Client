
"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";


import Logo from "@/components/branding/Logo";
import { authClient } from "@/lib/auth-client";

import {
  LayoutDashboard,
  PlusCircle,
  List,
  CalendarDays,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  ScanEye,
  ArrowUpRight,
} from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#host-guarantee" },
];

const profileLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Add New Studio",
    href: "/add-studio",
    icon: PlusCircle,
  },
  {
    label: "My Studio Listings",
    href: "/my-listings",
    icon: List,
  },
  {
    label: "My Bookings",
    href: "/my-bookings",
    icon: CalendarDays,
  },
];

function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);

  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

function getHashSnapshot() {
  return window.location.hash;
}

function getServerHashSnapshot() {
  return "";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const { data: session, isPending } =
    authClient.useSession();

  const user = session?.user;

  const activeHash = useSyncExternalStore(
    subscribeToHash,
    getHashSnapshot,
    getServerHashSnapshot
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/" && !activeHash;
    }

    if (href.startsWith("/#")) {
      return (
        pathname === "/" &&
        activeHash === href.slice(1)
      );
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const isProfileRoute = profileLinks.some(
    (item) =>
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`)
  );

  const closeMenus = () => {
    setMenuOpen(false);
    setPopoverOpen(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      closeMenus();

      toast.success("Logged out successfully!");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#202729]/10 bg-[#F5F3EE] transition-colors duration-300 dark:border-white/10 dark:bg-[#12191C]">
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1440px] items-center justify-between gap-3 px-3 py-3 sm:px-6 lg:grid lg:min-h-[80px] lg:grid-cols-[1fr_auto_1fr] lg:gap-6 lg:px-10 lg:py-0">
        <div className="flex min-w-0 items-center justify-start">
          <div className="hidden lg:block">
            <Logo />
          </div>

          <Link
            href="/"
            onClick={closeMenus}
            aria-label="StudioSpace Home"
            className="flex min-w-0 items-center gap-2 lg:hidden"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#202729] text-[#F16F50] dark:bg-[#233034]">
              <ScanEye
                size={21}
                strokeWidth={2}
              />
            </span>

            <span className="whitespace-nowrap text-[17px] font-extrabold tracking-tight text-[#202729] dark:text-white sm:text-xl">
              StudioSpace
              <span className="text-[#F16F50]">.</span>
            </span>
          </Link>
        </div>

        <nav
          aria-label="Main navigation"
          className="hidden items-center justify-center gap-5 lg:flex xl:gap-9"
        >
          {navLinks.map((item) => {
            const isActive = isActiveLink(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={
                  isActive ? "page" : undefined
                }
                className={`relative whitespace-nowrap border-b-2 py-2 text-sm font-medium transition-colors duration-200 xl:text-[15px] ${
                  isActive
                    ? "border-[#F16F50] font-semibold text-[#F16F50]"
                    : "border-transparent text-[#727A77] hover:text-[#F16F50] dark:text-[#B5BDBA] dark:hover:text-[#F16F50]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 lg:gap-4">
          <button
            type="button"
            onClick={() =>
              setTheme(
                resolvedTheme === "dark"
                  ? "light"
                  : "dark"
              )
            }
            aria-label="Toggle color theme"
            title="Toggle color theme"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#EAE7E2] bg-white text-[#202729] transition-all duration-200 hover:border-[#F16F50] hover:text-[#F16F50] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16F50] dark:border-white/10 dark:bg-[#233034] dark:text-[#F5F3EE] dark:hover:border-[#F16F50] dark:hover:text-[#F16F50] sm:h-10 sm:w-10"
          >
            <Moon
              size={19}
              strokeWidth={1.8}
              className="dark:hidden"
            />

            <Sun
              size={19}
              strokeWidth={1.8}
              className="hidden dark:block"
            />
          </button>

          {isPending ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-[#E5E2DC] dark:bg-[#293538] sm:h-10 sm:w-10" />
          ) : user ? (
            <Popover
              open={popoverOpen}
              onOpenChange={(value) => {
                setPopoverOpen(value);

                if (value) {
                  setMenuOpen(false);
                }
              }}
            >
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    aria-label="Open profile menu"
                    aria-expanded={popoverOpen}
                    className={`flex shrink-0 items-center gap-1 rounded-full border p-0.5 transition-colors sm:gap-2 sm:p-1 ${
                      popoverOpen || isProfileRoute
                        ? "border-[#F16F50] bg-[#F16F50]/10"
                        : "border-transparent hover:border-[#F16F50]"
                    }`}
                  />
                }
              >
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                  <AvatarImage
                    referrerPolicy="no-referrer"
                    src={user.image || ""}
                    alt={user.name || "User"}
                  />

                  <AvatarFallback className="bg-[#F16F50] font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>

                <ChevronDown
                  size={15}
                  className={`hidden transition-transform sm:block ${
                    popoverOpen ? "rotate-180" : ""
                  } text-[#727A77] dark:text-[#B5BDBA]`}
                />
              </PopoverTrigger>

              <PopoverContent
                align="end"
                sideOffset={12}
                className="w-72 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#EAE7E2] bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#1C2629]"
              >
                <PopoverHeader className="px-2 py-3 text-left">
                  <PopoverTitle className="break-words text-base font-bold text-[#202729] dark:text-[#F5F3EE]">
                    {user.name}
                  </PopoverTitle>

                  <PopoverDescription className="break-all text-sm text-[#777D7D] dark:text-[#B5BDBA]">
                    {user.email}
                  </PopoverDescription>
                </PopoverHeader>

                <div className="my-2 border-t border-[#EAE7E2] dark:border-white/10" />

                <div className="space-y-1">
                  {profileLinks.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(
                        `${item.href}/`
                      );

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMenus}
                        aria-current={
                          isActive ? "page" : undefined
                        }
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#F16F50]/10 text-[#F16F50]"
                            : "text-[#202729] hover:bg-[#F5F3EE] hover:text-[#F16F50] dark:text-[#E6E8E8] dark:hover:bg-white/10 dark:hover:text-[#F16F50]"
                        }`}
                      >
                        <Icon
                          size={19}
                          strokeWidth={1.8}
                        />

                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="my-3 border-t border-[#EAE7E2] dark:border-white/10" />

                <div className="flex justify-start px-2 pb-1">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="h-10 justify-start gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    <LogOut size={17} />

                    {isLoggingOut
                      ? "Logging out..."
                      : "Logout"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-semibold text-[#202729] transition-colors hover:text-[#F16F50] dark:text-[#F5F3EE] dark:hover:text-[#F16F50]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-[#F16F50] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#DF5D40]"
              >
                Register
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setMenuOpen((previous) => !previous);
              setPopoverOpen(false);
            }}
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-controls="studio-mobile-navigation"
            aria-expanded={menuOpen}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F16F50] sm:h-10 sm:w-10 lg:hidden ${
              menuOpen
                ? "border-[#F16F50] bg-[#F16F50]/10 text-[#F16F50]"
                : "border-[#EAE7E2] bg-white text-[#202729] hover:border-[#F16F50] hover:text-[#F16F50] dark:border-white/10 dark:bg-[#233034] dark:text-white dark:hover:border-[#F16F50] dark:hover:text-[#F16F50]"
            }`}
          >
            {menuOpen ? (
              <X
                size={21}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                size={21}
                strokeWidth={1.8}
              />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="studio-mobile-navigation"
          className="border-t border-[#EAE7E2] bg-[#F5F3EE] px-3 pb-5 pt-3 dark:border-white/10 dark:bg-[#12191C] sm:px-6 lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-[1440px] flex-col gap-1"
          >
            {navLinks.map((item) => {
              const isActive = isActiveLink(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  aria-current={
                    isActive ? "page" : undefined
                  }
                  className={`flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#F16F50]/10 text-[#F16F50]"
                      : "text-[#202729] hover:bg-white hover:text-[#F16F50] dark:text-[#E6E8E8] dark:hover:bg-[#233034] dark:hover:text-[#F16F50]"
                  }`}
                >
                  <span>{item.label}</span>

                  <ArrowUpRight
                    size={17}
                    className={
                      isActive
                        ? "text-[#F16F50]"
                        : "text-[#929797] dark:text-[#8B9694]"
                    }
                  />
                </Link>
              );
            })}

            {!isPending && !user && (
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-[#EAE7E2] pt-4 dark:border-white/10">
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="flex h-11 items-center justify-center rounded-xl border border-[#EAE7E2] bg-white text-sm font-semibold text-[#202729] transition-colors hover:border-[#F16F50] hover:text-[#F16F50] dark:border-[#465457] dark:bg-[#233034] dark:text-white dark:hover:border-[#F16F50]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenus}
                  className="flex h-11 items-center justify-center rounded-xl bg-[#F16F50] text-sm font-semibold text-white transition-colors hover:bg-[#DF5D40]"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
