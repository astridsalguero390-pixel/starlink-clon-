import { useState } from "react";
import { supabase, Contrato } from "@/lib/supabase";
import { X } from "lucide-react";

const PAISES = ["HN", "EC", "PE", "CO"] as const;
const MONEDAS: Record<string, string> = { HN: "USD", EC: "USD", PE: "PEN", CO: "USD" };
const DOMINIOS = "https://starlink.com.hn"; // cambiar al dominio real

function generarNumeroContrato(): string {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `STL-${year}-${rand}`;
}

interface Props {
    onClose: () => void;
    onCreated: (c: Contrato) => void;
}

const emptyForm = {
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    pais: "HN" as typeof PAISES[number],
    ciudad: "",
    tipo_servicio: "sim" as "sim" | "antena",
    plan: "",
    precio: "",
    numero_sim: "",
    notas: "",
    estado_pago: "pendiente" as "pendiente" | "activo",
};

const CreateContractModal = ({ onClose, onCreated }: Props) => {
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const set = (k: keyof typeof emptyForm, v: string) =>
        setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!form.nombre || !form.apellido || !form.telefono || !form.plan || !form.precio || !form.ciudad) {
            setError("Completa los campos obligatorios.");
            return;
        }
        setLoading(true);

        const numero_contrato = generarNumeroContrato();
        const moneda = MONEDAS[form.pais] ?? "USD";

        const { data, error: err } = await supabase
            .from("contratos")
            .insert({
                numero_contrato,
                nombre: form.nombre.trim(),
                apellido: form.apellido.trim(),
                telefono: form.telefono.trim(),
                email: form.email.trim() || "sin-email@starlink.local",
                pais: form.pais,
                ciudad: form.ciudad.trim(),
                tipo_servicio: form.tipo_servicio,
                plan: form.plan.trim(),
                precio: parseFloat(form.precio),
                moneda,
                numero_sim: form.numero_sim.trim() || null,
                notas: form.notas.trim() || null,
                estado_pago: form.estado_pago,
            })
            .select()
            .single();

        setLoading(false);

        if (err || !data) {
            setError(err?.message ?? "Error al crear el contrato.");
            return;
        }

        onCreated(data as Contrato);
        onClose();
    };

    const inputCls =
        "w-full bg-background border border-border rounded px-3 py-2 text-foreground text-sm placeholder:text-muted-foreground outline-none focus:border-foreground/40 transition-colors";
    const labelCls = "text-muted-foreground text-xs tracking-wider uppercase font-medium";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
                    <div>
                        <p className="text-muted-foreground text-xs tracking-widest uppercase">Admin</p>
                        <h2 className="text-foreground text-lg font-bold tracking-tight">Crear Contrato Manual</h2>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    {/* Cliente */}
                    <div>
                        <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-3">👤 Datos del cliente</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className={labelCls}>Nombre *</label>
                                <input className={inputCls} value={form.nombre} onChange={e => set("nombre", e.target.value)} placeholder="Juan" />
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>Apellido *</label>
                                <input className={inputCls} value={form.apellido} onChange={e => set("apellido", e.target.value)} placeholder="Pérez" />
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>Teléfono / WhatsApp *</label>
                                <input className={inputCls} value={form.telefono} onChange={e => set("telefono", e.target.value)} placeholder="+504 9999-0001" />
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>Email</label>
                                <input className={inputCls} value={form.email} onChange={e => set("email", e.target.value)} placeholder="cliente@email.com" type="email" />
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>País *</label>
                                <select className={inputCls} value={form.pais} onChange={e => set("pais", e.target.value)}>
                                    <option value="HN">🇭🇳 Honduras</option>
                                    <option value="EC">🇪🇨 Ecuador</option>
                                    <option value="PE">🇵🇪 Perú</option>
                                    <option value="CO">🇨🇴 Colombia</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>Ciudad *</label>
                                <input className={inputCls} value={form.ciudad} onChange={e => set("ciudad", e.target.value)} placeholder="Tegucigalpa" />
                            </div>
                        </div>
                    </div>

                    {/* Servicio */}
                    <div>
                        <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-3">📦 Servicio contratado</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className={labelCls}>Tipo de servicio *</label>
                                <select className={inputCls} value={form.tipo_servicio} onChange={e => set("tipo_servicio", e.target.value)}>
                                    <option value="sim">📱 SIM Card Satelital</option>
                                    <option value="antena">📡 Antena Starlink</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>Plan *</label>
                                <input className={inputCls} value={form.plan} onChange={e => set("plan", e.target.value)} placeholder="Plan Anual" />
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>Precio *</label>
                                <input className={inputCls} value={form.precio} onChange={e => set("precio", e.target.value)} placeholder="85.00" type="number" step="0.01" min="0" />
                            </div>
                            <div className="space-y-1">
                                <label className={labelCls}>Número SIM</label>
                                <input className={inputCls} value={form.numero_sim} onChange={e => set("numero_sim", e.target.value)} placeholder="8901234567890" />
                            </div>
                        </div>
                    </div>

                    {/* Estado de pago */}
                    <div>
                        <p className="text-foreground text-xs font-semibold tracking-widest uppercase mb-3">💳 Estado de pago</p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => set("estado_pago", "pendiente")}
                                className={`flex-1 py-2.5 rounded text-sm font-semibold border transition-all ${form.estado_pago === "pendiente"
                                    ? "bg-yellow-500/20 border-yellow-500/60 text-yellow-300"
                                    : "border-border text-muted-foreground hover:border-foreground/30"
                                    }`}
                            >
                                ⚠️ Pago Pendiente
                            </button>
                            <button
                                type="button"
                                onClick={() => set("estado_pago", "activo")}
                                className={`flex-1 py-2.5 rounded text-sm font-semibold border transition-all ${form.estado_pago === "activo"
                                    ? "bg-green-500/20 border-green-500/60 text-green-300"
                                    : "border-border text-muted-foreground hover:border-foreground/30"
                                    }`}
                            >
                                ✅ Plan Activo
                            </button>
                        </div>
                    </div>

                    {/* Notas */}
                    <div className="space-y-1">
                        <label className={labelCls}>Notas internas</label>
                        <textarea className={`${inputCls} resize-none`} rows={3} value={form.notas} onChange={e => set("notas", e.target.value)} placeholder="Observaciones sobre este cliente..." />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm border border-red-500/30 bg-red-500/10 rounded px-3 py-2">⚠️ {error}</p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 border border-border rounded py-2.5 text-sm text-muted-foreground hover:border-foreground/30 transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-foreground text-background rounded py-2.5 text-sm font-bold tracking-wider hover:bg-foreground/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "CREAR CONTRATO"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export { DOMINIOS };
export default CreateContractModal;
