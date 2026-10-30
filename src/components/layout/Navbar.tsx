
import Link from "next/link";
import Logo from "@/components/branding/Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#host-guarantee" },
];

export function Navbar() {
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
        </div>

      </div>
    </header>
  );
}
