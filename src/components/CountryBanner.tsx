import { useState } from "react";
import { useCountryContext, countryNames, countryFlags } from "./CountryContext";
import { CountryCode } from "@/hooks/useCountry";
import { ChevronDown } from "lucide-react";

const countries: CountryCode[] = ["EC", "HN", "PE"];

const CountryBanner = () => {
    const { country, setCountry } = useCountryContext();
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-card border-b border-border py-2 px-6 flex items-center justify-center gap-3 text-xs tracking-wide relative z-40">
            <span className="text-muted-foreground">
                {countryFlags[country]}{" "}
                <span className="text-foreground font-medium">{countryNames[country]}</span>
            </span>
            <div className="relative">
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-medium border border-border rounded px-2 py-0.5"
                >
                    Cambiar <ChevronDown size={12} />
                </button>
                {open && (
                    <div className="absolute top-7 left-0 bg-card border border-border rounded shadow-lg z-50 min-w-[140px]">
                        {countries.map((c) => (
                            <button
                                key={c}
                                onClick={() => { setCountry(c); setOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-xs hover:bg-border transition-colors flex items-center gap-2 ${country === c ? "text-foreground font-semibold" : "text-muted-foreground"
                                    }`}
                            >
                                {countryFlags[c]} {countryNames[c]}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CountryBanner;
