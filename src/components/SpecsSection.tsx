import { Wifi, Zap, Globe, Clock } from "lucide-react";

const specs = [
  {
    icon: Zap,
    title: "Velocidad Ultra Rápida",
    desc: "Velocidades de descarga de hasta 220 Mbps con latencia tan baja como 20ms.",
  },
  {
    icon: Wifi,
    title: "Sin Cables, Sin Límites",
    desc: "Internet satelital que funciona en cualquier lugar. Sin necesidad de infraestructura terrestre.",
  },
  {
    icon: Globe,
    title: "Cobertura Global",
    desc: "Más de 7,000 satélites cubriendo más de 100 países en todo el mundo.",
  },
  {
    icon: Clock,
    title: "Configuración en Minutos",
    desc: "Instala tu kit Starlink en minutos. Plug and play sin técnicos necesarios.",
  },
];

const SpecsSection = () => {
  return (
    <section id="specs" className="bg-section-gradient py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-foreground text-3xl md:text-5xl font-bold text-center tracking-tight">
          Internet sin compromisos
        </h2>
        <p className="text-muted-foreground text-center mt-4 max-w-xl mx-auto text-lg">
          Tecnología de punta que lleva internet de alta velocidad hasta los rincones más remotos del planeta.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {specs.map((spec, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-lg p-8 hover:border-glow transition-all duration-300 group glow-blue hover:glow-blue"
            >
              <spec.icon className="w-8 h-8 text-accent mb-5 group-hover:scale-110 transition-transform" />
              <h3 className="text-foreground text-lg font-semibold mb-2">{spec.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{spec.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecsSection;
