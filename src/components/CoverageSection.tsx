import coverageMap from "@/assets/coverage-map.jpg";

const CoverageSection = () => {
  return (
    <section id="coverage" className="bg-background py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-foreground text-3xl md:text-5xl font-bold text-center tracking-tight">
          Cobertura en expansión
        </h2>
        <p className="text-muted-foreground text-center mt-4 max-w-xl mx-auto text-lg">
          Starlink cubre más de 100 países y sigue creciendo cada día. Verifica la disponibilidad en tu zona.
        </p>

        <div className="mt-12 relative rounded-xl overflow-hidden border border-border">
          <img
            src={coverageMap}
            alt="Mapa de cobertura global de Starlink"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Address input overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-6">
            <div className="bg-card/90 backdrop-blur-md border border-border rounded-lg p-4 flex gap-3">
              <input
                type="text"
                placeholder="Ingresa tu dirección"
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
              />
              <button className="bg-primary text-primary-foreground px-5 py-2 rounded text-sm font-semibold shrink-0 hover:opacity-90 transition-opacity">
                VERIFICAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoverageSection;
