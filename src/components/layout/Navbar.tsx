
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const updateHash = () => {
      setActiveHash(window.location.hash);
    };

    updateHash();

    window.addEventListener("hashchange", updateHash);

    return () => {
      window.removeEventListener("hashchange", updateHash);
    };
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/" && !activeHash;
    }

    if (href.startsWith("/#")) {
      return pathname === "/" && activeHash === href.slice(1);
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isProfileRoute = profileLinks.some(
    (item) =>
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`)
  );

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      setPopoverOpen(false);
      toast.success("Logged out successfully!");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#202729]/10 bg-[#F5F3EE]">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] flex-col items-center justify-between gap-5 px-5 py-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:px-10 lg:py-0">

        <div className="flex w-full justify-center lg:justify-start">
          <Logo />
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-8">
          {navLinks.map((item) => {
            const isActive = isActiveLink(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative border-b-2 py-2 text-sm font-medium transition-colors duration-200 sm:text-[15px] ${
                  isActive
                    ? "border-[#F16F50] font-semibold text-[#F16F50]"
                    : "border-transparent text-[#727A77] hover:text-[#F16F50]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex w-full items-center justify-center gap-4 lg:justify-end">
          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-[#E5E2DC]" />
          ) : user ? (
            <Popover
              open={popoverOpen}
              onOpenChange={setPopoverOpen}
            >
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    aria-label="Open profile menu"
                    className={`flex items-center gap-2 rounded-full border p-1 transition-colors ${
                      popoverOpen || isProfileRoute
                        ? "border-[#F16F50] bg-[#F16F50]/10"
                        : "border-transparent hover:border-[#F16F50]"
                    }`}
                  />
                }
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    referrerPolicy="no-referrer"
                    src={user.image || ""}
                    alt={user.name || "User"}
                  />

                  <AvatarFallback className="bg-[#F16F50] font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <ChevronDown
                  size={16}
                  className={`mr-1 text-[#727A77] transition-transform ${
                    popoverOpen ? "rotate-180" : ""
                  }`}
                />
              </PopoverTrigger>

              <PopoverContent
                align="end"
                sideOffset={12}
                className="w-72 rounded-2xl border border-[#EAE7E2] bg-white p-3 shadow-xl"
              >
                <PopoverHeader className="px-2 py-3 text-left">
                  <PopoverTitle className="text-base font-bold text-[#202729]">
                    {user.name}
                  </PopoverTitle>

                  <PopoverDescription className="break-all text-sm text-[#777D7D]">
                    {user.email}
                  </PopoverDescription>
                </PopoverHeader>

                <div className="my-2 border-t border-[#EAE7E2]" />

                <div className="space-y-1">
                  {profileLinks.map((item) => {
                    const Icon = item.icon;

                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setPopoverOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#F16F50]/10 text-[#F16F50]"
                            : "text-[#202729] hover:bg-[#F5F3EE] hover:text-[#F16F50]"
                        }`}
                      >
                        <Icon size={19} strokeWidth={1.8} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="my-3 border-t border-[#EAE7E2]" />

                <div className="flex justify-start px-2 pb-1">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="h-10 w-auto justify-start gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700"
                  >
                    <LogOut size={17} />

                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-semibold text-[#202729] transition-colors hover:text-[#F16F50] sm:text-[15px]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-[#F16F50] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#DF5D40] sm:text-[15px]"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
