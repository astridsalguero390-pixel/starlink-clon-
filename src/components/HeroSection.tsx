import heroImage from "@/assets/hero-starlink.jpg";
import { Play, ShoppingCart, FileText, Package, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [buyOpen, setBuyOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden">
      <img
        src={heroImage}
        alt="Constelación de satélites Starlink orbitando la Tierra con antena en primer plano"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80 pointer-events-none" />

      <div className="relative z-30 flex flex-col items-center justify-center h-full px-6 text-center pb-20 sm:pb-0">
        <h1
          className="text-foreground text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          INTERNET DE ALTA VELOCIDAD
          <br />
          DESDE EL ESPACIO
        </h1>

        <p
          className="text-muted-foreground text-base sm:text-lg md:text-xl mt-6 max-w-xl font-light opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.5s" }}
        >
          Conéctate en casa o en movimiento
          <br />
          Señal satelital donde otros no llegan
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <Link
            to="/validar-asesor"
            className="flex items-center gap-2 text-foreground text-[10px] sm:text-xs tracking-[0.2em] font-semibold hover:text-muted-foreground transition-colors group"
          >
            VALIDAR ASESOR
            <Play size={16} className="fill-foreground transition-transform group-hover:scale-110" />
          </Link>
          <Link
            to="/pagar-factura"
            className="flex items-center gap-2 text-foreground text-[10px] sm:text-xs tracking-[0.2em] border border-foreground/30 px-5 py-2.5 rounded-full font-semibold hover:bg-foreground/10 transition-all hover:border-foreground"
          >
            PAGAR FACTURA
            <Play size={16} className="fill-foreground ml-1" />
          </Link>
        </div>
      </div>

      {/* Bottom CTA bar */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-background via-background/95 to-transparent pt-32 pb-8 pointer-events-none">
        <div className="max-w-3xl mx-auto px-6 pointer-events-auto">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">

            {/* COMPRAR SERVICIO */}
            <div className="relative">
              <button
                onClick={() => setBuyOpen((o) => !o)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded text-sm font-semibold tracking-wider hover:bg-foreground/90 transition-colors"
              >
                <ShoppingCart size={16} />
                COMPRAR SERVICIO
                <ChevronDown size={14} className={`transition-transform ${buyOpen ? "rotate-180" : ""}`} />
              </button>

              {buyOpen && (
                <div
                  className="absolute bottom-14 left-0 sm:left-1/2 sm:-translate-x-1/2 bg-card border border-border rounded-lg shadow-xl z-50 min-w-[220px] overflow-hidden"
                  onMouseLeave={() => setBuyOpen(false)}
                >
                  <Link
                    to="/satelital"
                    onClick={() => setBuyOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-border transition-colors border-b border-border"
                  >
                    <span className="text-xl">📱</span>
                    <div className="text-left">
                      <p className="text-foreground text-sm font-semibold">Móvil — SIM Card</p>
                      <p className="text-muted-foreground text-xs">Llamadas, SMS e internet</p>
                    </div>
                  </Link>
                  <Link
                    to="/antena"
                    onClick={() => setBuyOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 hover:bg-border transition-colors"
                  >
                    <span className="text-xl">📡</span>
                    <div className="text-left">
                      <p className="text-foreground text-sm font-semibold">Satelital — Antena</p>
                      <p className="text-muted-foreground text-xs">Internet de alta velocidad</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* VERIFICAR CONTRATO */}
            <button
              onClick={() => navigate("/verificar-contrato")}
              className="flex items-center justify-center gap-2 border border-foreground/40 text-foreground px-6 py-3 rounded text-sm font-semibold tracking-wider hover:bg-foreground/10 transition-colors"
            >
              <FileText size={16} />
              VERIFICAR CONTRATO
            </button>

            {/* ESTADO DEL PEDIDO */}
            <button
              onClick={() => navigate("/estado-pedido")}
              className="flex items-center justify-center gap-2 border border-foreground/40 text-foreground px-6 py-3 rounded text-sm font-semibold tracking-wider hover:bg-foreground/10 transition-colors"
            >
              <Package size={16} />
              ESTADO DEL PEDIDO
            </button>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
