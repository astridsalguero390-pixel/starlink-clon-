import starlinkKit from "@/assets/starlink-kit.jpg";

const KitSection = () => {
  return (
    <section className="bg-section-gradient py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div className="relative order-2 md:order-1">
          <img
            src={starlinkKit}
            alt="Kit Starlink con antena y router"
            className="rounded-xl w-full object-cover shadow-2xl"
            loading="lazy"
          />
          <div className="absolute -inset-1 rounded-xl bg-accent/10 blur-3xl -z-10" />
        </div>

        {/* Content */}
        <div className="order-1 md:order-2">
          <h2 className="text-foreground text-3xl md:text-5xl font-bold tracking-tight">
            Kit Starlink
          </h2>
          <p className="text-muted-foreground text-lg mt-6 leading-relaxed">
            Todo lo que necesitas en una caja. La antena Starlink se conecta automáticamente a los satélites
            y proporciona internet de alta velocidad en minutos.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "Antena Starlink de alto rendimiento",
              "Router Wi-Fi integrado",
              "Cable de alimentación y base",
              "Guía de instalación rápida",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-secondary-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-baseline gap-3">
            <span className="text-foreground text-4xl font-bold">$599</span>
            <span className="text-muted-foreground text-sm">USD + envío</span>
          </div>

          <a
            href="#"
            className="inline-block mt-6 bg-primary text-primary-foreground px-8 py-3.5 rounded text-sm font-semibold tracking-wider hover:opacity-90 transition-opacity"
          >
            ORDENAR AHORA
          </a>
        </div>
      </div>
    </section>
  );
};

export default KitSection;
