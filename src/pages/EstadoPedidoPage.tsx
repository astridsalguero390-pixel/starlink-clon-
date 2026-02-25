import { useState, useEffect } from "react";
import { supabase, Pedido, Contrato } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { Search, Package, Truck, MapPin, CheckCircle, Clock, Box } from "lucide-react";
import SEO from "@/components/SEO";

// ─── Order State Config ───────────────────────────────────────────────────────
const ESTADOS: { key: Pedido["estado"]; label: string; icon: React.ElementType; desc: string }[] = [
    { key: "en_preparacion", label: "En preparación", icon: Box, desc: "Estamos preparando tu paquete para el despacho." },
    { key: "pendiente_recogida", label: "Pendiente de recogida", icon: Clock, desc: "El paquete está listo. Esperando que el transportista lo recoja." },
    { key: "recogido", label: "Recogido por transportista", icon: Package, desc: "El transportista ya recogió tu paquete." },
    { key: "enviado", label: "Enviado", icon: Truck, desc: "Tu paquete fue despachado y está en camino." },
    { key: "en_ruta", label: "En ruta", icon: MapPin, desc: "Tu pedido está en ruta hacia tu dirección." },
    { key: "entregado", label: "Entregado ✓", icon: CheckCircle, desc: "¡Tu pedido fue entregado exitosamente!" },
];

function getEstadoIndex(estado: Pedido["estado"]) {
    return ESTADOS.findIndex((e) => e.key === estado);
}

const EstadoPedidoPage = () => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [contrato, setContrato] = useState<Contrato | null>(null);
    const [error, setError] = useState("");
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);

    // ── Realtime subscription ────────────────────────────────────────────────
    useEffect(() => {
        if (!pedido) return;

        const channel = supabase
            .channel(`pedido-${pedido.id}`)
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "pedidos", filter: `id=eq.${pedido.id}` },
                (payload) => {
                    setPedido(payload.new as Pedido);
                    setLastUpdate(new Date().toLocaleTimeString("es-ES"));
                }
            )
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [pedido?.id]);

    // ── Search ───────────────────────────────────────────────────────────────
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setError("");
        setPedido(null);
        setContrato(null);

        const q = query.trim();

        // Try by numero_pedido first
        let pedidoData: Pedido | null = null;
        let contratoData: Contrato | null = null;

        const { data: byPedido } = await supabase
            .from("pedidos")
            .select("*")
            .ilike("numero_pedido", `%${q}%`)
            .limit(1)
            .single();

        if (byPedido) {
            pedidoData = byPedido as Pedido;
        } else {
            // Try by numero_contrato
            const { data: contr } = await supabase
                .from("contratos")
                .select("*")
                .ilike("numero_contrato", `%${q}%`)
                .limit(1)
                .single();

            if (contr) {
                contratoData = contr as Contrato;
                const { data: ped } = await supabase
                    .from("pedidos")
                    .select("*")
                    .eq("contrato_id", contr.id)
                    .limit(1)
                    .single();
                if (ped) pedidoData = ped as Pedido;
            }
        }

        setLoading(false);

        if (!pedidoData) {
            setError("No se encontró ningún pedido con ese código. Verifica el número de pedido o contrato.");
            return;
        }

        setPedido(pedidoData);

        // load contrato if not loaded yet
        if (!contratoData) {
            const { data: c } = await supabase.from("contratos").select("*").eq("id", pedidoData.contrato_id).single();
            if (c) setContrato(c as Contrato);
        } else {
            setContrato(contratoData);
        }
    };

    const estadoIndex = pedido ? getEstadoIndex(pedido.estado) : -1;

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Estado de Mi Pedido Starlink — Seguimiento en Tiempo Real"
                description="Sigue el estado de tu pedido Starlink en tiempo real. Ingresa tu número de pedido o contrato y conoce dónde está tu equipo."
                canonical="/estado-pedido"
                noIndex={true}
            />
            <Navbar />
            <div className="pt-28 pb-20 px-6 max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-10">
                    <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium mb-2">
                        📦 Portal del Cliente
                    </p>
                    <h1 className="text-foreground text-3xl md:text-4xl font-bold tracking-tight">
                        Estado del Pedido
                    </h1>
                    <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                        Ingresa tu número de pedido o número de contrato para ver el estado en tiempo real.
                    </p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-0 mb-8">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Nº de pedido o contrato..."
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

                {/* Pedido result */}
                {pedido && (
                    <div className="bg-card border border-border rounded-lg overflow-hidden">

                        {/* Header */}
                        <div className="bg-foreground/5 border-b border-border px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Package size={20} className="text-foreground" />
                                <div>
                                    <p className="text-foreground font-bold tracking-widest text-sm">{pedido.numero_pedido}</p>
                                    {contrato && <p className="text-muted-foreground text-xs">{contrato.nombre} {contrato.apellido}</p>}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="bg-foreground text-background text-[11px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                                    {ESTADOS.find((e) => e.key === pedido.estado)?.label ?? pedido.estado}
                                </span>
                                {lastUpdate && (
                                    <p className="text-muted-foreground text-[10px] mt-1">🟢 Actualizado: {lastUpdate}</p>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="px-6 py-6">
                            <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-5">
                                Seguimiento del pedido
                            </p>
                            <div className="relative">
                                {/* Vertical line */}
                                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

                                <div className="space-y-6">
                                    {ESTADOS.map((estado, i) => {
                                        const done = i <= estadoIndex;
                                        const active = i === estadoIndex;
                                        const Icon = estado.icon;
                                        return (
                                            <div key={estado.key} className="flex items-start gap-5 relative">
                                                {/* Dot */}
                                                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 transition-all ${active
                                                    ? "bg-foreground border-foreground text-background"
                                                    : done
                                                        ? "bg-foreground/20 border-foreground/40 text-foreground"
                                                        : "bg-background border-border text-muted-foreground"
                                                    }`}>
                                                    <Icon size={14} />
                                                </div>
                                                {/* Text */}
                                                <div className="pt-1">
                                                    <p className={`text-sm font-semibold ${done ? "text-foreground" : "text-muted-foreground"}`}>
                                                        {estado.label}
                                                    </p>
                                                    {active && (
                                                        <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">
                                                            {estado.desc}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Shipping details */}
                        {(pedido.empresa_envio || pedido.numero_guia || pedido.fecha_estimada) && (
                            <div className="px-6 py-4 border-t border-border">
                                <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-3">Datos de envío</p>
                                {pedido.empresa_envio && (
                                    <div className="flex justify-between py-2 border-b border-border text-xs">
                                        <span className="text-muted-foreground">Empresa de envíos</span>
                                        <span className="text-foreground font-medium">{pedido.empresa_envio}</span>
                                    </div>
                                )}
                                {pedido.numero_guia && (
                                    <div className="flex justify-between py-2 border-b border-border text-xs">
                                        <span className="text-muted-foreground">Número de guía</span>
                                        <span className="text-foreground font-medium font-mono">{pedido.numero_guia}</span>
                                    </div>
                                )}
                                {pedido.fecha_estimada && (
                                    <div className="flex justify-between py-2 text-xs">
                                        <span className="text-muted-foreground">Fecha estimada de entrega</span>
                                        <span className="text-foreground font-medium">
                                            {new Date(pedido.fecha_estimada).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {pedido.observaciones && (
                            <div className="px-6 py-4 border-t border-border">
                                <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-2">Observaciones</p>
                                <p className="text-muted-foreground text-xs leading-relaxed">{pedido.observaciones}</p>
                            </div>
                        )}

                        {/* Realtime badge */}
                        <div className="px-6 py-3 border-t border-border bg-foreground/5">
                            <p className="text-muted-foreground text-[11px] text-center">
                                🔴 Conectado — Esta página se actualiza automáticamente en tiempo real
                            </p>
                        </div>
                    </div>
                )}
            </div>
            <FooterSection />
        </div>
    );
};

export default EstadoPedidoPage;
