import heroImage from "@/assets/hero-starlink.jpg";
import { Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden">
      <img
        src={heroImage}
        alt="Constelación de satélites Starlink orbitando la Tierra con antena en primer plano"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <h1 className="text-foreground text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight opacity-0 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          INTERNET DE ALTA VELOCIDAD
          <br />
          DESDE EL ESPACIO
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg md:text-xl mt-6 max-w-xl font-light opacity-0 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          Conéctate en casa o en movimiento
          <br />
          Consulta las <span className="text-foreground font-medium underline underline-offset-4 cursor-pointer">velocidades</span> en tu país
        </p>

        <button className="flex items-center gap-2 mt-8 text-foreground text-xs tracking-[0.2em] font-semibold opacity-0 animate-fade-in-up hover:text-muted-foreground transition-colors" style={{ animationDelay: "0.8s" }}>
          VER AHORA
          <Play size={18} className="fill-foreground" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent pt-20 pb-8">
        <div className="max-w-md mx-auto px-6">
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
          <a href="#cobertura" className="flex items-center justify-center gap-1 mt-3 text-muted-foreground text-xs tracking-wider hover:text-foreground transition-colors">
            Ver mapa de disponibilidad y velocidades ›
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
