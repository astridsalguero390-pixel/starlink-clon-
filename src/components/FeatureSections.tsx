import featureReliability from "@/assets/feature-reliability.jpg";
import featureSpeeds from "@/assets/feature-speeds.jpg";
import featureMini from "@/assets/feature-mini.jpg";
import featureInstall from "@/assets/feature-install.jpg";
import featurePlans from "@/assets/feature-plans.jpg";
import featureSpacex from "@/assets/feature-spacex.jpg";

interface Feature {
  image: string;
  title: string;
  description: string;
  link?: { text: string; href: string };
  steps?: { num: string; text: string }[];
}

const features: Feature[] = [
  {
    image: featureReliability,
    title: "Confiable y resistente",
    description:
      "Starlink ofrece internet de alta velocidad y baja latencia con más del 99.9% de tiempo de actividad promedio y conectividad confiable en todo el mundo. Diseñado para resistir los elementos — los Kits Starlink pueden derretir nieve y soportar aguanieve, lluvia intensa y vientos fuertes.",
    link: { text: "Más información", href: "#" },
  },
  {
    image: featureSpeeds,
    title: "Internet diseñado para cada necesidad",
    description:
      "Starlink ofrece velocidades de hasta 400+ Mbps en la mayoría de los lugares del mundo, dándote la libertad de disfrutar streaming 4K en múltiples dispositivos, trabajo remoto efectivo, juegos en línea, redes sociales y más.",
    link: { text: "Consulta velocidades en tu zona", href: "#cobertura" },
  },
  {
    image: featureMini,
    title: "Starlink Mini para internet en movimiento",
    description:
      "Starlink Mini es un kit compacto y portátil que cabe fácilmente en una mochila, diseñado para ofrecer internet de alta velocidad y baja latencia en movimiento. Incluye router WiFi integrado, menor consumo de energía, entrada de corriente DC y velocidades máximas de descarga de más de 200 Mbps.",
    link: { text: "Más información", href: "#" },
  },
  {
    image: featureInstall,
    title: "CONÉCTATE EN MINUTOS",
    description: "Configura Starlink en solo dos pasos. Las instrucciones funcionan en cualquier orden:",
    steps: [
      { num: "1", text: "CONÉCTALO" },
      { num: "2", text: "APUNTA AL CIELO" },
    ],
  },
  {
    image: featurePlans,
    title: "Planes de servicio flexibles",
    description:
      "Starlink ofrece planes de servicio flexibles en todas partes. Consulta la disponibilidad ingresando tu dirección.",
    link: { text: "Consultar disponibilidad", href: "#" },
  },
  {
    image: featureSpacex,
    title: "DISEÑADO POR SPACEX",
    description:
      "Como el proveedor líder mundial de servicios de lanzamiento — y el único proveedor con un cohete reutilizable de clase orbital — SpaceX tiene amplia experiencia tanto con naves espaciales como con operaciones en órbita.",
    link: { text: "Más información", href: "#" },
  },
];

const FeatureSections = () => {
  return (
    <div>
      {features.map((feature, i) => (
        <section key={i} className="relative w-full min-h-screen overflow-hidden">
          <img src={feature.image} alt={feature.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end h-full min-h-screen px-6 pb-20 pt-40">
            <div className="max-w-2xl">
              <h2 className="text-foreground text-3xl md:text-5xl font-bold tracking-tight">{feature.title}</h2>
              <p className="text-muted-foreground text-base md:text-lg mt-4 leading-relaxed max-w-xl">{feature.description}</p>
              {feature.steps && (
                <div className="flex gap-8 mt-6">
                  {feature.steps.map((step) => (
                    <div key={step.num} className="flex items-center gap-3">
                      <span className="text-foreground text-3xl font-bold">{step.num}</span>
                      <span className="text-foreground text-sm font-semibold tracking-wider">{step.text}</span>
                    </div>
                  ))}
                </div>
              )}
              {feature.link && (
                <a href={feature.link.href} className="inline-flex items-center gap-1 text-foreground text-sm font-medium mt-6 underline underline-offset-4 hover:text-muted-foreground transition-colors">
                  {feature.link.text} ›
                </a>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default FeatureSections;
