import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCards from "@/components/ProductCards";
import AvailabilityBanner from "@/components/AvailabilityBanner";
import FeatureSections from "@/components/FeatureSections";
import TrialBanner from "@/components/TrialBanner";
import FooterSection from "@/components/FooterSection";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Starlink — Internet Satelital de Alta Velocidad"
        description="Internet satelital Starlink disponible en Honduras, Ecuador y Perú. Conectividad de alta velocidad para hogar, empresas y zonas rurales. ¡Pide tu equipo hoy!"
        canonical="/"
      />
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
