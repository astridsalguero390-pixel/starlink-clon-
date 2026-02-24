const footerLinks = [
  {
    title: "Starlink",
    links: ["Residencial", "Empresas", "Marítimo", "Aviación", "Gobierno"],
  },
  {
    title: "Soporte",
    links: ["Centro de ayuda", "Instalación", "Solución de problemas", "Cuenta"],
  },
  {
    title: "Legal",
    links: ["Términos de servicio", "Política de privacidad", "Licencias"],
  },
];

const FooterSection = () => {
  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-foreground font-bold text-lg tracking-widest">STARLINK</p>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              Internet de alta velocidad, baja latencia en cualquier lugar del mundo.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-4">
                {section.title}
              </p>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            © 2026 Starlink. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground text-xs hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="text-muted-foreground text-xs hover:text-foreground transition-colors">
              Instagram
            </a>
            <a href="#" className="text-muted-foreground text-xs hover:text-foreground transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
