import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCountryContext, countryNames, countryFlags } from "./CountryContext";

const MENU_ITEMS = [
  { label: "INICIAR SESIÓN", href: "/admin" },
  { label: "CENTRO DE AYUDA", href: "/verificar-contrato" },
  { label: "MAPA DE DISPONIBILIDAD", href: "/cobertura" },
  { label: "ESPECIFICACIONES", href: "/antena" },
  { label: "PLANES DE SERVICIO", href: "/satelital" },
  { label: "GUÍAS EN VIDEO", href: "/satelital" },
  { label: "TECNOLOGÍA", href: "/antena" },
  { label: "NOVEDADES", href: "/" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "empresas">("personal");
  const [scrolled, setScrolled] = useState(false);
  const { country } = useCountryContext();

  // Detect scroll to add solid background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setMobileOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled || mobileOpen ? "bg-background/98 backdrop-blur-md" : "bg-transparent"
          }`}
      >
        {/* Promo banner */}
        <div className="border-b border-border/60 py-2.5 text-center">
          <p className="text-foreground text-sm font-medium">
            {countryFlags[country]}{" "}
            <span className="font-bold">{countryNames[country]}</span>{" "}
            <span className="text-muted-foreground">— Envíos a todo el país</span>
          </p>
        </div>

        {/* Main nav bar */}
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: logo + nav links */}
          <div className="flex items-center gap-10">
            <Link to="/" className="text-foreground font-bold text-lg tracking-[0.35em]">
              STARLINK
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link to="/satelital" className="text-foreground text-xs tracking-[0.2em] font-medium hover:text-muted-foreground transition-colors">
                SATELITAL
              </Link>
              <Link to="/antena" className="text-foreground text-xs tracking-[0.2em] font-medium hover:text-muted-foreground transition-colors">
                ANTENA
              </Link>
            </div>
          </div>

          {/* Right: PERSONAL | EMPRESAS + hamburger */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab("personal")}
                className={`text-xs tracking-[0.15em] font-medium px-3 py-1.5 transition-colors ${activeTab === "personal" ? "text-foreground underline underline-offset-4" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                PERSONAL
              </button>
              <span className="text-border">|</span>
              <button
                onClick={() => setActiveTab("empresas")}
                className={`text-xs tracking-[0.15em] font-medium px-3 py-1.5 transition-colors ${activeTab === "empresas" ? "text-foreground underline underline-offset-4" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                EMPRESAS
              </button>
            </div>

            {/* Hamburger — visible always */}
            <button
              className="text-foreground p-1.5 hover:text-muted-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menú"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen slide-in menu */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={close}
      >
        {/* Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-xs bg-background border-l border-border flex flex-col pt-28 pb-10 px-8 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Country indicator */}
          <div className="flex items-center gap-2 mb-8 text-muted-foreground text-xs font-medium tracking-widest uppercase">
            <span>{countryFlags[country]}</span>
            <span className="text-foreground">{country}</span>
            <span>🌐</span>
          </div>

          {/* Menu items */}
          <nav className="flex flex-col gap-0">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={close}
                className="text-foreground text-sm font-semibold tracking-[0.15em] py-4 border-b border-border/40 hover:text-muted-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Bottom: PERSONAL | EMPRESAS */}
          <div className="mt-auto flex items-center gap-4 pt-6 border-t border-border">
            <button
              onClick={() => { setActiveTab("personal"); close(); }}
              className={`text-xs tracking-[0.15em] font-bold transition-colors ${activeTab === "personal" ? "text-foreground underline underline-offset-4" : "text-muted-foreground"}`}
            >
              PERSONAL
            </button>
            <span className="text-border">|</span>
            <button
              onClick={() => { setActiveTab("empresas"); close(); }}
              className={`text-xs tracking-[0.15em] font-bold transition-colors ${activeTab === "empresas" ? "text-foreground underline underline-offset-4" : "text-muted-foreground"}`}
            >
              EMPRESAS
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
