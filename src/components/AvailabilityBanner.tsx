const AvailabilityBanner = () => {
  return (
    <section className="bg-background py-16 text-center">
      <p className="text-muted-foreground text-sm tracking-wider uppercase">
        Fast Connectivity Where You Need It, When You Need It
      </p>
      <p className="text-foreground text-lg md:text-xl font-medium mt-3">
        Available in 150+ countries, territories, and other markets around the world
      </p>
      <a
        href="#coverage"
        className="inline-flex items-center gap-1 text-foreground text-sm mt-4 underline underline-offset-4 hover:text-muted-foreground transition-colors"
      >
        Check Availability and Plans in Your Area ›
      </a>
    </section>
  );
};

export default AvailabilityBanner;
