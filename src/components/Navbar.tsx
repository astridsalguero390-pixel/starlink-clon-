import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "business">("personal");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Promo banner */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border py-2.5 text-center">
        <p className="text-foreground text-sm font-medium">
          <span>$199</span>{" "}
          <span className="text-muted-foreground line-through">$299</span>{" "}
          <span>for the Mini Kit</span>
        </p>
      </div>

      {/* Main nav */}
      <div className="bg-transparent backdrop-blur-none">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo + links */}
          <div className="flex items-center gap-10">
            <a href="#" className="text-foreground font-bold text-lg tracking-[0.35em]">
              STARLINK
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#residential" className="text-foreground text-xs tracking-[0.2em] font-medium hover:text-muted-foreground transition-colors">
                RESIDENTIAL
              </a>
              <a href="#roam" className="text-foreground text-xs tracking-[0.2em] font-medium hover:text-muted-foreground transition-colors">
                ROAM
              </a>
            </div>
          </div>

          {/* Right: Personal/Business toggle */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab("personal")}
              className={`text-xs tracking-[0.15em] font-medium px-3 py-1.5 transition-colors ${
                activeTab === "personal" ? "text-foreground underline underline-offset-4" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              PERSONAL
            </button>
            <span className="text-border">|</span>
            <button
              onClick={() => setActiveTab("business")}
              className={`text-xs tracking-[0.15em] font-medium px-3 py-1.5 transition-colors ${
                activeTab === "business" ? "text-foreground underline underline-offset-4" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              BUSINESS
            </button>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-6 py-6 flex flex-col gap-4">
          <a href="#residential" className="text-foreground text-sm tracking-[0.2em] font-medium" onClick={() => setMobileOpen(false)}>RESIDENTIAL</a>
          <a href="#roam" className="text-foreground text-sm tracking-[0.2em] font-medium" onClick={() => setMobileOpen(false)}>ROAM</a>
          <div className="border-t border-border pt-4 mt-2 flex gap-4">
            <button className="text-foreground text-sm tracking-wider font-medium">PERSONAL</button>
            <button className="text-muted-foreground text-sm tracking-wider font-medium">BUSINESS</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
