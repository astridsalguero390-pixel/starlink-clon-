import { Link } from "react-router-dom";
import { useCountryContext, countryNames, countryFlags } from "./CountryContext";

const products = [
  {
    title: "SIM CARD SATELITAL",
    subtitle: "Chip Starlink — llamadas, mensajes e internet satelital",
    description: "Señal donde otros no llegan. Compatible con cualquier celular.",
    id: "simcard",
    href: "/satelital",
  },
  {
    title: "ANTENA STARLINK",
    subtitle: "Mini y Estándar — internet de alta velocidad en casa",
    description: "Desde $180 · Instalación en minutos · Envíos garantizados.",
    id: "antena",
    href: "/antena",
  },
];

const ProductCards = () => {
  const { country } = useCountryContext();

  return (
    <section className="bg-background py-0 -mt-2">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase font-medium py-5">
          {countryFlags[country]} {countryNames[country]}
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p.id} id={p.id} className="bg-card border border-border rounded-lg p-8 md:p-10">
              <h2 className="text-foreground text-2xl md:text-3xl font-bold tracking-tight">{p.title}</h2>
              <p className="text-muted-foreground text-sm mt-2">{p.subtitle}</p>
              <p className="text-foreground text-sm font-semibold mt-4">{p.description}</p>
              <div className="flex gap-3 mt-6">
                <Link
                  to={p.href}
                  className="bg-foreground text-background px-5 py-2.5 rounded text-xs font-semibold tracking-wider hover:bg-foreground/90 transition-colors"
                >
                  VER PLANES
                </Link>
                <Link
                  to={p.href}
                  className="border border-foreground/30 text-foreground px-5 py-2.5 rounded text-xs font-semibold tracking-wider hover:bg-foreground/10 transition-colors"
                >
                  MÁS INFO
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCards;
