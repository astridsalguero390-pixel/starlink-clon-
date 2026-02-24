const footerLinks = [
  {
    title: "Starlink",
    links: [
      { label: "Residential", href: "#residential" },
      { label: "Roam", href: "#roam" },
      { label: "Business", href: "#" },
      { label: "Aviation", href: "#" },
      { label: "Maritime", href: "#" },
      { label: "Direct to Cell", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Account", href: "#" },
      { label: "Service Plans", href: "#" },
      { label: "Availability Map", href: "#coverage" },
      { label: "Specifications", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Technology", href: "#" },
      { label: "Updates", href: "#" },
      { label: "Customer Stories", href: "#" },
      { label: "Video Guides", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Licenses", href: "#" },
    ],
  },
];

const FooterSection = () => {
  return (
    <footer className="bg-background border-t border-border py-14">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
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
                    <a
                      href={link.href}
                      className="text-muted-foreground text-xs hover:text-foreground transition-colors"
                    >
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
