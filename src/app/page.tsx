
import { Suspense } from "react";

import Bannar from "@/components/home/Bannar";
import CategorySection from "@/components/home/Category-section";
import FeaturedStudios from "@/components/home/Featured-studios";
import HostGuarantee from "@/components/home/host-guarantee";
import HowItWorks from "@/components/home/how-it-works";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Bannar />

      <Suspense
        fallback={
          <div className="bg-[#F8F7F4] px-5 py-24 text-center dark:bg-[#12191C]">
            <p className="text-sm font-medium text-[#777D7D] dark:text-[#B5BDBA]">
              Discovering creative spaces...
            </p>
          </div>
        }
      >
        <FeaturedStudios />
      </Suspense>

      <CategorySection />
      <HowItWorks />
      <HostGuarantee />
    </main>
  );
}
