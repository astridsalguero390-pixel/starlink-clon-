import { useState } from "react";
import { useCountryContext, countryFlags } from "./CountryContext";
import { CountryCode } from "@/hooks/useCountry";
import AcquirePlanModal, { PlanInfo } from "./AcquirePlanModal";

interface AntennaProduct {
    name: string;
    price: string;
    originalPrice?: string;
    tag?: string;
    includes: string[];
    benefits: string[];
    devices: string;
    coverage: string;
    idealFor: string[];
}

interface InternetPlan {
    name: string;
    price: string;
    speed: string;
    description: string;
}

const antennasByCountry: Record<CountryCode, AntennaProduct[]> = {
    HN: [
        {
            name: "STARLINK MINI",
            price: "$180",
            tag: "Incluye 1 año de servicio GRATIS",
            includes: ["Antena satelital compacta", "Router Wi-Fi integrado", "Base/soporte", "Cables y fuente de poder"],
            benefits: ["Muy portátil y ligera", "Instalación rápida (plug & play)", "Bajo consumo de energía", "Velocidades 350–400 Mbps"],
            devices: "Hasta 128 dispositivos",
            coverage: "~100–120 m²",
            idealFor: ["Casa pequeña", "Campo y viajes", "Streaming HD", "Trabajo remoto básico"],
        },
        {
            name: "STARLINK ESTÁNDAR",
            price: "$250",
            includes: ["Antena satelital", "Router Wi-Fi 6 (más potente)", "Base/soporte", "Cables y fuente de poder"],
            benefits: ["Señal más estable", "Mayor cobertura Wi-Fi", "Mejor rendimiento con muchos dispositivos", "Hasta 700 Mbps"],
            devices: "Hasta 235 dispositivos",
            coverage: "~250–300 m²",
            idealFor: ["Hogar principal", "Oficinas", "Streaming 4K", "Videollamadas y gaming"],
        },
    ],
    EC: [
        {
            name: "STARLINK MINI",
            price: "$180",
            tag: "Incluye 1 año de servicio GRATIS",
            includes: ["Antena satelital compacta", "Router Wi-Fi integrado", "Base/soporte", "Cables y fuente de poder"],
            benefits: ["Muy portátil y ligera", "Instalación rápida (plug & play)", "Bajo consumo de energía", "Velocidades 350–400 Mbps"],
            devices: "Hasta 128 dispositivos",
            coverage: "~100–120 m²",
            idealFor: ["Casa pequeña", "Campo y viajes", "Streaming HD", "Trabajo remoto básico"],
        },
        {
            name: "STARLINK ESTÁNDAR",
            price: "$250",
            includes: ["Antena satelital", "Router Wi-Fi 6 (más potente)", "Base/soporte", "Cables y fuente de poder"],
            benefits: ["Señal más estable", "Mayor cobertura Wi-Fi", "Mejor rendimiento con muchos dispositivos", "Hasta 700 Mbps"],
            devices: "Hasta 235 dispositivos",
            coverage: "~250–300 m²",
            idealFor: ["Hogar principal", "Oficinas", "Streaming 4K", "Videollamadas y gaming"],
        },
    ],
    PE: [
        {
            name: "STARLINK MINI",
            price: "800 S/.",
            tag: "Incluye 1 año de servicio GRATIS",
            includes: ["Antena satelital compacta", "Router Wi-Fi integrado", "Base/soporte", "Cables y fuente de poder"],
            benefits: ["Muy portátil y ligera", "Instalación rápida (plug & play)", "Bajo consumo de energía", "Velocidades 350–400 Mbps"],
            devices: "Hasta 128 dispositivos",
            coverage: "~100–120 m²",
            idealFor: ["Casa pequeña", "Campo y viajes", "Streaming HD", "Trabajo remoto básico"],
        },
        {
            name: "STARLINK ESTÁNDAR",
            price: "1,000 S/.",
            includes: ["Antena satelital", "Router Wi-Fi 6 (más potente)", "Base/soporte", "Cables y fuente de poder"],
            benefits: ["Señal más estable", "Mayor cobertura Wi-Fi", "Mejor rendimiento con muchos dispositivos", "Hasta 700 Mbps"],
            devices: "Hasta 235 dispositivos",
            coverage: "~250–300 m²",
            idealFor: ["Hogar principal", "Oficinas", "Streaming 4K", "Videollamadas y gaming"],
        },
    ],
    CO: [
        {
            name: "STARLINK MINI",
            price: "$180",
            tag: "Incluye 1 año de servicio GRATIS",
            includes: ["Antena satelital compacta", "Router Wi-Fi integrado", "Base/soporte", "Cables y fuente de poder"],
            benefits: ["Muy portátil y ligera", "Instalación rápida (plug & play)", "Bajo consumo de energía", "Velocidades 350–400 Mbps"],
            devices: "Hasta 128 dispositivos",
            coverage: "~100–120 m²",
            idealFor: ["Casa pequeña", "Campo y viajes", "Streaming HD", "Trabajo remoto básico"],
        },
        {
            name: "STARLINK ESTÁNDAR",
            price: "$250",
            includes: ["Antena satelital", "Router Wi-Fi 6 (más potente)", "Base/soporte", "Cables y fuente de poder"],
            benefits: ["Señal más estable", "Mayor cobertura Wi-Fi", "Mejor rendimiento con muchos dispositivos", "Hasta 700 Mbps"],
            devices: "Hasta 235 dispositivos",
            coverage: "~250–300 m²",
            idealFor: ["Hogar principal", "Oficinas", "Streaming 4K", "Videollamadas y gaming"],
        },
    ],
};

const internetPlans: InternetPlan[] = [
    {
        name: "Residencia Lite",
        price: "$15/mes",
        speed: "Hasta 100 Mbps",
        description: "Ideal para redes sociales, navegación, clases virtuales y streaming HD.",
    },
    {
        name: "Residencial",
        price: "$20/mes",
        speed: "Hasta 300 Mbps",
        description: "Perfecto para hogares con varios dispositivos, streaming 4K, videollamadas y gaming.",
    },
];

const AntennaSection = () => {
    const { country } = useCountryContext();
    const antennas = antennasByCountry[country];
    const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);

    return (
        <>
            <section id="antenas" className="bg-background py-16 px-6">
                <div className="max-w-[1200px] mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium mb-2">
                            Hardware Starlink
                        </p>
                        <h2 className="text-foreground text-3xl md:text-4xl font-bold tracking-tight">
                            Antenas para {countryFlags[country]}
                        </h2>
                        <p className="text-muted-foreground text-sm mt-3 max-w-xl leading-relaxed">
                            Productos 100% originales. Envíos seguros y garantizados a todo el país.
                        </p>
                    </div>

                    {/* Antenna cards */}
                    <div className="grid md:grid-cols-2 gap-6 mb-14">
                        {antennas.map((ant) => (
                            <div key={ant.name} className="bg-card border border-border rounded-lg p-8 flex flex-col">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-foreground text-xl font-bold tracking-tight">{ant.name}</h3>
                                        <p className="text-foreground text-3xl font-bold mt-1">{ant.price}</p>
                                    </div>
                                    {ant.tag && (
                                        <span className="bg-foreground/10 border border-foreground/20 text-foreground text-[11px] font-semibold px-3 py-1 rounded-full text-right leading-tight">
                                            {ant.tag}
                                        </span>
                                    )}
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                                    <div>
                                        <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-2">Incluye</p>
                                        <ul className="space-y-1">
                                            {ant.includes.map((item) => (
                                                <li key={item} className="text-muted-foreground text-xs">• {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-2">Beneficios</p>
                                        <ul className="space-y-1">
                                            {ant.benefits.map((b) => (
                                                <li key={b} className="text-muted-foreground text-xs">• {b}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-border text-xs">
                                    <div>
                                        <p className="text-foreground font-semibold mb-0.5">Dispositivos</p>
                                        <p className="text-muted-foreground">{ant.devices}</p>
                                    </div>
                                    <div>
                                        <p className="text-foreground font-semibold mb-0.5">Cobertura Wi-Fi</p>
                                        <p className="text-muted-foreground">{ant.coverage}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-border">
                                    <p className="text-foreground text-xs font-semibold mb-2">Uso ideal</p>
                                    <div className="flex flex-wrap gap-2">
                                        {ant.idealFor.map((u) => (
                                            <span key={u} className="text-muted-foreground text-[11px] bg-background border border-border rounded px-2 py-0.5">
                                                {u}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={() => setSelectedPlan({ planNombre: ant.name, planPrecio: ant.price, tipoServicio: "antena" })}
                                    className="mt-6 w-full bg-foreground text-background py-3 rounded text-xs font-bold tracking-widest uppercase hover:bg-foreground/90 transition-all"
                                >
                                    ADQUIRIR ANTENA
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Internet Plans */}
                    <div>
                        <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium mb-4">
                            📡 Planes de Internet para Antena
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {internetPlans.map((plan) => (
                                <div key={plan.name} className="bg-card border border-border rounded-lg p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-foreground font-bold text-sm tracking-wide">
                                            🔹 {plan.name}
                                        </h4>
                                        <span className="text-foreground font-bold text-lg">{plan.price}</span>
                                    </div>
                                    <p className="text-foreground text-xs font-semibold mb-1">{plan.speed}</p>
                                    <p className="text-muted-foreground text-xs leading-relaxed">{plan.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {selectedPlan && (
                <AcquirePlanModal
                    plan={selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                />
            )}
        </>
    );
};

export default AntennaSection;
