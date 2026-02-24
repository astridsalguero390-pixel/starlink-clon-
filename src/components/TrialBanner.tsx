const TrialBanner = () => {
  return (
    <section className="bg-background py-20 text-center">
      <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium">
        PRUEBA DE 30 DÍAS
      </p>
      <p className="text-foreground text-xl md:text-2xl font-medium mt-3 max-w-lg mx-auto">
        Si no quedas satisfecho, devuelve Starlink para un reembolso completo.
      </p>

      <div className="max-w-md mx-auto px-6 mt-10">
        <div className="flex gap-0">
          <input
            type="text"
            placeholder="Dirección de servicio"
            className="flex-1 bg-card border border-border rounded-l px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-foreground/30 transition-colors"
          />
          <button className="bg-foreground text-background px-6 py-3 rounded-r text-sm font-semibold tracking-wider shrink-0 hover:bg-foreground/90 transition-colors">
            COMENZAR
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrialBanner;
