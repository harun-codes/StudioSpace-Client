
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      aria-label="StudioSpace home"
      className="group flex shrink-0 items-center gap-3"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-[15px] bg-[#202729] transition-transform duration-300 group-hover:scale-105">
        <svg
          width="34"
          height="34"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 9H10V14M33 9H38V14M10 34V39H15M38 34V39H33"
            stroke="#F16F50"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="24"
            cy="24"
            r="10"
            stroke="#F5F3EE"
            strokeWidth="2"
          />
          <path
            d="M24 16L30 24L24 32L18 24L24 16Z"
            fill="#F16F50"
          />
          <circle cx="24" cy="24" r="2.5" fill="#202729" />
        </svg>
      </span>

      <span className="text-[22px] font-extrabold tracking-[-1.2px] text-[#202729] sm:text-[24px]">
        StudioSpace<span className="text-[#F16F50]">.</span>
      </span>
    </Link>
  );
}
