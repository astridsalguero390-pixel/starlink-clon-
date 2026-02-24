import { useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { useCountryContext, countryNames, countryFlags } from "@/components/CountryContext";
import { CountryCode } from "@/hooks/useCountry";
import SEO from "@/components/SEO";

const mapConfig: Record<CountryCode, { src: string; zoom: number; center: string }> = {
    EC: {
        src: "https://maps.google.com/maps?q=Ecuador&t=k&z=6&ie=UTF8&output=embed",
        zoom: 6,
        center: "Ecuador",
    },
    HN: {
        src: "https://maps.google.com/maps?q=Honduras&t=k&z=7&ie=UTF8&output=embed",
        zoom: 7,
        center: "Honduras",
    },
    PE: {
        src: "https://maps.google.com/maps?q=Peru&t=k&z=5&ie=UTF8&output=embed",
        zoom: 5,
        center: "Perú",
    },
    CO: {
        src: "https://maps.google.com/maps?q=Colombia&t=k&z=6&ie=UTF8&output=embed",
        zoom: 6,
        center: "Colombia",
    },
};

const CoberturaPage = () => {
    const { country, setCountry } = useCountryContext();
    const [search, setSearch] = useState("");
    const [mapSrc, setMapSrc] = useState(mapConfig[country].src);
    const [searched, setSearched] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!search.trim()) return;
        const q = encodeURIComponent(`${search.trim()}, ${mapConfig[country].center}`);
        setMapSrc(`https://maps.google.com/maps?q=${q}&t=k&z=13&ie=UTF8&output=embed`);
        setSearched(search.trim());
    };

    const handleCountryChange = (c: CountryCode) => {
        setCountry(c);
        setSearch("");
        setSearched("");
        setMapSrc(mapConfig[c].src);
    };

    const resetMap = () => {
        setSearch("");
        setSearched("");
        setMapSrc(mapConfig[country].src);
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Mapa de Cobertura Starlink — Verifica tu Zona"
                description="Consulta el mapa de cobertura satelital Starlink en Honduras, Ecuador y Perú. Verifica si Starlink llega a tu dirección o zona rural."
                canonical="/cobertura"
            />
            <Navbar />
            <div className="pt-24 pb-10 px-6 max-w-[1200px] mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium mb-2">
                        📡 Cobertura Starlink
                    </p>
                    <h1 className="text-foreground text-3xl md:text-4xl font-bold tracking-tight">
                        {countryFlags[country]} Cobertura en {countryNames[country]}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-2">
                        Busca tu ciudad, zona o dirección para verificar cobertura satelital.
                    </p>
                </div>

                {/* Country switcher + search */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    {/* Country tabs */}
                    <div className="flex gap-1 bg-card border border-border rounded p-1 shrink-0">
                        {(["EC", "HN", "PE"] as CountryCode[]).map((c) => (
                            <button
                                key={c}
                                onClick={() => handleCountryChange(c)}
                                className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors ${country === c
                                    ? "bg-foreground text-background"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {countryFlags[c]} {countryNames[c]}
                            </button>
                        ))}
                    </div>

                    {/* Search box */}
                    <form onSubmit={handleSearch} className="flex flex-1 gap-0">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={`Buscar ciudad, colonia o dirección en ${countryNames[country]}...`}
                            className="flex-1 bg-card border border-border rounded-l px-4 py-2.5 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-foreground/40 transition-colors"
                        />
                        <button
                            type="submit"
                            className="bg-foreground text-background px-5 py-2.5 text-sm font-semibold tracking-wider hover:bg-foreground/90 transition-colors shrink-0"
                        >
                            BUSCAR
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={resetMap}
                                className="border border-border text-muted-foreground px-4 py-2.5 text-sm rounded-r hover:text-foreground transition-colors"
                            >
                                ✕
                            </button>
                        )}
                        {!search && (
                            <span className="border border-l-0 border-border rounded-r px-1" />
                        )}
                    </form>
                </div>

                {/* Coverage confirmation banner */}
                {searched && (
                    <div className="mb-4 bg-card border border-foreground/20 rounded-lg px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl mt-0.5">✅</span>
                            <div>
                                <p className="text-foreground font-semibold text-sm">
                                    ¡Contamos con cobertura satelital en <span className="font-bold">{searched}</span>!
                                </p>
                                <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                                    Señal directa desde el espacio — sin depender de torres terrestres ni fibra óptica.
                                    Funciona en zonas rurales, montañas, selva y alta mar.
                                </p>
                            </div>
                        </div>
                        <a
                            href="/satelital"
                            className="shrink-0 bg-foreground text-background px-4 py-2 rounded text-xs font-semibold tracking-wider hover:bg-foreground/90 transition-colors whitespace-nowrap"
                        >
                            VER PLANES
                        </a>
                    </div>
                )}

                {/* Map */}
                <div className="w-full rounded-lg overflow-hidden border border-border" style={{ height: "60vh", minHeight: "420px" }}>
                    <iframe
                        key={mapSrc}
                        src={mapSrc}
                        width="100%"
                        height="100%"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                        title={`Mapa de cobertura Starlink en ${countryNames[country]}`}
                    />
                </div>

                {/* Coverage note */}
                <div className="mt-5 grid sm:grid-cols-3 gap-3">
                    {[
                        { icon: "🌿", text: "Zonas rurales y selva" },
                        { icon: "⛰️", text: "Montañas y altiplano" },
                        { icon: "🌊", text: "Costa y alta mar" },
                    ].map((b) => (
                        <div key={b.text} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-3">
                            <span className="text-xl">{b.icon}</span>
                            <p className="text-muted-foreground text-xs">{b.text} — cobertura garantizada</p>
                        </div>
                    ))}
                </div>
            </div>
            <FooterSection />
        </div>
    );
};

export default CoberturaPage;
