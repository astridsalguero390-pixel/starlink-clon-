import heroImage from "@/assets/hero-space.jpg";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background image */}
      <img
        src={heroImage}
        alt="Constelación de satélites Starlink orbitando la Tierra"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <h1
          className="text-foreground text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          STARLINK
        </h1>
        <p
          className="text-muted-foreground text-lg sm:text-xl md:text-2xl mt-4 max-w-2xl font-light opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          Internet de alta velocidad en cualquier lugar del mundo
        </p>
        <div
          className="flex flex-col sm:flex-row gap-4 mt-10 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          <a
            href="#"
            className="bg-primary text-primary-foreground px-8 py-3.5 rounded text-sm font-semibold tracking-wider hover:opacity-90 transition-opacity"
          >
            ORDENAR AHORA
          </a>
          <a
            href="#specs"
            className="border border-foreground/30 text-foreground px-8 py-3.5 rounded text-sm font-semibold tracking-wider hover:bg-foreground/10 transition-colors"
          >
            MÁS INFORMACIÓN
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "1.5s" }}>
        <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 bg-foreground/50 rounded-full animate-pulse-glow" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
