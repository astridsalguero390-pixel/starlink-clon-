import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import SEO from "@/components/SEO";
import { Search, ShieldCheck, BadgeCheck, Phone, Mail, User } from "lucide-react";

interface Asesor {
    id: string;
    codigo_asesor: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    cargo: string;
    foto_url?: string;
    activo: boolean;
}

const ValidarAsesorPage = () => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [asesor, setAsesor] = useState<Asesor | null>(null);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setError("");
        setAsesor(null);

        const { data, error: err } = await supabase
            .from("asesores")
            .select("*")
            .ilike("codigo_asesor", query.trim())
            .limit(1)
            .single();

        setLoading(false);
        if (err || !data) {
            setError("No se encontró ningún asesor con ese código. Verifica el ID e intenta de nuevo.");
        } else {
            setAsesor(data as Asesor);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Validar Asesor Starlink — Verifica que tu asesor es real"
                description="Verifica la identidad de tu asesor Starlink ingresando su código de identificación. Protégete de fraudes."
                canonical="/validar-asesor"
                noIndex={false}
            />
            <Navbar />
            <div className="pt-28 pb-20 px-6 max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium mb-2">
                        🛡️ Seguridad del Cliente
                    </p>
                    <h1 className="text-foreground text-3xl md:text-4xl font-bold tracking-tight">
                        Validar Asesor
                    </h1>
                    <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                        Ingresa el código de identificación de tu asesor para verificar que es un representante oficial de Starlink autorizado.
                    </p>
                </div>

                {/* Info banner */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-5 py-4 mb-8 flex items-start gap-3">
                    <ShieldCheck size={18} className="text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-blue-300 text-sm leading-relaxed">
                        Nuestros asesores siempre tienen un <strong>código de identificación único</strong>. Si alguien te contacta y no puede mostrarte un código válido, <strong>no compartas datos personales ni realices pagos</strong>.
                    </p>
                </div>

                {/* Search form */}
                <form onSubmit={handleSearch} className="flex gap-0 mb-8">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setError(""); }}
                        placeholder="Código del asesor (ej: ASR-001)"
                        className="flex-1 bg-card border border-border rounded-l px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-foreground/40 transition-colors"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-foreground text-background px-6 py-3 rounded-r text-sm font-semibold tracking-wider shrink-0 hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Search size={16} />
                        {loading ? "Buscando..." : "VERIFICAR"}
                    </button>
                </form>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-5 text-center">
                        <p className="text-red-400 text-sm">⚠️ {error}</p>
                        <p className="text-muted-foreground text-xs mt-2">
                            Si crees que hay un fraude, contáctanos directamente.
                        </p>
                    </div>
                )}

                {/* Asesor result */}
                {asesor && (
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">

                        {/* Estado activo/inactivo */}
                        {asesor.activo ? (
                            <div className="bg-green-500/10 border-b border-green-500/30 px-6 py-4 flex items-center gap-3">
                                <BadgeCheck size={22} className="text-green-400 shrink-0" />
                                <div>
                                    <p className="text-green-300 font-bold text-base tracking-wide">ASESOR VERIFICADO ✓</p>
                                    <p className="text-green-400/80 text-xs mt-0.5">Esta persona es un representante oficial y autorizado de Starlink.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-500/10 border-b border-red-500/30 px-6 py-4 flex items-center gap-3">
                                <ShieldCheck size={22} className="text-red-400 shrink-0" />
                                <div>
                                    <p className="text-red-300 font-bold text-base tracking-wide">ASESOR INACTIVO</p>
                                    <p className="text-red-400/80 text-xs mt-0.5">Este asesor ya no está activo. No realices pagos ni compartas datos.</p>
                                </div>
                            </div>
                        )}

                        {/* Perfil del asesor */}
                        <div className="px-6 py-6 flex items-start gap-5">
                            {/* Foto / avatar */}
                            {asesor.foto_url ? (
                                <img
                                    src={asesor.foto_url}
                                    alt={`Foto de ${asesor.nombre}`}
                                    className="w-20 h-20 rounded-full object-cover border-2 border-border shrink-0"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-foreground/10 border-2 border-border flex items-center justify-center shrink-0">
                                    <User size={32} className="text-muted-foreground" />
                                </div>
                            )}

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-foreground font-bold text-xl tracking-tight">
                                    {asesor.nombre} {asesor.apellido}
                                </p>
                                <p className="text-muted-foreground text-sm mt-0.5">{asesor.cargo}</p>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2 text-xs">
                                        <div className="bg-foreground/10 text-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-widest border border-foreground/20">
                                            ID: {asesor.codigo_asesor}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone size={13} className="shrink-0" />
                                        <a href={`https://wa.me/${asesor.telefono.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                                            {asesor.telefono}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail size={13} className="shrink-0" />
                                        <span>{asesor.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 pb-5 border-t border-border pt-4">
                            <p className="text-muted-foreground text-xs text-center">
                                🔒 Esta verificación confirma que el asesor pertenece a nuestra red oficial de representantes Starlink.
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <FooterSection />
        </div>
    );
};

export default ValidarAsesorPage;
