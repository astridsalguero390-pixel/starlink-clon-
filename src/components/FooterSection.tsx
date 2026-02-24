const footerLinks = [
  {
    title: "Starlink",
    links: [
      { label: "Residencial", href: "#residencial" },
      { label: "Portátil", href: "#portatil" },
      { label: "Empresas", href: "#" },
      { label: "Aviación", href: "#" },
      { label: "Marítimo", href: "#" },
      { label: "Directo a Celular", href: "#" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { label: "Centro de Ayuda", href: "#" },
      { label: "Cuenta", href: "#" },
      { label: "Planes de Servicio", href: "#" },
      { label: "Mapa de Disponibilidad", href: "#cobertura" },
      { label: "Especificaciones", href: "#" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Tecnología", href: "#" },
      { label: "Actualizaciones", href: "#" },
      { label: "Historias de Clientes", href: "#" },
      { label: "Guías en Video", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de Privacidad", href: "#" },
      { label: "Términos de Servicio", href: "#" },
      { label: "Licencias", href: "#" },
    ],
  },
];

const FooterSection = () => {
  return (
    <footer className="bg-background border-t border-border py-14">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <p className="text-foreground font-bold text-sm tracking-[0.35em]">STARLINK</p>
            <p className="text-muted-foreground text-xs mt-4 leading-relaxed">
              © 2026 SpaceX Starlink
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-4">
                {section.title}
              </p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-muted-foreground text-xs hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
