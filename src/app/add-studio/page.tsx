
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddStudioForm from "@/components/studios/add-studio-form";

export default function AddStudioPage() {
  return (
    <main className="min-h-screen bg-[#F5F3EE] px-4 py-8 transition-colors duration-300 dark:bg-[#111819] sm:px-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1050px]">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#777D7D] transition-colors hover:text-[#F16F50] dark:text-[#B5BDBA] dark:hover:text-[#F16F50]"
        >
          <ArrowLeft size={17} />
          Back to Explore Studios
        </Link>

        <div className="mb-8 mt-7 sm:mb-10">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-[2px] w-9 shrink-0 bg-[#F16F50]" />

            <p className="text-xs font-bold uppercase tracking-[2px] text-[#F16F50] sm:tracking-[3px]">
              Become a StudioSpace Host
            </p>
          </div>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#202729] dark:text-white sm:text-4xl lg:text-5xl">
            List Your Creative
            <span className="text-[#F16F50]"> Space.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#777D7D] dark:text-[#B5BDBA] sm:text-base sm:leading-8">
            Share your creative workspace with photographers,
            filmmakers, musicians and creators.
          </p>
        </div>

        <AddStudioForm />
      </div>
    </main>
  );
}
