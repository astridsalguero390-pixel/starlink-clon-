import Navbar from "@/components/Navbar";
import PlansSection from "@/components/PlansSection";
import CountryBanner from "@/components/CountryBanner";
import FooterSection from "@/components/FooterSection";
import SEO from "@/components/SEO";

const SatelitalPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Planes de Servicio Starlink — SIM Card Satelital"
                description="Elige tu plan de internet satelital Starlink. Planes de datos para SIM Card en Honduras, Ecuador y Perú. Velocidades hasta 300 Mbps, cobertura en todo el país."
                canonical="/satelital"
            />
            <Navbar />
            <div className="pt-24">
                <CountryBanner />
                <PlansSection />
            </div>
            <FooterSection />
        </div>
    );
};

export default SatelitalPage;
