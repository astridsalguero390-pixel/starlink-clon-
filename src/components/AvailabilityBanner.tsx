import { Link } from "react-router-dom";

const AvailabilityBanner = () => {
  return (
    <section className="bg-background py-16 text-center" id="cobertura">
      <p className="text-muted-foreground text-sm tracking-wider uppercase">
        Conectividad rápida donde la necesites, cuando la necesites
      </p>
      <p className="text-foreground text-lg md:text-xl font-medium mt-3">
        Disponible en todo Ecuador, Honduras y Perú — ciudad, campo y alta mar
      </p>
      <Link
        to="/cobertura"
        className="inline-flex items-center gap-1 text-foreground text-sm mt-4 underline underline-offset-4 hover:text-muted-foreground transition-colors"
      >
        Consulta disponibilidad y planes en tu zona ›
      </Link>
    </section>
  );
};

export default AvailabilityBanner;
