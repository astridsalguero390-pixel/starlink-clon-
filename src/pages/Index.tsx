import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCards from "@/components/ProductCards";
import AvailabilityBanner from "@/components/AvailabilityBanner";
import FeatureSections from "@/components/FeatureSections";
import TrialBanner from "@/components/TrialBanner";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProductCards />
      <AvailabilityBanner />
      <FeatureSections />
      <TrialBanner />
      <FooterSection />
    </div>
  );
};

export default Index;
