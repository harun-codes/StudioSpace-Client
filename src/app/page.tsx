
import Bannar from "@/components/home/Bannar";
import CategorySection from "@/components/home/Category-section";
import HostGuarantee from "@/components/home/host-guarantee";
import HowItWorks from "@/components/home/how-it-works";

export default function HomePage() {
  return (
    <main>
      <Bannar />
      <CategorySection />
      <HowItWorks />
      <HostGuarantee />
    </main>
  );
}
