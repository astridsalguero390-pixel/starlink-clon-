import { useState } from "react";
import { useCountryContext, countryFlags, countryNames } from "./CountryContext";
import { CountryCode } from "@/hooks/useCountry";
import AcquirePlanModal, { PlanInfo } from "./AcquirePlanModal";

interface Plan {
    name: string;
    price: string;
    period?: string;
    monthlyEquiv?: string;
    savings?: string;
    bonus?: string;
    chipNote?: string;
    benefits: string[];
    highlight?: boolean;
}

const plansByCountry: Record<CountryCode, Plan[]> = {
    EC: [
        {
            name: "Plan Mensual",
            price: "$15.50",
            period: "/mes",
            chipNote: "+ $27.50 chip de activación (pago único)",
            benefits: [
                "✅ Internet ilimitado",
                "✅ Señal estable donde sea",
                "✅ Llamadas y mensajes",
                "✅ Ideal para probar el servicio",
            ],
        },
        {
            name: "Plan 6 Meses",
            price: "$49",
            period: "",
            monthlyEquiv: "Solo $8.17/mes",
            savings: "Ahorras $44",
            benefits: [
                "✅ Internet + llamadas + mensajes ilimitados",
                "✅ Señal satelital en todo el país",
                "✅ Pagas una vez y te olvidas de recargar",
            ],
            highlight: true,
        },
        {
            name: "Plan Anual",
            price: "$85",
            period: "",
            monthlyEquiv: "Solo $7.08/mes",
            savings: "Ahorras $101",
            benefits: [
                "✅ Internet, llamadas y mensajes ilimitados",
                "✅ Conexión continua todo el año",
                "✅ Sin pagos mensuales",
            ],
        },
        {
            name: "Plan 2 Años",
            price: "$135",
            period: "",
            monthlyEquiv: "Solo $5.62/mes",
            savings: "Máximo ahorro",
            benefits: [
                "✅ Internet, llamadas y mensajes ilimitados",
                "✅ Conexión garantizada por 24 meses",
                "✅ Sin pagos mensuales",
            ],
        },
    ],
    HN: [
        {
            name: "Plan 1 Mes",
            price: "L 650",
            period: "/mes",
            chipNote: "+ L 450 chip de activación (pago único)",
            benefits: [
                "✅ 80 GB de internet",
                "✅ 500 minutos de llamadas",
                "✅ 400 SMS",
                "✅ Sin recargos ni cambios de plan",
            ],
        },
        {
            name: "Plan 3 Meses",
            price: "L 1,500",
            period: "",
            monthlyEquiv: "Solo L 500/mes",
            savings: "Ahorras L 450",
            benefits: [
                "✅ 290 GB de internet",
                "✅ 1,900 minutos de llamadas",
                "✅ 1,500 SMS",
                "✅ Sin recargos ni cambios de plan",
            ],
        },
        {
            name: "Plan 6 Meses",
            price: "L 2,500",
            period: "",
            monthlyEquiv: "Solo L 417/mes",
            bonus: "🎁 2 meses GRATIS",
            benefits: [
                "✅ 650 GB de internet",
                "✅ 4,200 minutos de llamadas",
                "✅ 4,000 SMS",
                "✅ Ideal para compartir internet",
            ],
            highlight: true,
        },
        {
            name: "Plan 1 Año",
            price: "L 3,600",
            period: "",
            monthlyEquiv: "Solo L 300/mes",
            bonus: "🎁 6 meses adicionales GRATIS",
            benefits: [
                "✅ Internet ilimitado",
                "✅ Minutos y mensajes ilimitados",
                "✅ Ideal para compartir internet",
            ],
        },
        {
            name: "Plan 2 Años",
            price: "L 4,700",
            period: "",
            monthlyEquiv: "Solo L 196/mes",
            bonus: "🎁 1 año adicional GRATIS",
            benefits: [
                "✅ Internet ilimitado",
                "✅ Minutos y mensajes ilimitados",
                "✅ Funciona en cualquier país 🌍",
                "✅ Ideal para toda la familia",
            ],
        },
    ],
    PE: [
        {
            name: "Plan 1 Mes",
            price: "80 S/.",
            period: "/mes",
            chipNote: "+ 70 S/. chip de activación (pago único)",
            benefits: [
                "✅ Internet ilimitado",
                "✅ Señal estable donde sea",
                "✅ Llamadas y mensajes",
                "✅ Ideal para probar el servicio",
            ],
        },
        {
            name: "Plan 3 Meses",
            price: "190 S/.",
            period: "",
            monthlyEquiv: "~63 S/./mes",
            benefits: [
                "✅ Internet + llamadas + mensajes ilimitados",
                "✅ Señal satelital en todo el país",
                "✅ Ahorra frente al plan mensual",
            ],
        },
        {
            name: "Plan 6 Meses",
            price: "290 S/.",
            period: "",
            monthlyEquiv: "~48 S/./mes",
            savings: "Mayor ahorro",
            bonus: "🎁 +2 meses GRATIS",
            benefits: [
                "✅ Internet + llamadas + mensajes ilimitados",
                "✅ Señal en zonas urbanas, rurales y alta mar",
                "✅ Pagas una vez y te olvidas",
            ],
            highlight: true,
        },
        {
            name: "Plan 1 Año",
            price: "380 S/.",
            period: "",
            monthlyEquiv: "~32 S/./mes",
            savings: "Mejor precio",
            bonus: "🎁 +3 meses GRATIS",
            benefits: [
                "✅ Internet, llamadas y mensajes ilimitados",
                "✅ Conexión continua todo el año",
                "✅ Sin pagos mensuales",
            ],
        },
        {
            name: "Plan 2 Años",
            price: "600 S/.",
            period: "",
            monthlyEquiv: "~25 S/./mes",
            savings: "Máximo ahorro",
            bonus: "🎁 +4 meses GRATIS",
            benefits: [
                "✅ Internet, llamadas y mensajes ilimitados",
                "✅ Garantía 24 meses continuos",
                "✅ Sin pagos mensuales",
            ],
        },
    ],
    CO: [
        {
            name: "Plan Mensual",
            price: "$62.000 COP",
            period: "/mes",
            chipNote: "+ $110.000 COP chip de activación (pago único)",
            benefits: [
                "✅ Internet ilimitado",
                "✅ Señal estable donde sea",
                "✅ Llamadas y mensajes",
                "✅ Ideal para probar el servicio",
            ],
        },
        {
            name: "Plan 6 Meses",
            price: "$196.000 COP",
            period: "",
            monthlyEquiv: "Solo $32.700 COP/mes",
            savings: "Ahorras $176.000 COP",
            bonus: "🎁 +2 meses GRATIS",
            benefits: [
                "✅ Internet + llamadas + mensajes ilimitados",
                "✅ Señal satelital en todo el país",
                "✅ Pagas una vez y te olvidas de recargar",
            ],
            highlight: true,
        },
        {
            name: "Plan Anual",
            price: "$340.000 COP",
            period: "",
            monthlyEquiv: "Solo $28.300 COP/mes",
            savings: "Ahorras $404.000 COP",
            bonus: "🎁 +3 meses GRATIS",
            benefits: [
                "✅ Internet, llamadas y mensajes ilimitados",
                "✅ Conexión continua todo el año",
                "✅ Sin pagos mensuales",
            ],
        },
        {
            name: "Plan 2 Años",
            price: "$540.000 COP",
            period: "",
            monthlyEquiv: "Solo $22.500 COP/mes",
            savings: "Máximo ahorro",
            bonus: "🎁 +4 meses GRATIS",
            benefits: [
                "✅ Internet, llamadas y mensajes ilimitados",
                "✅ Conexión garantizada por 24 meses",
                "✅ Sin pagos mensuales",
            ],
        },
    ],
};

const PlansSection = () => {
    const { country } = useCountryContext();
    const plans = plansByCountry[country];
    const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);

    return (
        <>
            <section id="planes" className="bg-background py-16 px-6">
                <div className="max-w-[1200px] mx-auto">
                    {/* Header */}
                    <div className="mb-10">
                        <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium mb-2">
                            📡 SIM Card Satelital
                        </p>
                        <h2 className="text-foreground text-3xl md:text-4xl font-bold tracking-tight">
                            Planes para {countryFlags[country]} {countryNames[country]}
                        </h2>
                        <p className="text-muted-foreground text-sm mt-3 max-w-2xl leading-relaxed">
                            Señal satelital real donde otros no llegan. Cobertura en zonas rurales, ciudades, selvas, montañas y alta mar.
                            Compatible con <strong className="text-foreground">cualquier celular</strong> — básico o smartphone.
                        </p>
                    </div>

                    {/* Coverage badges */}
                    <div className="flex flex-wrap gap-2 mb-10">
                        {["🌿 Zonas rurales", "🏙️ Ciudades", "🌴 Selvas y fincas", "⛰️ Montañas", "🌊 Alta mar"].map((badge) => (
                            <span key={badge} className="bg-card border border-border text-muted-foreground text-xs px-3 py-1 rounded-full">
                                {badge}
                            </span>
                        ))}
                    </div>

                    {/* Plan cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative bg-card border rounded-lg p-6 flex flex-col gap-3 ${plan.highlight
                                    ? "border-foreground/40 ring-1 ring-foreground/20"
                                    : "border-border"
                                    }`}
                            >
                                {plan.highlight && (
                                    <span className="absolute -top-3 left-4 bg-foreground text-background text-[10px] font-bold tracking-widest px-3 py-0.5 rounded-full uppercase">
                                        Más popular
                                    </span>
                                )}

                                <p className="text-muted-foreground text-xs tracking-widest uppercase font-medium">
                                    {plan.name}
                                </p>

                                <div className="flex items-end gap-1">
                                    <span className="text-foreground text-3xl font-bold">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-muted-foreground text-sm mb-1">{plan.period}</span>
                                    )}
                                </div>

                                {plan.chipNote && (
                                    <p className="text-muted-foreground text-[11px] leading-tight -mt-1 border border-border/60 rounded px-2 py-1 w-fit">
                                        🔑 {plan.chipNote}
                                    </p>
                                )}

                                <div className="flex flex-col gap-1">
                                    {plan.monthlyEquiv && (
                                        <span className="text-muted-foreground text-xs">{plan.monthlyEquiv}</span>
                                    )}
                                    {plan.savings && (
                                        <span className="text-foreground text-xs font-semibold bg-foreground/10 px-2 py-0.5 rounded w-fit">
                                            💰 {plan.savings}
                                        </span>
                                    )}
                                    {plan.bonus && (
                                        <span className="text-foreground text-xs font-bold tracking-wide">
                                            {plan.bonus}
                                        </span>
                                    )}
                                </div>

                                <ul className="space-y-1.5 mt-2 flex-1">
                                    {plan.benefits.map((b, i) => (
                                        <li key={i} className="text-muted-foreground text-xs leading-relaxed">
                                            {b}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button
                                    onClick={() => setSelectedPlan({ planNombre: plan.name, planPrecio: plan.price + (plan.period ?? ""), tipoServicio: "sim" })}
                                    className={`mt-3 w-full py-2.5 rounded text-xs font-bold tracking-widest uppercase transition-all ${plan.highlight
                                        ? "bg-foreground text-background hover:bg-foreground/90"
                                        : "border border-foreground/40 text-foreground hover:bg-foreground/10"
                                        }`}
                                >
                                    ADQUIRIR PLAN
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Number selection notice */}
                    <div className="mt-10 bg-card border border-border rounded-lg p-6">
                        <p className="text-foreground text-sm font-semibold mb-3">📌 Activación de número</p>
                        <div className="grid md:grid-cols-2 gap-4 text-xs text-muted-foreground leading-relaxed">
                            <div>
                                <p className="text-foreground font-medium mb-1">✔️ Conservar tu número actual</p>
                                Realizamos la portabilidad 100% segura. Tu operador anterior cancela automáticamente el chip anterior. Tu número no se pierde.
                            </div>
                            <div>
                                <p className="text-foreground font-medium mb-1">✔️ Recibir un número nuevo</p>
                                Se te asigna un número nuevo de inmediato. Tu línea actual no se ve afectada y puedes seguir usándola con normalidad.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal */}
            {selectedPlan && (
                <AcquirePlanModal
                    plan={selectedPlan}
                    onClose={() => setSelectedPlan(null)}
                />
            )}
        </>
    );
};

export default PlansSection;
