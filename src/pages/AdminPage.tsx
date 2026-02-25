import { useEffect, useState } from "react";
import { supabase, Contrato, Pedido } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import {
    MessageSquare, RefreshCw, Inbox, Lock, Eye, EyeOff, LogOut,
    FileText, Share2, SendHorizonal, Plus, CheckCircle, Clock,
    ToggleLeft, ToggleRight, Package, Save, Truck,
    BadgeCheck, User, Pencil, Trash2, ShieldOff
} from "lucide-react";
import ConvertToContractModal from "@/components/ConvertToContractModal";
import CreateContractModal, { DOMINIOS } from "@/components/CreateContractModal";

type EstadoLead = "nuevo" | "contactado" | "venta" | "descartado";
type TabAdmin = "leads" | "contratos" | "envios" | "asesores";

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
    created_at: string;
}

const EMPTY_ASESOR: Omit<Asesor, 'id' | 'created_at'> = {
    codigo_asesor: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    cargo: "Asesor Comercial",
    foto_url: "",
    activo: true,
};
type EstadoPedido = Pedido["estado"];

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

// Pedido enriquecido con datos del contrato para la vista de envíos
interface PedidoConContrato extends Pedido {
    contrato?: Contrato;
}

const ESTADO_COLORS: Record<EstadoLead, string> = {
    nuevo: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    contactado: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    venta: "bg-green-500/20 text-green-300 border-green-500/30",
    descartado: "bg-red-500/20 text-red-300 border-red-500/30",
};

const ESTADO_ENVIO_LABELS: Record<EstadoPedido, string> = {
    en_preparacion: "📦 En preparación",
    pendiente_recogida: "⏳ Pendiente de recogida",
    recogido: "🚚 Recogido",
    enviado: "📬 Enviado",
    en_ruta: "📍 En ruta",
    entregado: "✅ Entregado",
};

const ESTADO_ENVIO_COLORS: Record<EstadoPedido, string> = {
    en_preparacion: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    pendiente_recogida: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    recogido: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    enviado: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    en_ruta: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    entregado: "bg-green-500/20 text-green-300 border-green-500/30",
};

const paisLabel: Record<string, string> = { EC: "🇪🇨 EC", HN: "🇭🇳 HN", PE: "🇵🇪 PE", CO: "🇨🇴 CO" };

function generarNumeroPedido(): string {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `PED-${year}-${rand}`;
}

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

function buildContratoMsg(lead: Lead): string {
    return encodeURIComponent(
        `Hola ${lead.nombre} 👋\n\n` +
        `¡Tu pedido de Starlink ha sido *confirmado*! ✅🚀\n\n` +
        `📦 *Plan:* ${lead.plan_nombre}\n` +
        `💰 *Precio:* ${lead.plan_precio}\n\n` +
        `Puedes verificar tu contrato y seguir el estado de tu pedido en:\n\n` +
        `🔗 *Verificar Contrato:* ${DOMINIOS}/verificar-contrato\n` +
        `🔗 *Estado de Pedido:* ${DOMINIOS}/estado-pedido\n\n` +
        `¡Gracias por confiar en nosotros! 💙`
    );
}

function buildContratoClienteMsg(c: Contrato, pedido?: Pedido | null): string {
    const estadoPago = c.estado_pago === "activo" ? "✅ PLAN ACTIVO" : "⚠️ PAGO PENDIENTE";
    const estadoEnvio = pedido ? `\n📦 *Estado del pedido:* ${ESTADO_ENVIO_LABELS[pedido.estado]}` : "";
    return encodeURIComponent(
        `Hola ${c.nombre} 👋\n\n` +
        `Detalles de tu contrato Starlink:\n\n` +
        `📄 *Contrato:* ${c.numero_contrato}\n` +
        `📦 *Plan:* ${c.plan}\n` +
        `💰 *Precio:* ${c.precio} ${c.moneda}\n` +
        `💳 *Estado pago:* ${estadoPago}` +
        estadoEnvio + `\n\n` +
        `🔗 Verifica en: ${DOMINIOS}/verificar-contrato\n` +
        `🔗 Pedido: ${DOMINIOS}/estado-pedido\n\n` +
        `¡Gracias por confiar en nosotros! 💙`
    );
}

// ── Login Screen ─────────────────────────────
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
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password: pass });
        setLoading(false);
        if (authError) { setError("Correo o contraseña incorrectos"); } else { onLogin(); }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-foreground/10 border border-border mb-4">
                        <Lock size={22} className="text-foreground" />
                    </div>
                    <h1 className="text-foreground text-xl font-bold tracking-tight">Panel Admin</h1>
                    <p className="text-muted-foreground text-xs mt-1">Acceso restringido — solo administradores</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-2xl">
                    <div>
                        <label className="block text-muted-foreground text-xs mb-1.5">Correo electrónico</label>
                        <input autoFocus type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="tu@correo.com" className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/40 outline-none focus:border-foreground/40 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-muted-foreground text-xs mb-1.5">Contraseña</label>
                        <div className="relative">
                            <input type={showPass ? "text" : "password"} required value={pass} onChange={(e) => { setPass(e.target.value); setError(""); }} placeholder="••••••••" className="w-full bg-background border border-border rounded px-3 py-2.5 pr-10 text-foreground text-sm placeholder:text-muted-foreground/40 outline-none focus:border-foreground/40 transition-colors" />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-foreground text-background py-2.5 rounded text-sm font-bold tracking-widest uppercase hover:bg-foreground/90 transition-colors disabled:opacity-60">
                        {loading ? "Verificando..." : "INGRESAR"}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ── Fila de envío por contrato ─────────────────
interface EnvioRowProps {
    contrato: Contrato;
    pedido: Pedido | null;
    onPedidoChange: (pedido: Pedido) => void;
}

const EnvioRow = ({ contrato, pedido, onPedidoChange }: EnvioRowProps) => {
    const [saving, setSaving] = useState(false);
    const [estado, setEstado] = useState<EstadoPedido>(pedido?.estado ?? "en_preparacion");
    const [empresa, setEmpresa] = useState(pedido?.empresa_envio ?? "");
    const [guia, setGuia] = useState(pedido?.numero_guia ?? "");
    const [obs, setObs] = useState(pedido?.observaciones ?? "");
    const [fechaEst, setFechaEst] = useState(pedido?.fecha_estimada ?? "");
    const [expanded, setExpanded] = useState(false);

    const handleCrearPedido = async () => {
        setSaving(true);
        const numero_pedido = generarNumeroPedido();
        const { data } = await supabase.from("pedidos").insert({
            contrato_id: contrato.id,
            numero_pedido,
            estado: "en_preparacion",
        }).select().single();
        setSaving(false);
        if (data) { onPedidoChange(data as Pedido); setExpanded(true); }
    };

    const handleGuardar = async () => {
        if (!pedido) return;
        setSaving(true);
        const { data } = await supabase.from("pedidos").update({
            estado,
            empresa_envio: empresa || null,
            numero_guia: guia || null,
            observaciones: obs || null,
            fecha_estimada: fechaEst || null,
        }).eq("id", pedido.id).select().single();
        setSaving(false);
        if (data) onPedidoChange(data as Pedido);
    };

    const inputCls = "bg-background border border-border rounded px-2.5 py-1.5 text-foreground text-xs outline-none focus:border-foreground/30 transition-colors w-full";

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-foreground font-bold text-sm">{contrato.nombre} {contrato.apellido}</p>
                            <span className="text-muted-foreground text-xs">{paisLabel[contrato.pais] ?? contrato.pais}</span>
                        </div>
                        <p className="text-muted-foreground text-xs font-mono">{contrato.numero_contrato} · {contrato.plan}</p>
                        <p className="text-muted-foreground text-xs">📱 {contrato.telefono}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {pedido ? (
                        <>
                            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${ESTADO_ENVIO_COLORS[pedido.estado]}`}>
                                {ESTADO_ENVIO_LABELS[pedido.estado]}
                            </span>
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="border border-border text-muted-foreground hover:text-foreground px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                            >
                                {expanded ? "Cerrar" : "Gestionar"}
                            </button>
                        </>
                    ) : (
                        <button onClick={handleCrearPedido} disabled={saving}
                            className="flex items-center gap-1.5 bg-foreground text-background px-3 py-1.5 rounded text-xs font-bold hover:bg-foreground/90 transition-colors disabled:opacity-50">
                            <Plus size={12} />{saving ? "Creando..." : "CREAR PEDIDO"}
                        </button>
                    )}
                </div>
            </div>

            {/* Expanded panel */}
            {pedido && expanded && (
                <div className="border-t border-border px-4 py-4 space-y-3">
                    <p className="text-muted-foreground text-xs tracking-widest uppercase font-medium">
                        📦 {pedido.numero_pedido}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Estado */}
                        <div className="sm:col-span-2">
                            <label className="text-muted-foreground text-xs mb-1 block tracking-wider uppercase">Estado de envío</label>
                            <select value={estado} onChange={e => setEstado(e.target.value as EstadoPedido)} className={inputCls}>
                                <option value="en_preparacion">📦 En preparación</option>
                                <option value="pendiente_recogida">⏳ Pendiente de recogida</option>
                                <option value="recogido">🚚 Recogido por transportista</option>
                                <option value="enviado">📬 Enviado</option>
                                <option value="en_ruta">📍 En ruta</option>
                                <option value="entregado">✅ Entregado</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-muted-foreground text-xs mb-1 block tracking-wider uppercase">Empresa de envíos</label>
                            <input value={empresa} onChange={e => setEmpresa(e.target.value)} className={inputCls} placeholder="Cargo Expreso, DHL..." />
                        </div>
                        <div>
                            <label className="text-muted-foreground text-xs mb-1 block tracking-wider uppercase">Número de guía</label>
                            <input value={guia} onChange={e => setGuia(e.target.value)} className={inputCls} placeholder="CE-2026-00123" />
                        </div>
                        <div>
                            <label className="text-muted-foreground text-xs mb-1 block tracking-wider uppercase">Fecha estimada de entrega</label>
                            <input type="date" value={fechaEst} onChange={e => setFechaEst(e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className="text-muted-foreground text-xs mb-1 block tracking-wider uppercase">Observaciones</label>
                            <input value={obs} onChange={e => setObs(e.target.value)} className={inputCls} placeholder="Entregado en portería..." />
                        </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                        <button onClick={handleGuardar} disabled={saving}
                            className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded text-xs font-bold hover:bg-foreground/90 transition-colors disabled:opacity-50">
                            <Save size={13} />{saving ? "Guardando..." : "GUARDAR CAMBIOS"}
                        </button>
                        <a
                            href={`https://wa.me/${contrato.telefono.replace(/\D/g, "")}?text=${buildContratoClienteMsg(contrato, pedido)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#1ebe5d] transition-colors"
                        >
                            <SendHorizonal size={13} />NOTIFICAR CLIENTE
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Main Admin Page ────────────────────────────
const AdminPage = () => {
    const [authed, setAuthed] = useState(false);
    const [checking, setChecking] = useState(true);
    const [tab, setTab] = useState<TabAdmin>("leads");

    // Leads
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loadingLeads, setLoadingLeads] = useState(true);
    const [filtroEstado, setFiltroEstado] = useState<EstadoLead | "todos">("todos");
    const [convertingLead, setConvertingLead] = useState<Lead | null>(null);

    // Contratos
    const [contratos, setContratos] = useState<Contrato[]>([]);
    const [loadingContratos, setLoadingContratos] = useState(false);
    const [showCreateContract, setShowCreateContract] = useState(false);
    const [filtroPago, setFiltroPago] = useState<"todos" | "pendiente" | "activo">("todos");

    // Envíos
    const [pedidos, setPedidos] = useState<PedidoConContrato[]>([]);
    const [loadingEnvios, setLoadingEnvios] = useState(false);
    const [filtroEnvio, setFiltroEnvio] = useState<EstadoPedido | "todos" | "sin_pedido">("todos");
    // Mapa contrato_id → pedido para la vista por cliente
    const [pedidoMap, setPedidoMap] = useState<Record<string, Pedido>>({});

    // Asesores
    const [asesores, setAsesores] = useState<Asesor[]>([]);
    const [loadingAsesores, setLoadingAsesores] = useState(false);
    const [asesorForm, setAsesorForm] = useState<Omit<Asesor, 'id' | 'created_at'>>(EMPTY_ASESOR);
    const [editingAsesor, setEditingAsesor] = useState<Asesor | null>(null);
    const [savingAsesor, setSavingAsesor] = useState(false);
    const [showAsesorForm, setShowAsesorForm] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setAuthed(!!data.session);
            setChecking(false);
        });
    }, []);

    const fetchLeads = async () => {
        setLoadingLeads(true);
        const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
        if (data) setLeads(data as Lead[]);
        setLoadingLeads(false);
    };

    const fetchContratos = async () => {
        setLoadingContratos(true);
        const { data } = await supabase.from("contratos").select("*").order("created_at", { ascending: false });
        if (data) setContratos(data as Contrato[]);
        setLoadingContratos(false);
    };

    const fetchEnvios = async () => {
        setLoadingEnvios(true);
        // Load all pedidos with their contratos
        const { data: ped } = await supabase.from("pedidos").select("*").order("updated_at", { ascending: false });
        const { data: cont } = await supabase.from("contratos").select("*");
        if (ped && cont) {
            const contratoById = Object.fromEntries((cont as Contrato[]).map(c => [c.id, c]));
            const enriched = (ped as Pedido[]).map(p => ({ ...p, contrato: contratoById[p.contrato_id] }));
            setPedidos(enriched);
            const map = Object.fromEntries((ped as Pedido[]).map(p => [p.contrato_id, p]));
            setPedidoMap(map);
        }
        setLoadingEnvios(false);
    };

    const fetchAsesores = async () => {
        setLoadingAsesores(true);
        const { data } = await supabase.from("asesores").select("*").order("created_at", { ascending: true });
        if (data) setAsesores(data as Asesor[]);
        setLoadingAsesores(false);
    };

    useEffect(() => {
        if (!authed) return;
        fetchLeads();
        fetchContratos();
        fetchEnvios();
        fetchAsesores();
    }, [authed]);

    const handleSaveAsesor = async () => {
        if (!asesorForm.codigo_asesor || !asesorForm.nombre || !asesorForm.telefono) return;
        setSavingAsesor(true);
        if (editingAsesor) {
            // Update
            const { data } = await supabase.from("asesores").update(asesorForm).eq("id", editingAsesor.id).select().single();
            if (data) setAsesores(prev => prev.map(a => a.id === editingAsesor.id ? data as Asesor : a));
        } else {
            // Insert
            const { data } = await supabase.from("asesores").insert(asesorForm).select().single();
            if (data) setAsesores(prev => [...prev, data as Asesor]);
        }
        setSavingAsesor(false);
        setAsesorForm(EMPTY_ASESOR);
        setEditingAsesor(null);
        setShowAsesorForm(false);
    };

    const handleEditAsesor = (a: Asesor) => {
        setEditingAsesor(a);
        setAsesorForm({ codigo_asesor: a.codigo_asesor, nombre: a.nombre, apellido: a.apellido, telefono: a.telefono, email: a.email, cargo: a.cargo, foto_url: a.foto_url ?? "", activo: a.activo });
        setShowAsesorForm(true);
    };

    const handleToggleAsesor = async (a: Asesor) => {
        const activo = !a.activo;
        await supabase.from("asesores").update({ activo }).eq("id", a.id);
        setAsesores(prev => prev.map(x => x.id === a.id ? { ...x, activo } : x));
    };

    const handleDeleteAsesor = async (id: string) => {
        if (!confirm("¿Eliminar este asesor?")) return;
        await supabase.from("asesores").delete().eq("id", id);
        setAsesores(prev => prev.filter(a => a.id !== id));
    };

    const updateEstado = async (id: string, estado: EstadoLead) => {
        await supabase.from("leads").update({ estado }).eq("id", id);
        setLeads((prev) => prev.map((l) => l.id === id ? { ...l, estado } : l));
    };

    const toggleEstadoPago = async (c: Contrato) => {
        const nuevo = c.estado_pago === "pendiente" ? "activo" : "pendiente";
        await supabase.from("contratos").update({ estado_pago: nuevo }).eq("id", c.id);
        setContratos((prev) => prev.map((x) => x.id === c.id ? { ...x, estado_pago: nuevo } : x));
    };

    const handlePedidoChange = (pedido: Pedido) => {
        setPedidoMap(prev => ({ ...prev, [pedido.contrato_id]: pedido }));
        fetchEnvios();
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setAuthed(false);
    };

    if (checking) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground text-sm">Verificando sesión...</p></div>;
    if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

    const filteredLeads = filtroEstado === "todos" ? leads : leads.filter((l) => l.estado === filtroEstado);
    const filteredContratos = filtroPago === "todos" ? contratos : contratos.filter((c) => c.estado_pago === filtroPago);
    const filteredEnvios = filtroEnvio === "todos"
        ? pedidos
        : filtroEnvio === "sin_pedido"
            ? []
            : pedidos.filter(p => p.estado === filtroEnvio);

    // Contratos sin pedido (para vista envíos por cliente)
    const contratosSinPedido = contratos.filter(c => !pedidoMap[c.id]);
    const contratosConPedido = contratos.filter(c => !!pedidoMap[c.id]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-20 px-4 max-w-[1200px] mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium mb-1">🔐 Panel privado</p>
                        <h1 className="text-foreground text-2xl md:text-3xl font-bold tracking-tight">Administración</h1>
                    </div>
                    <div className="flex gap-2 self-start">
                        <button onClick={() => { fetchLeads(); fetchContratos(); fetchEnvios(); fetchAsesores(); }} className="flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 rounded text-xs font-semibold hover:text-foreground transition-colors">
                            <RefreshCw size={14} />Actualizar
                        </button>
                        <button onClick={logout} className="flex items-center gap-2 border border-border text-muted-foreground px-4 py-2 rounded text-xs font-semibold hover:text-red-400 transition-colors">
                            <LogOut size={14} />Salir
                        </button>
                    </div>
                </div>

                {/* Main tabs */}
                <div className="flex gap-0 mb-6 border-b border-border overflow-x-auto">
                    {([
                        { key: "leads", label: `📋 Solicitudes (${leads.length})` },
                        { key: "contratos", label: `📄 Contratos (${contratos.length})` },
                        { key: "envios", label: `📦 Envíos (${pedidos.length})` },
                        { key: "asesores", label: `👤 Asesores (${asesores.length})` },
                    ] as const).map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`px-5 py-2.5 text-sm font-semibold tracking-wide border-b-2 transition-colors -mb-px whitespace-nowrap ${tab === t.key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ─── TAB: LEADS ─── */}
                {tab === "leads" && (
                    <>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(["todos", "nuevo", "contactado", "venta", "descartado"] as const).map((e) => (
                                <button key={e} onClick={() => setFiltroEstado(e)}
                                    className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors border ${filtroEstado === e ? "bg-foreground text-background border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {e === "todos" ? `Todos (${leads.length})` : `${e.charAt(0).toUpperCase() + e.slice(1)} (${leads.filter(l => l.estado === e).length})`}
                                </button>
                            ))}
                        </div>

                        {loadingLeads ? (
                            <div className="text-center py-16 text-muted-foreground text-sm">Cargando...</div>
                        ) : filteredLeads.length === 0 ? (
                            <div className="text-center py-16"><Inbox size={32} className="mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground text-sm">Sin solicitudes {filtroEstado !== "todos" ? `en estado "${filtroEstado}"` : "aún"}</p></div>
                        ) : (
                            <div className="space-y-4">
                                {filteredLeads.map((lead) => (
                                    <div key={lead.id} className="bg-card border border-border rounded-lg p-5">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                                    <p className="text-foreground font-bold text-sm">{lead.nombre} {lead.apellido}</p>
                                                    <span className="text-muted-foreground text-xs">·</span>
                                                    <span className="text-muted-foreground text-xs">{paisLabel[lead.pais] ?? lead.pais}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ESTADO_COLORS[lead.estado]}`}>{lead.estado.toUpperCase()}</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 mt-2 text-xs">
                                                    <p className="text-muted-foreground">📱 <span className="text-foreground font-mono">{lead.whatsapp}</span></p>
                                                    {lead.email && <p className="text-muted-foreground">✉️ {lead.email}</p>}
                                                    <p className="text-muted-foreground">📍 {lead.ciudad}{lead.barrio ? ` · ${lead.barrio}` : ""}</p>
                                                    {lead.direccion && <p className="text-muted-foreground">🏠 {lead.direccion}</p>}
                                                    {lead.referencia && <p className="text-muted-foreground col-span-2">🔖 {lead.referencia}</p>}
                                                </div>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <span className="bg-foreground/10 border border-foreground/20 text-foreground text-[11px] px-2.5 py-0.5 rounded-full font-semibold">{lead.tipo_servicio === "sim" ? "📱" : "📡"} {lead.plan_nombre}</span>
                                                    <span className="bg-foreground/10 border border-foreground/20 text-foreground text-[11px] px-2.5 py-0.5 rounded-full font-semibold">💰 {lead.plan_precio}</span>
                                                    <span className="text-muted-foreground text-[11px]">{new Date(lead.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                                                </div>
                                                {lead.notas && <p className="text-muted-foreground text-xs mt-2 italic">📝 {lead.notas}</p>}
                                            </div>
                                            <div className="flex flex-col gap-2 shrink-0 min-w-[160px]">
                                                <a href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}?text=${buildWhatsAppMsg(lead)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded text-xs font-bold tracking-wide hover:bg-[#1ebe5d] transition-colors"><MessageSquare size={13} />CONTACTAR</a>
                                                <a href={`https://wa.me/?text=${buildShareLeadMsg(lead)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border border-border text-muted-foreground px-4 py-2.5 rounded text-xs font-bold tracking-wide hover:text-foreground hover:border-foreground/40 transition-colors"><Share2 size={13} />COMPARTIR</a>
                                                {lead.estado !== "descartado" && lead.estado !== "venta" && (
                                                    <button onClick={() => setConvertingLead(lead)} className="flex items-center justify-center gap-2 border border-foreground/40 text-foreground px-4 py-2.5 rounded text-xs font-bold tracking-wide hover:bg-foreground/10 transition-colors"><FileText size={13} />CREAR CONTRATO</button>
                                                )}
                                                {lead.estado === "venta" && (
                                                    <><p className="text-green-400 text-[11px] font-semibold text-center">✅ Contrato creado</p>
                                                        <a href={`https://wa.me/${lead.whatsapp.replace(/\D/g, "")}?text=${buildContratoMsg(lead)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded text-xs font-bold tracking-wide hover:bg-blue-500 transition-colors"><SendHorizonal size={13} />ENVIAR CONTRATO</a></>
                                                )}
                                                <select value={lead.estado} onChange={(e) => updateEstado(lead.id, e.target.value as EstadoLead)} className="bg-background border border-border rounded px-3 py-2 text-foreground text-xs outline-none focus:border-foreground/40 cursor-pointer">
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
                    </>
                )}

                {/* ─── TAB: CONTRATOS ─── */}
                {tab === "contratos" && (
                    <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                            <div className="flex flex-wrap gap-2">
                                {(["todos", "pendiente", "activo"] as const).map((f) => (
                                    <button key={f} onClick={() => setFiltroPago(f)}
                                        className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors border ${filtroPago === f ? "bg-foreground text-background border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                        {f === "todos" ? `Todos (${contratos.length})` : f === "pendiente" ? `⚠️ Pendiente (${contratos.filter(c => c.estado_pago === "pendiente").length})` : `✅ Activo (${contratos.filter(c => c.estado_pago === "activo").length})`}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setShowCreateContract(true)} className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded text-xs font-bold tracking-widest hover:bg-foreground/90 transition-colors">
                                <Plus size={14} />CREAR CONTRATO
                            </button>
                        </div>

                        {loadingContratos ? (
                            <div className="text-center py-16 text-muted-foreground text-sm">Cargando contratos...</div>
                        ) : filteredContratos.length === 0 ? (
                            <div className="text-center py-16"><Inbox size={32} className="mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground text-sm">No hay contratos {filtroPago !== "todos" ? `con estado "${filtroPago}"` : "aún"}</p></div>
                        ) : (
                            <div className="space-y-3">
                                {filteredContratos.map((c) => (
                                    <div key={c.id} className="bg-card border border-border rounded-lg p-5">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 flex-wrap mb-2">
                                                    <p className="text-foreground font-bold text-sm font-mono tracking-wider">{c.numero_contrato}</p>
                                                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${c.estado_pago === "activo" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"}`}>
                                                        {c.estado_pago === "activo" ? "✅ PLAN ACTIVO" : "⚠️ PAGO PENDIENTE"}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">{paisLabel[c.pais] ?? c.pais}</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5 text-xs">
                                                    <p className="text-muted-foreground">👤 <span className="text-foreground">{c.nombre} {c.apellido}</span></p>
                                                    <p className="text-muted-foreground">📱 <span className="text-foreground font-mono">{c.telefono}</span></p>
                                                    {c.email && <p className="text-muted-foreground">✉️ {c.email}</p>}
                                                    <p className="text-muted-foreground">📍 {c.ciudad}</p>
                                                </div>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <span className="bg-foreground/10 border border-foreground/20 text-foreground text-[11px] px-2.5 py-0.5 rounded-full font-semibold">{c.tipo_servicio === "sim" ? "📱" : "📡"} {c.plan}</span>
                                                    <span className="bg-foreground/10 border border-foreground/20 text-foreground text-[11px] px-2.5 py-0.5 rounded-full font-semibold">💰 {c.precio} {c.moneda}</span>
                                                    <span className="text-muted-foreground text-[11px]">{new Date(c.fecha_compra).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}</span>
                                                </div>
                                                {pedidoMap[c.id] && (
                                                    <p className="text-xs mt-2">
                                                        <span className={`font-semibold px-2 py-0.5 rounded-full border ${ESTADO_ENVIO_COLORS[pedidoMap[c.id].estado]}`}>
                                                            {ESTADO_ENVIO_LABELS[pedidoMap[c.id].estado]}
                                                        </span>
                                                    </p>
                                                )}
                                                {c.notas && <p className="text-muted-foreground text-xs mt-2 italic">📝 {c.notas}</p>}
                                            </div>
                                            <div className="flex flex-col gap-2 shrink-0 min-w-[170px]">
                                                <button onClick={() => toggleEstadoPago(c)} className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded text-xs font-bold tracking-wide border transition-all ${c.estado_pago === "activo" ? "bg-green-500/20 border-green-500/40 text-green-300 hover:bg-green-500/30" : "bg-yellow-500/20 border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/30"}`}>
                                                    {c.estado_pago === "activo" ? <><ToggleRight size={15} />PLAN ACTIVO</> : <><ToggleLeft size={15} />PAGO PENDIENTE</>}
                                                </button>
                                                <a href={`https://wa.me/${c.telefono.replace(/\D/g, "")}?text=${buildContratoClienteMsg(c, pedidoMap[c.id])}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded text-xs font-bold tracking-wide hover:bg-[#1ebe5d] transition-colors"><SendHorizonal size={13} />ENVIAR AL CLIENTE</a>
                                                {c.estado_pago === "pendiente" && (<button onClick={() => toggleEstadoPago(c)} className="flex items-center justify-center gap-2 border border-green-500/40 text-green-400 px-4 py-2 rounded text-xs font-bold tracking-wide hover:bg-green-500/10 transition-colors"><CheckCircle size={13} />MARCAR COMO PAGADO</button>)}
                                                {c.estado_pago === "activo" && (<button onClick={() => toggleEstadoPago(c)} className="flex items-center justify-center gap-2 border border-yellow-500/40 text-yellow-400 px-4 py-2 rounded text-xs font-bold tracking-wide hover:bg-yellow-500/10 transition-colors"><Clock size={13} />MARCAR PENDIENTE</button>)}
                                                <button onClick={() => { setTab("envios"); }} className="flex items-center justify-center gap-2 border border-border text-muted-foreground px-4 py-2 rounded text-xs font-bold tracking-wide hover:text-foreground transition-colors"><Truck size={13} />IR A ENVÍOS</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ─── TAB: ENVÍOS ─── */}
                {tab === "envios" && (
                    <>
                        {/* Filtros de estado */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {([
                                { key: "todos", label: `Todos (${pedidos.length})` },
                                { key: "en_preparacion", label: `📦 En prep. (${pedidos.filter(p => p.estado === "en_preparacion").length})` },
                                { key: "pendiente_recogida", label: `⏳ P. recogida (${pedidos.filter(p => p.estado === "pendiente_recogida").length})` },
                                { key: "recogido", label: `🚚 Recogido (${pedidos.filter(p => p.estado === "recogido").length})` },
                                { key: "enviado", label: `📬 Enviado (${pedidos.filter(p => p.estado === "enviado").length})` },
                                { key: "en_ruta", label: `📍 En ruta (${pedidos.filter(p => p.estado === "en_ruta").length})` },
                                { key: "entregado", label: `✅ Entregado (${pedidos.filter(p => p.estado === "entregado").length})` },
                                { key: "sin_pedido", label: `❌ Sin pedido (${contratosSinPedido.length})` },
                            ] as const).map(f => (
                                <button key={f.key} onClick={() => setFiltroEnvio(f.key as typeof filtroEnvio)}
                                    className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors border ${filtroEnvio === f.key ? "bg-foreground text-background border-transparent" : "border-border text-muted-foreground hover:text-foreground"}`}>
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {loadingEnvios ? (
                            <div className="text-center py-16 text-muted-foreground text-sm">Cargando envíos...</div>
                        ) : (
                            <div className="space-y-3">
                                {/* Contratos sin pedido */}
                                {(filtroEnvio === "todos" || filtroEnvio === "sin_pedido") && contratosSinPedido.map(c => (
                                    <EnvioRow key={c.id} contrato={c} pedido={null} onPedidoChange={handlePedidoChange} />
                                ))}

                                {/* Contratos con pedido */}
                                {filtroEnvio !== "sin_pedido" && (
                                    filtroEnvio === "todos"
                                        ? contratosConPedido.map(c => (
                                            <EnvioRow key={c.id} contrato={c} pedido={pedidoMap[c.id] ?? null} onPedidoChange={handlePedidoChange} />
                                        ))
                                        : contratos
                                            .filter(c => pedidoMap[c.id]?.estado === filtroEnvio)
                                            .map(c => (
                                                <EnvioRow key={c.id} contrato={c} pedido={pedidoMap[c.id] ?? null} onPedidoChange={handlePedidoChange} />
                                            ))
                                )}

                                {filtroEnvio !== "todos" && filtroEnvio !== "sin_pedido" && filteredEnvios.length === 0 && contratos.filter(c => pedidoMap[c.id]?.estado === filtroEnvio).length === 0 && (
                                    <div className="text-center py-16"><Package size={32} className="mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground text-sm">No hay pedidos con ese estado</p></div>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* ─── TAB: ASESORES ─── */}
                {tab === "asesores" && (
                    <>
                        {/* Subheader */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                            <p className="text-muted-foreground text-xs">
                                Los clientes pueden verificar a tus asesores en <span className="text-foreground font-mono">/validar-asesor</span>
                            </p>
                            <button
                                onClick={() => { setAsesorForm(EMPTY_ASESOR); setEditingAsesor(null); setShowAsesorForm(true); }}
                                className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded text-xs font-bold tracking-widest hover:bg-foreground/90 transition-colors shrink-0"
                            >
                                <Plus size={14} />AGREGAR ASESOR
                            </button>
                        </div>

                        {/* Formulario crear/editar */}
                        {showAsesorForm && (
                            <div className="bg-card border border-border rounded-lg p-5 mb-5">
                                <p className="text-foreground text-xs font-bold tracking-widest uppercase mb-4">
                                    {editingAsesor ? `✏️ Editando: ${editingAsesor.nombre}` : "➕ Nuevo Asesor"}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {([
                                        { key: "codigo_asesor", label: "ID / Código *", placeholder: "ASR-001" },
                                        { key: "nombre", label: "Nombre *", placeholder: "Carlos" },
                                        { key: "apellido", label: "Apellido", placeholder: "Martínez" },
                                        { key: "telefono", label: "Telef. WhatsApp *", placeholder: "+593999111222" },
                                        { key: "email", label: "Email", placeholder: "carlos@email.com" },
                                        { key: "cargo", label: "Cargo", placeholder: "Asesor Comercial" },
                                        { key: "foto_url", label: "URL de foto", placeholder: "https://..." },
                                    ] as const).map(field => (
                                        <div key={field.key} className={field.key === "foto_url" ? "sm:col-span-2" : ""}>
                                            <label className="block text-muted-foreground text-xs mb-1 tracking-wider uppercase">{field.label}</label>
                                            <input
                                                value={(asesorForm as Record<string, string | boolean>)[field.key] as string ?? ""}
                                                onChange={e => setAsesorForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                                                placeholder={field.placeholder}
                                                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground text-xs outline-none focus:border-foreground/30 transition-colors"
                                            />
                                        </div>
                                    ))}
                                    {/* Activo toggle */}
                                    <div className="sm:col-span-2 flex items-center gap-3">
                                        <label className="text-muted-foreground text-xs tracking-wider uppercase">Estado:</label>
                                        <button
                                            type="button"
                                            onClick={() => setAsesorForm(prev => ({ ...prev, activo: !prev.activo }))}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all ${asesorForm.activo
                                                    ? "bg-green-500/20 border-green-500/40 text-green-300"
                                                    : "bg-red-500/20 border-red-500/40 text-red-300"
                                                }`}
                                        >
                                            {asesorForm.activo ? <><BadgeCheck size={13} />ACTIVO</> : <><ShieldOff size={13} />INACTIVO</>}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={handleSaveAsesor}
                                        disabled={savingAsesor}
                                        className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded text-xs font-bold hover:bg-foreground/90 transition-colors disabled:opacity-50"
                                    >
                                        <Save size={13} />{savingAsesor ? "Guardando..." : editingAsesor ? "GUARDAR CAMBIOS" : "CREAR ASESOR"}
                                    </button>
                                    <button
                                        onClick={() => { setShowAsesorForm(false); setEditingAsesor(null); setAsesorForm(EMPTY_ASESOR); }}
                                        className="border border-border text-muted-foreground px-4 py-2 rounded text-xs font-semibold hover:text-foreground transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Lista de asesores */}
                        {loadingAsesores ? (
                            <div className="text-center py-16 text-muted-foreground text-sm">Cargando asesores...</div>
                        ) : asesores.length === 0 ? (
                            <div className="text-center py-16">
                                <User size={32} className="mx-auto text-muted-foreground mb-3" />
                                <p className="text-muted-foreground text-sm">No hay asesores aún. Agrega el primero.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {asesores.map(a => (
                                    <div key={a.id} className="bg-card border border-border rounded-lg p-5">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            {/* Foto + info */}
                                            <div className="flex items-center gap-4">
                                                {a.foto_url ? (
                                                    <img src={a.foto_url} alt={a.nombre} className="w-14 h-14 rounded-full object-cover border-2 border-border shrink-0" />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-full bg-foreground/10 border-2 border-border flex items-center justify-center shrink-0">
                                                        <User size={24} className="text-muted-foreground" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="text-foreground font-bold text-sm">{a.nombre} {a.apellido}</p>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${a.activo
                                                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                                                : "bg-red-500/20 text-red-300 border-red-500/30"
                                                            }`}>
                                                            {a.activo ? "✅ ACTIVO" : "🔴 INACTIVO"}
                                                        </span>
                                                    </div>
                                                    <p className="text-muted-foreground text-xs mt-0.5">{a.cargo}</p>
                                                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                                                        <span className="bg-foreground/10 border border-foreground/20 text-foreground text-[11px] px-2 py-0.5 rounded font-mono">
                                                            ID: {a.codigo_asesor}
                                                        </span>
                                                        <span>📱 {a.telefono}</span>
                                                        {a.email && <span>✉️ {a.email}</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleToggleAsesor(a)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold border transition-all ${a.activo
                                                            ? "border-red-500/40 text-red-400 hover:bg-red-500/10"
                                                            : "border-green-500/40 text-green-400 hover:bg-green-500/10"
                                                        }`}
                                                    title={a.activo ? "Desactivar" : "Activar"}
                                                >
                                                    {a.activo ? <><ShieldOff size={13} />Desactivar</> : <><BadgeCheck size={13} />Activar</>}
                                                </button>
                                                <button
                                                    onClick={() => handleEditAsesor(a)}
                                                    className="flex items-center gap-1.5 border border-border text-muted-foreground px-3 py-1.5 rounded text-xs font-bold hover:text-foreground transition-colors"
                                                >
                                                    <Pencil size={13} />Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAsesor(a.id)}
                                                    className="flex items-center gap-1.5 border border-red-500/30 text-red-400 px-3 py-1.5 rounded text-xs font-bold hover:bg-red-500/10 transition-colors"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
            <FooterSection />

            {convertingLead && (
                <ConvertToContractModal lead={convertingLead} onClose={() => setConvertingLead(null)} onConverted={() => { setConvertingLead(null); fetchLeads(); fetchContratos(); }} />
            )}
            {showCreateContract && (
                <CreateContractModal onClose={() => setShowCreateContract(false)} onCreated={(c) => { setContratos(prev => [c, ...prev]); }} />
            )}
        </div>
    );
};

export default AdminPage;
