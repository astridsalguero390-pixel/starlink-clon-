import { useState } from "react";
import { X, Send, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCountryContext, countryNames, countryFlags } from "./CountryContext";

export interface PlanInfo {
    planNombre: string;
    planPrecio: string;
    tipoServicio: "sim" | "antena";
    direccionPrellenada?: string;
}

interface Props {
    plan: PlanInfo;
    onClose: () => void;
}

// Country codes per country context
const COUNTRY_CODES: Record<string, { code: string; example: string }> = {
    HN: { code: "+504", example: "+504 9999-9999" },
    PE: { code: "+51", example: "+51 999 999 999" },
    EC: { code: "+593", example: "+593 99 123 4567" },
    CO: { code: "+57", example: "+57 300 123 4567" },
    MX: { code: "+52", example: "+52 55 1234 5678" },
    BO: { code: "+591", example: "+591 7000-0000" },
    GT: { code: "+502", example: "+502 5555-5555" },
    PA: { code: "+507", example: "+507 6000-0000" },
    SV: { code: "+503", example: "+503 7000-0000" },
    NI: { code: "+505", example: "+505 8000-0000" },
    CR: { code: "+506", example: "+506 8888-8888" },
    DO: { code: "+1", example: "+1 809 000 0000" },
};

const normalizePhone = (val: string) => val.replace(/\s/g, "").replace(/-/g, "");

const isValidWhatsapp = (val: string, code: string) => {
    const normalized = normalizePhone(val);
    // Must start with the country code and have at least 8 digits after it
    const codeClean = code.replace("+", "");
    const regex = new RegExp(`^\\+${codeClean}\\d{7,12}$`);
    return regex.test(normalized);
};

const AcquirePlanModal = ({ plan, onClose }: Props) => {
    const { country } = useCountryContext();
    const countryInfo = COUNTRY_CODES[country] ?? { code: "+504", example: "+504 9999-9999" };

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [whatsapp, setWhatsapp] = useState(countryInfo.code + " ");
    const [whatsappConfirm, setWhatsappConfirm] = useState("");
    const [whatsappError, setWhatsappError] = useState("");
    const [confirmError, setConfirmError] = useState("");
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        ciudad: "",
        barrio: "",
        direccion: plan.direccionPrellenada ?? "",
        referencia: "",
        notas: "",
    });

    const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((p) => ({ ...p, [k]: e.target.value }));

    const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        // Ensure the country code prefix stays
        if (!val.startsWith("+")) val = countryInfo.code + " ";
        setWhatsapp(val);
        setWhatsappError("");
    };

    const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWhatsappConfirm(e.target.value);
        setConfirmError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate WhatsApp
        const normalizedWA = normalizePhone(whatsapp);
        if (!isValidWhatsapp(whatsapp, countryInfo.code)) {
            setWhatsappError(`El número debe empezar con ${countryInfo.code} y tener formato válido. Ej: ${countryInfo.example}`);
            return;
        }

        const normalizedConfirm = normalizePhone(whatsappConfirm);
        if (normalizedWA !== normalizedConfirm) {
            setConfirmError("Los números no coinciden. Verificalos e inténtalo de nuevo.");
            return;
        }

        setLoading(true);
        const { error } = await supabase.from("leads").insert([
            {
                nombre: form.nombre,
                apellido: form.apellido,
                whatsapp: normalizedWA,
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

    const inputClass = "w-full bg-background border border-border rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-foreground/40";
    const inputErrorClass = "w-full bg-background border border-red-500/60 rounded px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:border-red-500";

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
                    <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                        {/* Plan summary */}
                        <div className="bg-foreground/5 border border-border rounded-lg px-4 py-3 flex justify-between items-center">
                            <p className="text-foreground text-xs font-semibold">Plan seleccionado</p>
                            <p className="text-foreground text-sm font-bold">{plan.planNombre} — {plan.planPrecio}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-muted-foreground text-xs mb-1.5">Nombre *</label>
                                <input required value={form.nombre} onChange={set("nombre")} placeholder="Ej. Juan" className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-muted-foreground text-xs mb-1.5">Apellido *</label>
                                <input required value={form.apellido} onChange={set("apellido")} placeholder="Ej. Pérez" className={inputClass} />
                            </div>
                        </div>

                        {/* WhatsApp field */}
                        <div>
                            <label className="block text-muted-foreground text-xs mb-1.5 flex items-center gap-1">
                                <Phone size={12} className="text-green-500" />
                                WhatsApp * <span className="text-muted-foreground/60">(incluye código de país {countryInfo.code})</span>
                            </label>
                            <input
                                required
                                value={whatsapp}
                                onChange={handleWhatsappChange}
                                placeholder={countryInfo.example}
                                className={whatsappError ? inputErrorClass : inputClass}
                            />
                            {whatsappError && (
                                <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
                                    <AlertCircle size={12} /> {whatsappError}
                                </p>
                            )}
                        </div>

                        {/* WhatsApp confirmation field */}
                        <div>
                            <label className="block text-muted-foreground text-xs mb-1.5 flex items-center gap-1">
                                <Phone size={12} className="text-green-500" />
                                Verifica tu número de WhatsApp *
                            </label>
                            <input
                                required
                                value={whatsappConfirm}
                                onChange={handleConfirmChange}
                                placeholder={`Repite: ${countryInfo.example}`}
                                className={confirmError ? inputErrorClass : inputClass}
                            />
                            {confirmError && (
                                <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
                                    <AlertCircle size={12} /> {confirmError}
                                </p>
                            )}
                            {!confirmError && whatsappConfirm && normalizePhone(whatsapp) === normalizePhone(whatsappConfirm) && (
                                <p className="text-green-500 text-[11px] mt-1.5 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> ¡Números coinciden!
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-xs mb-1.5">Correo electrónico</label>
                            <input type="email" value={form.email} onChange={set("email")} placeholder="Ej. juan@correo.com" className={inputClass} />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-muted-foreground text-xs mb-1.5">Ciudad / Municipio *</label>
                                <input required value={form.ciudad} onChange={set("ciudad")} placeholder="Ej. Quito" className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-muted-foreground text-xs mb-1.5">Barrio / Vereda / Sector</label>
                                <input value={form.barrio} onChange={set("barrio")} placeholder="Ej. El Bosque / Sector Norte" className={inputClass} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-xs mb-1.5">Dirección exacta</label>
                            <input value={form.direccion} onChange={set("direccion")} placeholder="Calle, número o descripción del lugar" className={inputClass} />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-xs mb-1.5">Punto de referencia</label>
                            <input value={form.referencia} onChange={set("referencia")} placeholder="Frente al colegio, junto a la tienda..." className={inputClass} />
                        </div>

                        <div>
                            <label className="block text-muted-foreground text-xs mb-1.5">Notas adicionales</label>
                            <textarea value={form.notas} onChange={set("notas")} rows={2} placeholder="Horario preferido, consultas, etc." className={`${inputClass} resize-none`} />
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
