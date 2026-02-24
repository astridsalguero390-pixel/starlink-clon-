import { useState, useEffect } from "react";

export type CountryCode = "EC" | "HN" | "PE" | "CO";

const STORAGE_KEY = "starlink_country";
const SUPPORTED: CountryCode[] = ["EC", "HN", "PE", "CO"];
const DEFAULT_COUNTRY: CountryCode = "HN";

async function detectCountry(): Promise<CountryCode> {
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
    const data = await res.json();
    const code = (data.country_code as string)?.toUpperCase();
    if (SUPPORTED.includes(code as CountryCode)) return code as CountryCode;
  } catch (_) {
    // silently fall back
  }
  return DEFAULT_COUNTRY;
}

export function useCountry() {
  const stored = localStorage.getItem(STORAGE_KEY) as CountryCode | null;
  const [country, setCountryState] = useState<CountryCode>(
    stored && SUPPORTED.includes(stored) ? stored : DEFAULT_COUNTRY
  );
  const [loading, setLoading] = useState(!stored);

  useEffect(() => {
    if (stored && SUPPORTED.includes(stored)) return; // use manual override
    setLoading(true);
    detectCountry().then((c) => {
      setCountryState(c);
      setLoading(false);
    });
  }, []);

  const setCountry = (c: CountryCode) => {
    localStorage.setItem(STORAGE_KEY, c);
    setCountryState(c);
  };

  return { country, setCountry, loading };
}
