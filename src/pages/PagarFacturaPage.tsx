import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import SEO from "@/components/SEO";
import { Search, Loader2, CheckCircle, Upload, Copy, ShieldCheck, Globe, CreditCard, SearchIcon } from "lucide-react";
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
    banco: string;
    titular: string;
    numero_cuenta: string;
    cci: string | null;
    qr_url: string | null;
    tipo_cuenta: string | null;
    documento_titular: string | null;
}

const PagarFacturaPage = () => {
    const [documento, setDocumento] = useState("");
    const [factura, setFactura] = useState<Factura | null>(null);
    const [metodos, setMetodos] = useState<MetodoPago[]>([]);
    const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!documento) return;
        setLoading(true);
        setFactura(null);
        setSelectedMetodo(null);

        try {
            const { data: factData, error: factError } = await supabase
                .from("facturas")
                .select("*")
                .eq("numero_documento", documento)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (factError) throw factError;
            setFactura(factData);

            const { data: metData, error: metError } = await supabase
                .from("metodos_pago")
                .select("*")
                .eq("pais", factData.pais)
                .eq("activo", true);

            if (metError) throw metError;
            setMetodos(metData);
            if (metData.length > 0) setSelectedMetodo(metData[0]);

        } catch (err) {
            console.error(err);
            toast.error("No se encontró factura pendiente.");
        } finally {
            setLoading(false);
        }
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
                .from('registros')
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
            toast.success("Pago reportado con éxito.");
        } catch (err: any) {
            console.error(err);
            toast.error("Error al subir el comprobante.");
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copiado al portapapeles");
    };

    const getSymbol = (pais: string) => {
        if (pais === 'HN') return 'L';
        if (pais === 'PE') return 'S/.';
        return '$';
    };

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-blue-500/30">
            <SEO
                title="Estado de Pago — Starlink Oficial"
                description="Verifica el estado de tus facturas y realiza pagos seguros."
            />
            <Navbar />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {!success ? (
                        <>
                            <div className="text-center mb-16">
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">MI PAGO</h1>
                                <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.3em] opacity-40">
                                    Verificación de Estado y Facturación
                                </p>
                            </div>

                            <form onSubmit={handleSearch} className="relative mb-20 max-w-2xl mx-auto group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" size={24} />
                                <input
                                    type="text"
                                    placeholder="NÚMERO DE IDENTIFICACIÓN"
                                    className="w-full bg-card/40 border border-white/5 rounded-full py-6 pl-16 pr-44 text-foreground focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-bold tracking-widest uppercase text-sm backdrop-blur-sm"
                                    value={documento}
                                    onChange={(e) => setDocumento(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-foreground text-background px-10 py-4 rounded-full text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white transition-all disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : "VERIFICAR"}
                                </button>
                            </form>

                            {factura && (
                                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                    <div className="bg-card/30 border border-white/5 rounded-[2.5rem] p-8 md:p-14 backdrop-blur-xl mb-10 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full -mr-64 -mt-64 blur-[120px] pointer-events-none" />

                                        <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
                                            <div className="flex-1">
                                                <div className="mb-8">
                                                    <div className={`inline-flex px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl ${factura.estado === 'pagado' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                            factura.estado === 'verificando' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                                                                factura.estado === 'rechazado' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                                    'bg-white/5 text-white/50 border border-white/10'
                                                        }`}>
                                                        {factura.estado === 'pendiente' && '📝 Pendiente de Pago'}
                                                        {factura.estado === 'verificando' && '🔍 Pago en Revisión'}
                                                        {factura.estado === 'pagado' && '✅ FACTURA PAGADA'}
                                                        {factura.estado === 'rechazado' && '❌ Pago Rechazado'}
                                                    </div>
                                                </div>

                                                <h2 className="text-4xl md:text-7xl font-black text-foreground mb-6 uppercase tracking-tight leading-none">{factura.nombre_cliente}</h2>

                                                <div className="flex flex-wrap gap-8 opacity-40">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-muted-foreground">ID Cliente</p>
                                                        <p className="text-sm font-bold tracking-wider">{factura.numero_documento}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-muted-foreground">Servicio Activo</p>
                                                        <p className="text-sm font-bold tracking-wider">{factura.plan_seleccionado}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-left md:text-right min-w-[200px]">
                                                <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase mb-3 opacity-40">Total a Cancelar</p>
                                                <p className="text-6xl md:text-9xl font-black text-white tabular-nums tracking-tighter shadow-sm">
                                                    <span className="text-2xl md:text-3xl font-light mr-2 align-top mt-4 inline-block">{getSymbol(factura.pais)}</span>
                                                    {factura.monto}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-16 border-t border-white/5 pt-16">
                                            {factura.estado === 'pagado' ? (
                                                <div className="flex flex-col items-center justify-center py-20 text-center bg-green-500/10 rounded-3xl border border-green-500/20 relative group overflow-hidden">
                                                    <div className="absolute inset-0 bg-green-500/5 transition-opacity group-hover:opacity-80" />
                                                    <div className="w-28 h-28 bg-green-500/20 rounded-full flex items-center justify-center mb-10 relative z-10 shadow-2xl">
                                                        <CheckCircle size={56} className="text-green-400" />
                                                    </div>
                                                    <h3 className="text-4xl md:text-6xl font-black text-green-400 mb-4 uppercase tracking-tighter relative z-10">FACTURA PAGADA</h3>
                                                    <p className="text-sm text-green-400/60 max-w-sm font-bold uppercase tracking-[0.2em] relative z-10">Transacción Confirmada • Gracias</p>
                                                </div>
                                            ) : factura.estado === 'verificando' ? (
                                                <div className="flex flex-col items-center justify-center py-20 text-center bg-yellow-500/10 rounded-3xl border border-yellow-500/20">
                                                    <div className="w-28 h-28 bg-yellow-500/20 rounded-full flex items-center justify-center mb-10 shadow-2xl">
                                                        <SearchIcon size={56} className="text-yellow-500 animate-pulse" />
                                                    </div>
                                                    <h3 className="text-4xl md:text-6xl font-black text-yellow-500 mb-4 uppercase tracking-tighter">PAGO EN REVISIÓN</h3>
                                                    <p className="text-sm text-yellow-500/60 max-w-sm font-bold uppercase tracking-[0.2em]">Validando Comprobante Bancario</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-12">
                                                    <div>
                                                        <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase mb-8 opacity-40">Selecciona un Medio de Pago</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {metodos.map((m) => (
                                                                <button
                                                                    key={m.id}
                                                                    onClick={() => setSelectedMetodo(m)}
                                                                    className={`p-8 rounded-[2rem] border transition-all text-left flex justify-between items-center group relative overflow-hidden ${selectedMetodo?.id === m.id
                                                                        ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20"
                                                                        : "border-white/5 bg-white/5 hover:border-white/20"
                                                                        }`}
                                                                >
                                                                    <div className="relative z-10">
                                                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 transition-colors ${selectedMetodo?.id === m.id ? "text-blue-400" : "text-muted-foreground"}`}>{m.banco}</p>
                                                                        <p className="text-xl font-black tracking-tight uppercase">{m.titular}</p>
                                                                    </div>
                                                                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all relative z-10 ${selectedMetodo?.id === m.id ? "border-blue-500 bg-blue-500 text-white" : "border-white/10"}`}>
                                                                        {selectedMetodo?.id === m.id && <CheckCircle size={16} />}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {selectedMetodo && (
                                                        <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 md:p-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                            <div className="flex flex-col lg:flex-row gap-16">
                                                                <div className="flex-1 space-y-12">
                                                                    <div>
                                                                        <h4 className="text-4xl md:text-5xl font-black mb-3 uppercase tracking-tighter text-foreground">{selectedMetodo.banco}</h4>
                                                                        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] opacity-30">Instrucciones de Transferencia</p>
                                                                    </div>

                                                                    <div className="space-y-10">
                                                                        {[
                                                                            { label: "Número de cuenta", value: selectedMetodo.numero_cuenta },
                                                                            { label: "CCI (Cuenta Interbancaria)", value: selectedMetodo.cci },
                                                                            { label: "Titular de la cuenta", value: selectedMetodo.titular }
                                                                        ].map((item, i) => item.value && (
                                                                            <div key={i} className="group cursor-pointer" onClick={() => copyToClipboard(item.value!)}>
                                                                                <div className="flex items-center gap-2 mb-3">
                                                                                    <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase opacity-40">{item.label}</p>
                                                                                    <Copy size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                                </div>
                                                                                <p className="text-2xl md:text-4xl font-black tracking-tighter break-all uppercase border-b-2 border-white/5 pb-4 group-hover:border-blue-500/30 transition-colors">
                                                                                    {item.value}
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {(selectedMetodo.qr_url || (selectedMetodo.banco.toLowerCase().includes('yape') && !selectedMetodo.qr_url)) && (
                                                                    <div className="flex flex-col items-center gap-8">
                                                                        <div className="bg-white p-6 rounded-[3rem] shadow-2xl border-[12px] border-white/10">
                                                                            <img
                                                                                src={selectedMetodo.qr_url ?? "/assets/qr/yape-peru.png"}
                                                                                alt="QR Pago"
                                                                                className="w-72 h-72 md:w-96 md:h-96 object-contain rounded-2xl"
                                                                            />
                                                                        </div>
                                                                        <div className="bg-white text-black px-10 py-3.5 rounded-full shadow-lg">
                                                                            <p className="text-[10px] font-black tracking-[0.3em] uppercase">ESCANEAR PARA PAGAR</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="bg-white text-black rounded-[3rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
                                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" />
                                                        <div className="max-w-md mx-auto relative z-10">
                                                            <div className="w-24 h-24 bg-black/5 rounded-[2rem] flex items-center justify-center mx-auto mb-10">
                                                                <Upload size={36} className="text-black" />
                                                            </div>
                                                            <h3 className="text-4xl font-black mb-4 uppercase tracking-tighter">REPORTAR PAGO</h3>
                                                            <p className="text-sm font-bold mb-14 opacity-50 leading-relaxed uppercase tracking-[0.2em]">Sube tu comprobante bancario para activar tu conexión inmediatamente.</p>

                                                            <label className={`w-full flex items-center justify-center gap-4 bg-black text-white py-6 px-10 rounded-full font-black text-xs tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-xl ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                                <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleUpload} disabled={uploading} />
                                                                {uploading ? <Loader2 className="animate-spin" size={20} /> : 'CARGAR COMPROBANTE'}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-12 mt-10 opacity-20">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck size={20} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Red Encriptada</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Globe size={20} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Certificación Oficial</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white text-black rounded-[4rem] p-16 md:p-32 text-center animate-in zoom-in duration-1000 shadow-[0_0_100px_rgba(255,255,255,0.1)]">
                            <div className="bg-black/5 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-12 text-black shadow-inner">
                                <CheckCircle size={64} />
                            </div>
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 uppercase leading-tight">SOLICITUD<br />ENVIADA</h2>
                            <p className="text-xl font-bold mb-16 max-w-lg mx-auto opacity-50 uppercase tracking-[0.2em] leading-relaxed">
                                Hemos recibido tu comprobante. Nuestro equipo verificará la transacción a la brevedad.
                            </p>
                            <div className="bg-black text-white p-10 rounded-[2.5rem] inline-block w-full max-w-lg shadow-2xl">
                                <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 mb-5 text-blue-400">Estado de la cuenta</p>
                                <p className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none">CONEXIÓN SATELITAL EN PROCESO 📡⚡</p>
                            </div>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="block mx-auto mt-20 text-black/30 text-[10px] font-black tracking-[0.4em] uppercase hover:text-black transition-all"
                            >
                                VOLVER AL INICIO
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
