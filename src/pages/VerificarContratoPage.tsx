import { useState } from "react";
import { supabase, Contrato } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Search, FileText, Phone, Mail, MapPin, Calendar, Tag, CreditCard } from "lucide-react";
import SEO from "@/components/SEO";

const tipoLabel: Record<string, string> = { sim: "📱 SIM Card Satelital", antena: "📡 Antena Starlink" };
const paisLabel: Record<string, string> = { EC: "🇪🇨 Ecuador", HN: "🇭🇳 Honduras", PE: "🇵🇪 Perú", CO: "🇨🇴 Colombia" };

const Row = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) =>
    value ? (
        <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
            <Icon size={16} className="text-muted-foreground mt-0.5 shrink-0" />
            <div>
                <p className="text-muted-foreground text-xs tracking-wider uppercase">{label}</p>
                <p className="text-foreground text-sm font-medium mt-0.5">{value}</p>
            </div>
        </div>
    ) : null;

const VerificarContratoPage = () => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [contrato, setContrato] = useState<Contrato | null>(null);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setError("");
        setContrato(null);

        const q = query.trim();
        const { data, error: err } = await supabase
            .from("contratos")
            .select("*")
            .or(`numero_contrato.ilike.%${q}%,email.ilike.%${q}%,telefono.ilike.%${q}%`)
            .limit(1)
            .single();

        setLoading(false);
        if (err || !data) {
            setError("No se encontró ningún contrato con ese número, email o teléfono. Verifica los datos e intenta de nuevo.");
        } else {
            setContrato(data as Contrato);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Verificar Contrato Starlink — Portal del Cliente"
                description="Consulta los detalles de tu contrato Starlink. Ingresa tu número de contrato, email o teléfono para ver tu plan y datos de servicio."
                canonical="/verificar-contrato"
                noIndex={true}
            />
            <Navbar />
            <div className="pt-28 pb-20 px-6 max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium mb-2">
                        📄 Portal del Cliente
                    </p>
                    <h1 className="text-foreground text-3xl md:text-4xl font-bold tracking-tight">
                        Verificar Contrato
                    </h1>
                    <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                        Ingresa tu número de contrato, email o teléfono registrado para ver los detalles de tu servicio.
                    </p>
                </div>

                {/* Search form */}
                <form onSubmit={handleSearch} className="flex gap-0 mb-8">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Nº contrato, email o teléfono..."
                        className="flex-1 bg-card border border-border rounded-l px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-foreground/40 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-foreground text-background px-6 py-3 rounded-r text-sm font-semibold tracking-wider shrink-0 hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Search size={16} />
                        {loading ? "Buscando..." : "BUSCAR"}
                    </button>
                </form>

                {/* Error */}
                {error && (
                    <div className="bg-card border border-border rounded-lg p-5 text-center">
                        <p className="text-muted-foreground text-sm">⚠️ {error}</p>
                    </div>
                )}

                {/* Contrato result */}
                {contrato && (
                    <div className="bg-card border border-border rounded-lg overflow-hidden">

                        {/* Estado de pago — banner prominente */}
                        {contrato.estado_pago === "activo" ? (
                            <div className="bg-green-500/10 border-b border-green-500/30 px-6 py-4 flex items-center gap-3">
                                <span className="text-2xl">✅</span>
                                <div>
                                    <p className="text-green-300 font-bold text-base tracking-wide">PLAN ACTIVO</p>
                                    <p className="text-green-400/80 text-xs mt-0.5">Tu servicio Starlink está activo y funcionando.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-6 py-4 flex items-center gap-3">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <p className="text-yellow-300 font-bold text-base tracking-wide">PAGO PENDIENTE</p>
                                    <p className="text-yellow-400/80 text-xs mt-0.5">Tu plan se activará una vez confirmemos el pago.</p>
                                </div>
                            </div>
                        )}

                        {/* Contrato header */}
                        <div className="bg-foreground/5 border-b border-border px-6 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-foreground" />
                                <div>
                                    <p className="text-foreground font-bold tracking-widest text-sm">{contrato.numero_contrato}</p>
                                    <p className="text-muted-foreground text-xs">{tipoLabel[contrato.tipo_servicio]}</p>
                                </div>
                            </div>
                        </div>

                        {/* Data rows */}
                        <div className="px-6 py-4">
                            <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-3">Datos del cliente</p>
                            <Row icon={Phone} label="Nombre completo" value={`${contrato.nombre} ${contrato.apellido}`} />
                            <Row icon={Phone} label="Teléfono" value={contrato.telefono} />
                            <Row icon={Mail} label="Email" value={contrato.email} />
                            <Row icon={MapPin} label="País / Ciudad" value={`${paisLabel[contrato.pais] ?? contrato.pais} / ${contrato.ciudad}`} />
                        </div>

                        <div className="px-6 py-4 border-t border-border">
                            <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-3">Detalles del servicio</p>
                            <Row icon={Tag} label="Plan contratado" value={contrato.plan} />
                            <Row icon={CreditCard} label="Precio pagado" value={`${contrato.precio} ${contrato.moneda}`} />
                            <Row icon={Phone} label="Número SIM" value={contrato.numero_sim} />
                            <Row icon={Calendar} label="Fecha de compra" value={new Date(contrato.fecha_compra).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })} />
                            {contrato.notas && <Row icon={FileText} label="Notas" value={contrato.notas} />}
                        </div>
                    </div>
                )}
            </div>
            <FooterSection />
        </div>
    );
};

export default VerificarContratoPage;
