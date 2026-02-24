const stats = [
  { value: "7,000+", label: "Satélites en órbita" },
  { value: "100+", label: "Países con cobertura" },
  { value: "4M+", label: "Usuarios activos" },
  { value: "220 Mbps", label: "Velocidad de descarga" },
];

const StatsSection = () => {
  return (
    <section className="bg-background py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-foreground text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              {stat.value}
            </p>
            <p className="text-muted-foreground text-sm mt-2 tracking-wide uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
