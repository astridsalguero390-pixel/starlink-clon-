const products = [
  {
    title: "RESIDENTIAL",
    subtitle: "Connect at home",
    description: "Get started below to see plans and pricing",
    id: "residential",
  },
  {
    title: "ROAM",
    subtitle: "Connect while traveling anywhere in over 150 markets",
    description: "Starting at $50/mo for service",
    id: "roam",
  },
];

const ProductCards = () => {
  return (
    <section className="bg-background py-0 -mt-2">
      <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            id={p.id}
            className="bg-card border border-border rounded-lg p-8 md:p-10"
          >
            <h2 className="text-foreground text-2xl md:text-3xl font-bold tracking-tight">
              {p.title}
            </h2>
            <p className="text-muted-foreground text-sm mt-2">{p.subtitle}</p>
            <p className="text-foreground text-sm font-semibold mt-4">{p.description}</p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="bg-foreground text-background px-5 py-2.5 rounded text-xs font-semibold tracking-wider hover:bg-foreground/90 transition-colors"
              >
                GET STARTED
              </a>
              <a
                href="#"
                className="border border-foreground/30 text-foreground px-5 py-2.5 rounded text-xs font-semibold tracking-wider hover:bg-foreground/10 transition-colors"
              >
                LEARN MORE
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductCards;
