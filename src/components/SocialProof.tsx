import { useState, useEffect } from "react";
import { useCountryContext } from "./CountryContext";
import { CountryCode } from "@/hooks/useCountry";

const data: Record<CountryCode, { name: string; city: string }[]> = {
    EC: [
        { name: "Andrés M.", city: "Quito" },
        { name: "Valeria T.", city: "Guayaquil" },
        { name: "Carlos R.", city: "Cuenca" },
        { name: "Gabriela P.", city: "Manta" },
        { name: "Diego S.", city: "Ambato" },
        { name: "Fernanda L.", city: "Loja" },
        { name: "Sebastián V.", city: "Esmeraldas" },
        { name: "Karina O.", city: "Santo Domingo" },
        { name: "Rodrigo H.", city: "Riobamba" },
        { name: "Luisa C.", city: "Ibarra" },
    ],
    HN: [
        { name: "José M.", city: "Tegucigalpa" },
        { name: "María F.", city: "San Pedro Sula" },
        { name: "Carlos A.", city: "La Ceiba" },
        { name: "Rosa E.", city: "Choluteca" },
        { name: "Luis H.", city: "Comayagua" },
        { name: "Ana G.", city: "Puerto Cortés" },
        { name: "Pedro R.", city: "Siguatepeque" },
        { name: "Elena B.", city: "Juticalpa" },
        { name: "Omar Z.", city: "Roatán" },
        { name: "Silvia V.", city: "Danlí" },
    ],
    PE: [
        { name: "Miguel Á.", city: "Lima" },
        { name: "Lucía R.", city: "Arequipa" },
        { name: "Jorge C.", city: "Cusco" },
        { name: "Patricia F.", city: "Trujillo" },
        { name: "Óscar M.", city: "Piura" },
        { name: "Yolanda T.", city: "Iquitos" },
        { name: "Raúl S.", city: "Chiclayo" },
        { name: "Cynthia V.", city: "Pucallpa" },
        { name: "Fernando L.", city: "Ayacucho" },
        { name: "Mónica H.", city: "Huancayo" },
    ],
};

const products = [
    "Antena Starlink Mini",
    "Antena Starlink Estándar",
    "SIM Card Satelital — Plan Anual",
    "SIM Card Satelital — Plan 6 Meses",
];

function getRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function minsAgo() {
    const m = Math.floor(Math.random() * 55) + 3;
    return `Hace ${m} min`;
}

interface Notif {
    name: string;
    city: string;
    product: string;
    time: string;
}

const SocialProof = () => {
    const { country } = useCountryContext();
    const [notif, setNotif] = useState<Notif | null>(null);
    const [visible, setVisible] = useState(false);

    const show = () => {
        const person = getRandom(data[country]);
        setNotif({ ...person, product: getRandom(products), time: minsAgo() });
        setVisible(true);
        setTimeout(() => setVisible(false), 5000);
    };

    useEffect(() => {
        // First notification after 4s
        const first = setTimeout(show, 4000);
        // Then repeat every 12s
        const interval = setInterval(show, 12000);
        return () => { clearTimeout(first); clearInterval(interval); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [country]);

    if (!notif) return null;

    return (
        <div
            style={{ transition: "opacity 0.4s ease, transform 0.4s ease" }}
            className={`fixed bottom-6 left-4 z-[999] max-w-[280px] pointer-events-none ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
        >
            <div className="bg-card border border-border rounded-lg shadow-xl px-4 py-3 flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">🛒</span>
                <div>
                    <p className="text-foreground text-xs font-semibold leading-snug">
                        {notif.name} de {notif.city}
                    </p>
                    <p className="text-muted-foreground text-[11px] mt-0.5 leading-snug">
                        compró <span className="text-foreground font-medium">{notif.product}</span>
                    </p>
                    <p className="text-muted-foreground text-[10px] mt-1">{notif.time}</p>
                </div>
            </div>
        </div>
    );
};

export default SocialProof;
