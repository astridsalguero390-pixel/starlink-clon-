import Navbar from "@/components/Navbar";
import AntennaSection from "@/components/AntennaSection";
import CountryBanner from "@/components/CountryBanner";
import FooterSection from "@/components/FooterSection";
import SEO from "@/components/SEO";

const AntenaPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Antenas Starlink — Mini y Estándar | Hardware Satelital"
                description="Compra tu antena Starlink Mini o Estándar. Hardware 100% original con envío garantizado. Velocidades de 350 a 700 Mbps para hogar, oficinas y movilidad."
                canonical="/antena"
            />
            <Navbar />
            <div className="pt-24">
                <CountryBanner />
                <AntennaSection />
            </div>
            <FooterSection />
        </div>
    );
};

export default AntenaPage;
