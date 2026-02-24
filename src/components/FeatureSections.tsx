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
  appLinks?: { android: string; ios: string };
}

const features: Feature[] = [
  {
    image: featureReliability,
    title: "Reliable & resilient",
    description:
      "Starlink provides high-speed, low-latency internet with more than 99.9% average uptime and reliable connectivity around the globe. Designed to endure the elements — Starlink Kits can melt snow and withstand sleet, heavy rain, and harsh winds.",
    link: { text: "Learn more", href: "#" },
  },
  {
    image: featureSpeeds,
    title: "Internet designed for every need",
    description:
      "Starlink delivers speeds up to 400+ Mbps in most places globally, giving you the freedom to enjoy 4K streaming on multiple devices at once, effective working from home, online gaming, social media browsing, and more.",
    link: { text: "Check speeds in your area", href: "#coverage" },
  },
  {
    image: featureMini,
    title: "Starlink Mini for internet on the go",
    description:
      "Starlink Mini is a compact, portable kit that can easily fit in a backpack, designed to provide high-speed, low-latency internet on the go. It includes a built-in WiFi router, lower power consumption, DC power input, and max download speeds over 200 Mbps.",
    link: { text: "Learn More", href: "#" },
  },
  {
    image: featureInstall,
    title: "GET ONLINE IN MINUTES",
    description: "Set up Starlink with just two steps. Instructions work in either order:",
    steps: [
      { num: "1", text: "PLUG IT IN" },
      { num: "2", text: "POINT AT SKY" },
    ],
  },
  {
    image: featurePlans,
    title: "Flexible Service Plans",
    description:
      "Starlink offers flexible service plans everywhere. Check availability by entering your address.",
    link: { text: "Check availability", href: "#" },
  },
  {
    image: featureSpacex,
    title: "ENGINEERED BY SPACEX",
    description:
      "As the world's leading provider of launch services – and the only provider with an orbital class reusable rocket – SpaceX has deep experience with both spacecraft and on-orbit operations.",
    link: { text: "Learn More", href: "#" },
  },
];

const FeatureSections = () => {
  return (
    <div>
      {features.map((feature, i) => (
        <section key={i} className="relative w-full min-h-screen overflow-hidden">
          {/* Full-bleed background image */}
          <img
            src={feature.image}
            alt={feature.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {/* Dark overlay from bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Content pinned to bottom */}
          <div className="relative z-10 flex flex-col justify-end h-full min-h-screen px-6 pb-20 pt-40">
            <div className="max-w-2xl">
              <h2 className="text-foreground text-3xl md:text-5xl font-bold tracking-tight">
                {feature.title}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg mt-4 leading-relaxed max-w-xl">
                {feature.description}
              </p>

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
                <a
                  href={feature.link.href}
                  className="inline-flex items-center gap-1 text-foreground text-sm font-medium mt-6 underline underline-offset-4 hover:text-muted-foreground transition-colors"
                >
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
