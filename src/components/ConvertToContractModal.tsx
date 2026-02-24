import { useState } from "react";
import { X, FileText, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Lead {
    id: string;
    nombre: string;
    apellido: string;
    whatsapp: string;
    email?: string;
    pais: string;
    ciudad: string;
    tipo_servicio: string;
    plan_nombre: string;
    plan_precio: string;
}

interface Props {
    lead: Lead;
    onClose: () => void;
    onConverted: () => void;
}

function genNumContrato(): string {
    const d = new Date();
    const yy = d.getFullYear();
    const rand = Math.floor(Math.random() * 9000) + 1000;
    return `STL-${yy}-${rand}`;
}

function genNumPedido(): string {
    const d = new Date();
    const yy = d.getFullYear();
    const rand = Math.floor(Math.random() * 90000) + 10000;
    return `PED-${yy}-${rand}`;
}

const ConvertToContractModal = ({ lead, onClose, onConverted }: Props) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [contratoNumero, setContratoNumero] = useState(genNumContrato);
    const [pedidoNumero, setPedidoNumero] = useState(genNumPedido);
    const [precio, setPrecio] = useState(
        // Extract numeric value from price string like "$49" or "290 S/."
        lead.plan_precio.replace(/[^0-9.,]/g, "").replace(",", ".")
    );
    const [moneda, setMoneda] = useState(lead.pais === "PE" ? "PEN" : "USD");
    const [numeroSim, setNumeroSim] = useState("");
    const [empresaEnvio, setEmpresaEnvio] = useState("");
    const [numeroGuia, setNumeroGuia] = useState("");
    const [fechaEstimada, setFechaEstimada] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 5);
        return d.toISOString().split("T")[0];
    });
    const [observaciones, setObservaciones] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // 1. Insert contrato
        const { data: contratoData, error: contratoErr } = await supabase
            .from("contratos")
            .insert([{
                numero_contrato: contratoNumero,
                nombre: lead.nombre,
                apellido: lead.apellido,
                telefono: lead.whatsapp,
                email: lead.email ?? "",
                pais: lead.pais,
                ciudad: lead.ciudad,
                tipo_servicio: lead.tipo_servicio,
                plan: lead.plan_nombre,
                precio: parseFloat(precio) || 0,
                moneda,
                numero_sim: numeroSim || null,
                fecha_compra: new Date().toISOString(),
            }])
            .select("id")
            .single();

        if (contratoErr) {
            setError(`Error al crear contrato: ${contratoErr.message}`);
            setLoading(false);
            return;
        }

        // 2. Insert pedido linked to contrato
        const { error: pedidoErr } = await supabase
            .from("pedidos")
            .insert([{
                contrato_id: contratoData.id,
                numero_pedido: pedidoNumero,
                estado: "procesando",
                empresa_envio: empresaEnvio || null,
                numero_guia: numeroGuia || null,
                fecha_estimada: fechaEstimada || null,
                observaciones: observaciones || null,
            }]);

        if (pedidoErr) {
            setError(`Error al crear pedido: ${pedidoErr.message}`);
            setLoading(false);
            return;
        }

        // 3. Mark lead as venta
        await supabase.from("leads").update({ estado: "venta" }).eq("id", lead.id);

        setLoading(false);
        setSuccess(true);
        setTimeout(onConverted, 1800);
    };

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <div>
                        <p className="text-foreground font-bold text-sm tracking-wide flex items-center gap-2">
                            <FileText size={15} /> Crear Contrato + Pedido
                        </p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                            Cliente: {lead.nombre} {lead.apellido}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                        <X size={20} />
                    </button>
                </div>

                {success ? (
                    <div className="px-6 py-12 text-center">
                        <p className="text-5xl mb-4">✅</p>
                        <p className="text-foreground text-lg font-bold mb-2">¡Contrato y pedido creados!</p>
                        <p className="text-muted-foreground text-sm">
                            <span className="font-mono text-foreground">{contratoNumero}</span> — el cliente ya puede verificarlo.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

                        {/* Client summary */}
                        <div className="bg-foreground/5 border border-border rounded-lg px-4 py-3 text-xs space-y-1">
                            <p className="text-foreground font-semibold mb-1">Datos del cliente</p>
                            <p className="text-muted-foreground">👤 {lead.nombre} {lead.apellido}</p>
                            <p className="text-muted-foreground">📱 {lead.whatsapp}{lead.email ? ` · ${lead.email}` : ""}</p>
                            <p className="text-muted-foreground">📍 {lead.ciudad} · {lead.pais}</p>
                            <p className="text-muted-foreground">{lead.tipo_servicio === "sim" ? "📱" : "📡"} {lead.plan_nombre} — {lead.plan_precio}</p>
                        </div>

                        {/* Contract section */}
                        <div>
                            <p className="text-foreground text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <FileText size={12} /> Contrato
                            </p>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-muted-foreground text-xs mb-1.5">Nº Contrato</label>
                                        <input
                                            required
                                            value={contratoNumero}
                                            onChange={(e) => setContratoNumero(e.target.value)}
                                            className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm font-mono outline-none focus:border-foreground/40"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-muted-foreground text-xs mb-1.5">Precio ({moneda})</label>
                                        <input
                                            required
                                            type="number"
                                            step="0.01"
                                            value={precio}
                                            onChange={(e) => setPrecio(e.target.value)}
                                            className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm outline-none focus:border-foreground/40"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-muted-foreground text-xs mb-1.5">Moneda</label>
                                        <select value={moneda} onChange={(e) => setMoneda(e.target.value)} className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm outline-none focus:border-foreground/40">
                                            <option value="USD">USD ($)</option>
                                            <option value="PEN">PEN (S/.)</option>
                                            <option value="HNL">HNL (L)</option>
                                        </select>
                                    </div>
                                    {lead.tipo_servicio === "sim" && (
                                        <div>
                                            <label className="block text-muted-foreground text-xs mb-1.5">Número SIM</label>
                                            <input
                                                value={numeroSim}
                                                onChange={(e) => setNumeroSim(e.target.value)}
                                                placeholder="Ej. +593 98 000 0000"
                                                className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm outline-none focus:border-foreground/40"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order section */}
                        <div>
                            <p className="text-foreground text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Package size={12} /> Pedido / Envío
                            </p>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-muted-foreground text-xs mb-1.5">Nº Pedido</label>
                                    <input
                                        required
                                        value={pedidoNumero}
                                        onChange={(e) => setPedidoNumero(e.target.value)}
                                        className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm font-mono outline-none focus:border-foreground/40"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-muted-foreground text-xs mb-1.5">Empresa de envío</label>
                                        <input
                                            value={empresaEnvio}
                                            onChange={(e) => setEmpresaEnvio(e.target.value)}
                                            placeholder="Ej. Servientrega"
                                            className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm outline-none focus:border-foreground/40"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-muted-foreground text-xs mb-1.5">Número de guía</label>
                                        <input
                                            value={numeroGuia}
                                            onChange={(e) => setNumeroGuia(e.target.value)}
                                            placeholder="Ej. SE-2026-00001"
                                            className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm font-mono outline-none focus:border-foreground/40"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-muted-foreground text-xs mb-1.5">Fecha estimada de entrega</label>
                                    <input
                                        type="date"
                                        value={fechaEstimada}
                                        onChange={(e) => setFechaEstimada(e.target.value)}
                                        className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm outline-none focus:border-foreground/40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-muted-foreground text-xs mb-1.5">Observaciones internas</label>
                                    <textarea
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        rows={2}
                                        placeholder="Notas del pedido..."
                                        className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm outline-none focus:border-foreground/40 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded text-sm font-bold tracking-widest uppercase hover:bg-foreground/90 transition-colors disabled:opacity-60"
                        >
                            <FileText size={14} />
                            {loading ? "Creando..." : "CONFIRMAR VENTA"}
                        </button>
                        <p className="text-muted-foreground text-[11px] text-center pb-1">
                            Esto crea el contrato y el pedido real en la base de datos. El lead quedará marcado como "Venta".
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ConvertToContractModal;
