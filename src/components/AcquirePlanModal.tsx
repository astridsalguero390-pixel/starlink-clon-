import { useState } from "react";
import { X, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCountryContext, countryNames, countryFlags } from "./CountryContext";

export interface PlanInfo {
    planNombre: string;
    planPrecio: string;
    tipoServicio: "sim" | "antena";
    direccionPrellenada?: string; // optional: pre-fills address from hero
}

interface Props {
    plan: PlanInfo;
    onClose: () => void;
}

const AcquirePlanModal = ({ plan, onClose }: Props) => {
    const { country } = useCountryContext();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        whatsapp: "",
        email: "",
        ciudad: "",
        barrio: "",
        direccion: plan.direccionPrellenada ?? "",
        referencia: "",
        notas: "",
    });

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((p) => ({ ...p, [k]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from("leads").insert([
            {
                nombre: form.nombre,
                apellido: form.apellido,
                whatsapp: form.whatsapp,
                email: form.email || null,
                pais: country,
                ciudad: form.ciudad,
                barrio: form.barrio || null,
                direccion: form.direccion || null,
                referencia: form.referencia || null,
                tipo_servicio: plan.tipoServicio,
                plan_nombre: plan.planNombre,
                plan_precio: plan.planPrecio,
                notas: form.notas || null,
                estado: "nuevo",
            },
        ]);
        setLoading(false);
        if (!error) setSuccess(true);
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-card border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl">
                    <div>
                        <p className="text-foreground font-bold text-sm tracking-wide">
                            {plan.tipoServicio === "sim" ? "📱" : "📡"} Adquirir — {plan.planNombre}
                        </p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                            {countryFlags[country]} {countryNames[country]} · {plan.planPrecio}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* Success State */}
                {success ? (
                    <div className="px-6 py-12 text-center">
                        <p className="text-5xl mb-4">✓</p>
                        <p className="text-foreground text-lg font-bold mb-2">¡Solicitud enviada!</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            Recibimos tu pedido del <strong className="text-foreground">{plan.planNombre}</strong>.<br />
                            Un asesor te contactará por WhatsApp en breve.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-6 bg-foreground text-background px-6 py-2.5 rounded text-sm font-semibold tracking-wider hover:bg-foreground/90 transition-colors"
                        >
                            CERRAR
                        </button>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                        {/* Plan summary */}
                        <div className="bg-foreground/5 border border-border rounded-lg px-4 py-3 flex justify-between items-center">
                            <p className="text-foreground text-xs font-semibold">Plan seleccionado</p>
                            <p className="text-foreground text-sm font-bold">{plan.planNombre} — {plan.planPrecio}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-muted-foreground text-xs mb-1.5">Nombre *</label>
                                <input required value={form.nombre} onChange={set("nombre")} placeholder="Ej. Juan" className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/40" />
                            </div>
                            <div>
                                <label className="block text-muted-foreground text-xs mb-1.5">Apellido *</label>
                                <input required value={form.apellido} onChange={set("apellido")} placeholder="Ej. Pérez" className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/40" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-xs mb-1.5">WhatsApp * <span className="text-muted-foreground/60">(con código de país)</span></label>
                            <input required value={form.whatsapp} onChange={set("whatsapp")} placeholder="Ej. +593 99 123 4567" className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/40" />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-xs mb-1.5">Correo electrónico</label>
                            <input type="email" value={form.email} onChange={set("email")} placeholder="Ej. juan@correo.com" className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/40" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-muted-foreground text-xs mb-1.5">Ciudad / Municipio *</label>
                                <input required value={form.ciudad} onChange={set("ciudad")} placeholder="Ej. Quito" className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/40" />
                            </div>
                            <div>
                                <label className="block text-muted-foreground text-xs mb-1.5">Barrio / Vereda / Sector</label>
                                <input value={form.barrio} onChange={set("barrio")} placeholder="Ej. El Bosque / Sector Norte" className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/40" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-xs mb-1.5">Dirección exacta</label>
                            <input value={form.direccion} onChange={set("direccion")} placeholder="Calle, número o descripción del lugar" className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/40" />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-xs mb-1.5">Punto de referencia</label>
                            <input value={form.referencia} onChange={set("referencia")} placeholder="Frente al colegio, junto a la tienda..." className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/40" />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-xs mb-1.5">Notas adicionales</label>
                            <textarea value={form.notas} onChange={set("notas")} rows={2} placeholder="Horario preferido, consultas, etc." className="w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/40 resize-none" />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded text-sm font-bold tracking-widest uppercase hover:bg-foreground/90 transition-colors disabled:opacity-60 mt-2"
                        >
                            <Send size={15} />
                            {loading ? "Enviando..." : "Enviar solicitud"}
                        </button>
                        <p className="text-muted-foreground text-[11px] text-center pb-1">
                            Un asesor te contactará por WhatsApp con los detalles del pedido.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AcquirePlanModal;
