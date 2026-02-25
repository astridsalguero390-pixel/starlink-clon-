import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SatelitalPage from "./pages/SatelitalPage";
import AntenaPage from "./pages/AntenaPage";
import VerificarContratoPage from "./pages/VerificarContratoPage";
import EstadoPedidoPage from "./pages/EstadoPedidoPage";
import CoberturaPage from "./pages/CoberturaPage";
import AdminPage from "./pages/AdminPage";
import ValidarAsesorPage from "./pages/ValidarAsesorPage";
import { CountryProvider } from "./components/CountryContext";
import SocialProof from "./components/SocialProof";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <CountryProvider>
          <SocialProof />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/satelital" element={<SatelitalPage />} />
            <Route path="/antena" element={<AntenaPage />} />
            <Route path="/verificar-contrato" element={<VerificarContratoPage />} />
            <Route path="/estado-pedido" element={<EstadoPedidoPage />} />
            <Route path="/cobertura" element={<CoberturaPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/validar-asesor" element={<ValidarAsesorPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </CountryProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
