import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import SpecsSection from "@/components/SpecsSection";
import CoverageSection from "@/components/CoverageSection";
import KitSection from "@/components/KitSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <SpecsSection />
      <CoverageSection />
      <KitSection />
      <FooterSection />
    </div>
  );
};

export default Index;
