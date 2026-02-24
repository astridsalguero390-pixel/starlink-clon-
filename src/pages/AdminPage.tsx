import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { MessageSquare, RefreshCw, Inbox, Lock, Eye, EyeOff, LogOut, FileText, Share2, SendHorizonal } from "lucide-react";
import ConvertToContractModal from "@/components/ConvertToContractModal";

type EstadoLead = "nuevo" | "contactado" | "venta" | "descartado";

interface Lead {
    id: string;
    nombre: string;
    apellido: string;
    whatsapp: string;
    email?: string;
    pais: string;
    ciudad: string;
    barrio?: string;
    direccion?: string;
    referencia?: string;
    tipo_servicio: string;
    plan_nombre: string;
    plan_precio: string;
    notas?: string;
    estado: EstadoLead;
    created_at: string;
}

const ESTADO_COLORS: Record<EstadoLead, string> = {
    nuevo: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    contactado: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    venta: "bg-green-500/20 text-green-300 border-green-500/30",
    descartado: "bg-red-500/20 text-red-300 border-red-500/30",
};

const paisLabel: Record<string, string> = { EC: "🇪🇨 EC", HN: "🇭🇳 HN", PE: "🇵🇪 PE" };

function buildWhatsAppMsg(lead: Lead): string {
    return encodeURIComponent(
        `Hola ${lead.nombre} ${lead.apellido} 👋\n\n` +
        `¡Gracias por tu interés en Starlink! 🚀\n\n` +
        `Te escribimos con respecto a tu solicitud del *${lead.plan_nombre}* por *${lead.plan_precio}*.\n\n` +
        `📍 Ciudad: ${lead.ciudad}${lead.barrio ? ` / ${lead.barrio}` : ""}\n` +
        `📦 Tipo de servicio: ${lead.tipo_servicio === "sim" ? "SIM Card Satelital" : "Antena Starlink"}\n\n` +
        `¿A qué hora sería conveniente para coordinar los detalles del pedido? 😊`
    );
}

// Mensaje para compartir lead a un trabajador (sin número fijo)
function buildShareLeadMsg(lead: Lead): string {
    return encodeURIComponent(
        `📋 *NUEVO LEAD — Starlink*\n\n` +
        `👤 Cliente: *${lead.nombre} ${lead.apellido}*\n` +
        `📱 WhatsApp: ${lead.whatsapp}\n` +
        (lead.email ? `✉️ Correo: ${lead.email}\n` : "") +
        `📍 Ubicación: ${lead.ciudad}${lead.barrio ? ` · ${lead.barrio}` : ""}\n` +
        (lead.direccion ? `🏠 Dirección: ${lead.direccion}\n` : "") +
        (lead.referencia ? `🔖 Referencia: ${lead.referencia}\n` : "") +
        `\n🛒 Plan: *${lead.plan_nombre}*\n` +
        `💰 Precio: ${lead.plan_precio}\n` +
        `📦 Tipo: ${lead.tipo_servicio === "sim" ? "SIM Card Satelital" : "Antena Starlink"}\n` +
        (lead.notas ? `\n📝 Notas: ${lead.notas}\n` : "") +
        `\n🕐 Estado: ${lead.estado.toUpperCase()}`
    );
}

// Mensaje contrato para enviar al cliente una vez confirmada la venta
function buildContratoMsg(lead: Lead): string {
    return encodeURIComponent(
        `Hola ${lead.nombre} 👋\n\n` +
        `¡Tu pedido de Starlink ha sido *confirmado*! ✅🚀\n\n` +
        `📦 *Plan:* ${lead.plan_nombre}\n` +
        `💰 *Precio:* ${lead.plan_precio}\n\n` +
        `Puedes verificar tu contrato y seguir el estado de tu pedido en:\n\n` +
        `🔗 *Verificar Contrato:* https://tu-dominio.com/verificar-contrato\n` +
        `🔗 *Estado de Pedido:* https://tu-dominio.com/estado-pedido\n\n` +
        `¡Gracias por confiar en nosotros! 💙`
    );
}

// ── Login Screen ───────────────────────────────
const LoginScreen = ({ onLogin }: { onLogin: () => void }) => {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password: pass,
        });
        setLoading(false);
        if (authError) {
            setError("Correo o contraseña incorrectos");
        } else {
            onLogin();
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Icon + title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-foreground/10 border border-border mb-4">
                        <Lock size={22} className="text-foreground" />
                    </div>
                    <h1 className="text-foreground text-xl font-bold tracking-tight">Panel Admin</h1>
                    <p className="text-muted-foreground text-xs mt-1">Acceso restringido — solo administradores</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-2xl">
                    <div>
                        <label className="block text-muted-foreground text-xs mb-1.5">Correo electrónico</label>
                        <input
                            autoFocus
                            type="email"
                            required
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(""); }}
                            placeholder="tu@correo.com"
                            className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/40 outline-none focus:border-foreground/40 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-muted-foreground text-xs mb-1.5">Contraseña</label>
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                required
                                value={pass}
                                onChange={(e) => { setPass(e.target.value); setError(""); }}
                                placeholder="••••••••"
                                className="w-full bg-background border border-border rounded px-3 py-2.5 pr-10 text-foreground text-sm placeholder:text-muted-foreground/40 outline-none focus:border-foreground/40 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-foreground text-background py-2.5 rounded text-sm font-bold tracking-widest uppercase hover:bg-foreground/90 transition-colors disabled:opacity-60"
                    >
                        {loading ? "Verificando..." : "INGRESAR"}
                    </button>
                </form>


            </div>
        </div>
    );
};

// ── Main Admin Page ────────────────────────────
const AdminPage = () => {
    const [authed, setAuthed] = useState(false);
    const [checking, setChecking] = useState(true);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState<EstadoLead | "todos">("todos");
    const [convertingLead, setConvertingLead] = useState<Lead | null>(null);

    // Check if already logged in on mount
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setAuthed(!!data.session);
            setChecking(false);
        });
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setLeads(data as Lead[]);
        setLoading(false);
    };

    useEffect(() => { if (authed) fetchLeads(); }, [authed]);

    const updateEstado = async (id: string, estado: EstadoLead) => {
        await supabase.from("leads").update({ estado }).eq("id", id);
        setLeads((prev) => prev.map((l) => l.id === id ? { ...l, estado } : l));
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setAuthed(false);
        setLeads([]);
    };

    if (checking) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Verificando sesión...</p>
        </div>
    );

    if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

    const filtered = filtroEstado === "todos" ? leads : leads.filter((l) => l.estado === filtroEstado);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-20 px-4 max-w-[1200px] mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium mb-1">🔐 Panel privado</p>
                        <h1 className="text-foreground text-2xl md:text-3xl font-bold tracking-tight">Solicitudes de clientes</h1>
                        <p className="text-muted-foreground text-sm mt-1">{leads.length} solicitud{leads.length !== 1 ? "es" : ""} en total</p>
                    </div>
                    <div className="flex gap-2 self-start">
                        <button onClick={fetchLeads} className="flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 rounded text-xs font-semibold hover:text-foreground transition-colors">
                            <RefreshCw size={14} />Actualizar
                        </button>
                        <button onClick={logout} className="flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 rounded text-xs font-semibold hover:text-red-400 transition-colors">
                            <LogOut size={14} />Salir
                        </button>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {(["todos", "nuevo", "contactado", "venta", "descartado"] as const).map((e) => (
                        <button
                            key={e}
                            onClick={() => setFiltroEstado(e)}
                            className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors border ${filtroEstado === e ? "bg-foreground text-background border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}
                        >
                            {e === "todos" ? `Todos (${leads.length})` : `${e.charAt(0).toUpperCase() + e.slice(1)} (${leads.filter((l) => l.estado === e).length})`}
                        </button>
                    ))}
                </div>

                {/* Leads list */}
                {loading ? (
                    <div className="text-center py-16 text-muted-foreground text-sm">Cargando...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Inbox size={32} className="mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground text-sm">Sin solicitudes {filtroEstado !== "todos" ? `en estado "${filtroEstado}"` : "aún"}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((lead) => (
                            <div key={lead.id} className="bg-card border border-border rounded-lg p-5">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <p className="text-foreground font-bold text-sm">{lead.nombre} {lead.apellido}</p>
                                            <span className="text-muted-foreground text-xs">·</span>
                                            <span className="text-muted-foreground text-xs">{paisLabel[lead.pais] ?? lead.pais}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ESTADO_COLORS[lead.estado]}`}>
                                                {lead.estado.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 mt-2 text-xs">
                                            <p className="text-muted-foreground">📱 <span className="text-foreground font-mono">{lead.whatsapp}</span></p>
                                            {lead.email && <p className="text-muted-foreground">✉️ {lead.email}</p>}
                                            <p className="text-muted-foreground">📍 {lead.ciudad}{lead.barrio ? ` · ${lead.barrio}` : ""}</p>
                                            {lead.direccion && <p className="text-muted-foreground">🏠 {lead.direccion}</p>}
                                            {lead.referencia && <p className="text-muted-foreground col-span-2">🔖 {lead.referencia}</p>}
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span className="bg-foreground/10 border border-foreground/20 text-foreground text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                                                {lead.tipo_servicio === "sim" ? "📱" : "📡"} {lead.plan_nombre}
                                            </span>
                                            <span className="bg-foreground/10 border border-foreground/20 text-foreground text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                                                💰 {lead.plan_precio}
                                            </span>
                                            <span className="text-muted-foreground text-[11px]">
                                                {new Date(lead.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>

                                        {lead.notas && (
                                            <p className="text-muted-foreground text-xs mt-2 italic">📝 {lead.notas}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2 shrink-0 min-w-[160px]">
                                        <a
                                            href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}?text=${buildWhatsAppMsg(lead)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded text-xs font-bold tracking-wide hover:bg-[#1ebe5d] transition-colors"
                                        >
                                            <MessageSquare size={13} />
                                            CONTACTAR POR WhatsApp
                                        </a>

                                        {/* Compartir lead con trabajador */}
                                        <a
                                            href={`https://wa.me/?text=${buildShareLeadMsg(lead)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 border border-border text-muted-foreground px-4 py-2.5 rounded text-xs font-bold tracking-wide hover:text-foreground hover:border-foreground/40 transition-colors"
                                        >
                                            <Share2 size={13} />
                                            COMPARTIR LEAD
                                        </a>

                                        {/* Crear contrato button (show when not yet discarded) */}
                                        {lead.estado !== "descartado" && lead.estado !== "venta" && (
                                            <button
                                                onClick={() => setConvertingLead(lead)}
                                                className="flex items-center justify-center gap-2 border border-foreground/40 text-foreground px-4 py-2.5 rounded text-xs font-bold tracking-wide hover:bg-foreground/10 transition-colors"
                                            >
                                                <FileText size={13} />
                                                CREAR CONTRATO
                                            </button>
                                        )}
                                        {lead.estado === "venta" && (
                                            <>
                                                <p className="text-green-400 text-[11px] font-semibold text-center">✅ Contrato creado</p>
                                                {/* Enviar contrato al cliente */}
                                                <a
                                                    href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}?text=${buildContratoMsg(lead)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded text-xs font-bold tracking-wide hover:bg-blue-500 transition-colors"
                                                >
                                                    <SendHorizonal size={13} />
                                                    ENVIAR CONTRATO
                                                </a>
                                            </>
                                        )}

                                        <select
                                            value={lead.estado}
                                            onChange={(e) => updateEstado(lead.id, e.target.value as EstadoLead)}
                                            className="bg-background border border-border rounded px-3 py-2 text-foreground text-xs outline-none focus:border-foreground/40 cursor-pointer"
                                        >
                                            <option value="nuevo">🔵 Nuevo</option>
                                            <option value="contactado">🟡 Contactado</option>
                                            <option value="venta">🟢 Venta confirmada</option>
                                            <option value="descartado">🔴 Descartado</option>
                                        </select>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <FooterSection />

            {/* Convert to Contract Modal */}
            {convertingLead && (
                <ConvertToContractModal
                    lead={convertingLead}
                    onClose={() => setConvertingLead(null)}
                    onConverted={() => {
                        setConvertingLead(null);
                        fetchLeads();
                    }}
                />
            )}
        </div>
    );
};

export default AdminPage;
