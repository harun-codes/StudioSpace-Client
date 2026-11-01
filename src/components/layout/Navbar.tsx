'use client';
import Link from "next/link";
import Logo from "@/components/branding/Logo";
import { authClient } from "@/lib/auth-client";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#host-guarantee" },
];

export function Navbar() {

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#202729]/10 bg-[#F5F3EE]">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] flex-col items-center justify-between gap-5 px-5 py-5 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8 lg:px-10 lg:py-0">

        <div className="flex w-full justify-center lg:justify-start">
          <Logo />
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-8">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#727A77] transition-colors duration-200 hover:text-[#F16F50] sm:text-[15px]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex w-full items-center justify-center gap-4 lg:justify-end">

          {user ? (
            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    aria-label="Open account menu"
                    className="rounded-full"
                  />
                }
              >
                <Avatar>
                  <AvatarImage
                    referrerPolicy="no-referrer"
                    src={user?.image || ""}
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className="w-72 rounded-xl border border-[#EAE7E2] bg-white p-4 shadow-lg">
                <PopoverHeader className="text-left">
                  <PopoverTitle className="text-base font-bold text-[#202729]">
                    {user?.name}
                  </PopoverTitle>

                  <PopoverDescription className="break-all text-sm text-[#777D7D]">
                    {user?.email}
                  </PopoverDescription>
                </PopoverHeader>

                <div className="mt-4 flex justify-start border-t border-[#EAE7E2] pt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleLogout}
                    className="w-auto rounded-lg bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:ring-red-300"
                  >
                    Log out
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
