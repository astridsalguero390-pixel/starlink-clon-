import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xneohafentxjapawlrkr.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZW9oYWZlbnR4amFwYXdscmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5NDc1NDMsImV4cCI6MjA4NzUyMzU0M30.eFBdHy9wCmKNbX_qonQ8Duirock5t7UJA8bVouGuMiQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Contrato {
    id: string;
    numero_contrato: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    pais: string;
    ciudad: string;
    tipo_servicio: "sim" | "antena";
    plan: string;
    precio: number;
    moneda: string;
    numero_sim?: string;
    fecha_compra: string;
    notas?: string;
    estado_pago: "pendiente" | "activo";
    created_at: string;
}

export interface Pedido {
    id: string;
    contrato_id: string;
    numero_pedido: string;
    estado: "procesando" | "preparando" | "enviado" | "en_camino" | "entregado";
    empresa_envio?: string;
    numero_guia?: string;
    fecha_estimada?: string;
    observaciones?: string;
    updated_at: string;
}
