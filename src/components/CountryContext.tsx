import { createContext, useContext, ReactNode } from "react";
import { useCountry, CountryCode } from "@/hooks/useCountry";

interface CountryContextValue {
    country: CountryCode;
    setCountry: (c: CountryCode) => void;
    loading: boolean;
}

const CountryContext = createContext<CountryContextValue>({
    country: "HN",
    setCountry: () => { },
    loading: false,
});

export function CountryProvider({ children }: { children: ReactNode }) {
    const value = useCountry();
    return <CountryContext.Provider value={value}>{children}</CountryContext.Provider>;
}

export function useCountryContext() {
    return useContext(CountryContext);
}

export const countryNames: Record<CountryCode, string> = {
    EC: "Ecuador",
    HN: "Honduras",
    PE: "Perú",
};

export const countryFlags: Record<CountryCode, string> = {
    EC: "🇪🇨",
    HN: "🇭🇳",
    PE: "🇵🇪",
};
