import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import SEO from "@/components/SEO";
import { Search, Loader2, CreditCard, Banknote, ShieldCheck, Upload, CheckCircle2, Copy, QrCode } from "lucide-react";
import { toast } from "sonner";

interface Factura {
    id: string;
    numero_documento: string;
    nombre_cliente: string;
    telefono_cliente: string;
    pais: string;
    plan_seleccionado: string;
    monto: number;
    estado: string;
    comprobante_url: string | null;
}

interface MetodoPago {
    id: string;
    pais: string;
    banco: string;
    titular: string;
    numero_cuenta: string;
    cci: string | null;
    tipo_cuenta: string | null;
    documento_titular: string | null;
    qr_url: string | null;
}

const PagarFacturaPage = () => {
    const [documento, setDocumento] = useState("");
    const [loading, setLoading] = useState(false);
    const [factura, setFactura] = useState<Factura | null>(null);
    const [metodos, setMetodos] = useState<MetodoPago[]>([]);
    const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!documento.trim()) return;

        setLoading(true);
        setFactura(null);
        setSelectedMetodo(null);

        try {
            const { data, error } = await supabase
                .from("facturas")
                .select("*")
                .eq("numero_documento", documento.trim())
                .eq("estado", "pendiente")
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    toast.error("No se encontró ninguna factura pendiente para este documento.");
                } else {
                    toast.error("Error al buscar la factura.");
                }
            } else {
                setFactura(data);
                fetchMetodos(data.pais);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMetodos = async (pais: string) => {
        const { data } = await supabase
            .from("metodos_pago")
            .select("*")
            .eq("pais", pais)
            .eq("activo", true);
        if (data) setMetodos(data);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !factura) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${factura.id}_${Math.random()}.${fileExt}`;
            const filePath = `comprobantes/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('registros') // Usamos un bucket existente o crearemos uno
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('registros')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from("facturas")
                .update({
                    comprobante_url: publicUrl,
                    estado: 'verificando'
                })
                .eq("id", factura.id);

            if (updateError) throw updateError;

            setSuccess(true);
            toast.success("Pago reportado con éxito. Estamos verificando.");
        } catch (err: any) {
            console.error(err);
            toast.error("Error al subir el comprobante.");
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copiado al portapapeles`);
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Pagar Factura — Starlink Oficial"
                description="Verifica y paga tus facturas pendientes de Starlink de forma segura."
            />
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    {!success ? (
                        <>
                            <div className="text-center mb-12">
                                <h1 className="text-foreground text-3xl md:text-5xl font-bold tracking-tight mb-4">Pagar Factura</h1>
                                <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                                    Coloca tu número de identificación para verificar facturas pendientes y realizar tu pago de forma segura.
                                </p>
                            </div>

                            {/* Search Form */}
                            <form onSubmit={handleSearch} className="relative mb-12">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                <input
                                    type="text"
                                    placeholder="Número de identificación (Cédula, DNI, RUC...)"
                                    className="w-full bg-card border border-border rounded-xl py-4 pl-12 pr-32 text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
                                    value={documento}
                                    onChange={(e) => setDocumento(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-foreground text-background px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-foreground/90 transition-all disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : "VERIFICAR"}
                                </button>
                            </form>

                            {factura && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Bill Details Card */}
                                    <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="bg-foreground/10 p-2 rounded-lg text-foreground">
                                                <CreditCard size={24} />
                                            </div>
                                            <h2 className="text-xl font-bold tracking-tight">Detalles de la Factura</h2>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                                            <div>
                                                <p className="text-muted-foreground mb-1">Cliente</p>
                                                <p className="text-foreground font-semibold text-lg">{factura.nombre_cliente}</p>
                                                <p className="text-muted-foreground text-xs">{factura.numero_documento}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-1">Monto a Pagar</p>
                                                <p className="text-foreground font-bold text-3xl">{factura.pais === 'HN' ? 'L' : factura.pais === 'PE' ? 'S/.' : '$'} {factura.monto}</p>
                                            </div>
                                            <div className="md:col-span-2 pt-4 border-t border-border/50">
                                                <p className="text-muted-foreground mb-2">Servicio / Plan</p>
                                                <div className="bg-background/50 border border-border p-3 rounded-xl">
                                                    <p className="text-foreground font-medium">📡 {factura.plan_seleccionado}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Methods */}
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                            <Banknote className="text-muted-foreground" size={24} />
                                            Método de Pago
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Selecciona el banco de tu preferencia para realizar la transferencia:</p>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {metodos.map((m) => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => setSelectedMetodo(m)}
                                                    className={`p-6 rounded-2xl border-2 transition-all text-left ${selectedMetodo?.id === m.id
                                                            ? "border-foreground bg-foreground/5"
                                                            : "border-border bg-card hover:border-foreground/30"
                                                        }`}
                                                >
                                                    <p className="text-foreground font-bold text-lg mb-1">{m.banco}</p>
                                                    <p className="text-muted-foreground text-xs uppercase tracking-widest">{m.tipo_cuenta ?? "Cuenta Bancaria"}</p>
                                                </button>
                                            ))}
                                            {metodos.length === 0 && (
                                                <div className="sm:col-span-2 py-8 text-center bg-card border border-dashed border-border rounded-2xl">
                                                    <p className="text-muted-foreground text-sm">No hay métodos configurados para {factura.pais}.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Selected Method Details */}
                                    {selectedMetodo && (
                                        <div className="bg-foreground text-background rounded-3xl p-8 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-background/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

                                            <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                                                <div className="space-y-6 flex-1">
                                                    <div>
                                                        <h4 className="text-2xl font-bold mb-1">{selectedMetodo.banco}</h4>
                                                        <p className="opacity-70 text-sm">Transfiere el monto exacto a esta cuenta profesional</p>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="group cursor-pointer" onClick={() => copyToClipboard(selectedMetodo.numero_cuenta, "Número de cuenta")}>
                                                            <p className="text-[10px] uppercase tracking-widest opacity-60 font-medium mb-1 flex items-center gap-2">
                                                                Número de cuenta <Copy size={12} />
                                                            </p>
                                                            <p className="text-xl font-mono font-bold">{selectedMetodo.numero_cuenta}</p>
                                                        </div>

                                                        {selectedMetodo.cci && (
                                                            <div className="group cursor-pointer" onClick={() => copyToClipboard(selectedMetodo.cci!, "Código Interbancario")}>
                                                                <p className="text-[10px] uppercase tracking-widest opacity-60 font-medium mb-1 flex items-center gap-2">
                                                                    CCI (Cuenta Interbancaria) <Copy size={12} />
                                                                </p>
                                                                <p className="text-xl font-mono font-bold">{selectedMetodo.cci}</p>
                                                            </div>
                                                        )}

                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-widest opacity-60 font-medium mb-1">Titular de la cuenta</p>
                                                            <p className="text-lg font-bold">{selectedMetodo.titular}</p>
                                                            {selectedMetodo.documento_titular && <p className="text-xs opacity-70">ID: {selectedMetodo.documento_titular}</p>}
                                                        </div>
                                                    </div>
                                                </div>

                                                {(selectedMetodo.qr_url || (selectedMetodo.banco.toLowerCase().includes('yape') && !selectedMetodo.qr_url)) && (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="bg-white p-3 rounded-2xl shadow-xl">
                                                            <img
                                                                src={selectedMetodo.qr_url ?? "/assets/qr/yape-peru.png"}
                                                                alt="QR Pago"
                                                                className="w-40 h-40 object-contain rounded-lg"
                                                            />
                                                        </div>
                                                        <p className="text-[10px] font-bold tracking-widest uppercase opacity-70">Escanea para pagar</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-8 pt-8 border-t border-background/20 text-xs leading-relaxed italic opacity-80">
                                                Le confirmamos que el titular de esta cuenta es el gerente oficial de Starlink encargado en {factura.pais === 'HN' ? 'Honduras' : factura.pais === 'EC' ? 'Ecuador' : factura.pais === 'PE' ? 'Perú' : 'el país'}, por lo que su pago se encuentra completamente respaldado y seguro.
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload Receipt */}
                                    {selectedMetodo && (
                                        <div className="space-y-6 pt-6">
                                            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-center">
                                                <Upload className="mx-auto text-muted-foreground mb-4" size={32} />
                                                <h3 className="text-lg font-bold text-foreground mb-2">Reportar Pago</h3>
                                                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                                                    Una vez realizada la transferencia, sube una foto o PDF de tu comprobante de pago.
                                                </p>

                                                <div className="relative inline-block w-full max-w-sm">
                                                    <input
                                                        type="file"
                                                        accept="image/*,application/pdf"
                                                        onChange={handleUpload}
                                                        className="hidden"
                                                        id="receipt-upload"
                                                        disabled={uploading}
                                                    />
                                                    <label
                                                        htmlFor="receipt-upload"
                                                        className="flex items-center justify-center gap-3 w-full bg-foreground text-background py-4 rounded-xl text-sm font-bold tracking-widest uppercase cursor-pointer hover:bg-foreground/90 transition-all disabled:opacity-50"
                                                    >
                                                        {uploading ? <Loader2 className="animate-spin" size={20} /> : "CARGAR COMPROBANTE"}
                                                    </label>
                                                </div>
                                            </div>

                                            {/* Security badges */}
                                            <div className="flex flex-col items-center gap-4 py-8 border-y border-border/50">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex flex-col items-center gap-1">
                                                        <ShieldCheck className="text-foreground" size={24} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Pagos Protegidos</span>
                                                    </div>
                                                    <div className="w-px h-8 bg-border" />
                                                    <div className="flex flex-col items-center gap-1">
                                                        <CheckCircle2 className="text-foreground" size={24} />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">Datos Oficiales</span>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest leading-relaxed">
                                                    Garantía Starlink 100% · Transacciones Respaldadas · Líder en Conexión Satelital
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-card border border-border rounded-3xl p-10 md:p-16 text-center animate-in zoom-in duration-500">
                            <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-3xl font-bold tracking-tight mb-4">¡Pago Reportado!</h2>
                            <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                                Estamos verificando tu pago. En unos momentos el asesor con el que te comunicaste se pondrá en contacto contigo para validar tu orden.
                            </p>
                            <div className="bg-foreground text-background p-6 rounded-2xl inline-block w-full max-w-sm">
                                <p className="text-xs font-bold tracking-widest uppercase opacity-80 mb-2">Gracias por confiar en nosotros</p>
                                <p className="text-xl font-bold">Estamos para servirle 📡🤝</p>
                            </div>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="block mx-auto mt-10 text-muted-foreground text-sm font-semibold hover:text-foreground transition-all"
                            >
                                Volver al inicio
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <FooterSection />
        </div>
    );
};

export default PagarFacturaPage;
