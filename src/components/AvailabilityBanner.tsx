const AvailabilityBanner = () => {
  return (
    <section className="bg-background py-16 text-center">
      <p className="text-muted-foreground text-sm tracking-wider uppercase">
        Conectividad rápida donde la necesites, cuando la necesites
      </p>
      <p className="text-foreground text-lg md:text-xl font-medium mt-3">
        Disponible en más de 150 países, territorios y mercados alrededor del mundo
      </p>
      <a
        href="#cobertura"
        className="inline-flex items-center gap-1 text-foreground text-sm mt-4 underline underline-offset-4 hover:text-muted-foreground transition-colors"
      >
        Consulta disponibilidad y planes en tu zona ›
      </a>
    </section>
  );
};

export default AvailabilityBanner;
