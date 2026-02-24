import { useState } from "react";
import { CheckCircle, MapPin } from "lucide-react";
import AcquirePlanModal, { PlanInfo } from "./AcquirePlanModal";

type Step = "idle" | "covered" | "modal";

const TrialBanner = () => {
  const [address, setAddress] = useState("");
  const [step, setStep] = useState<Step>("idle");
  const [savedAddress, setSavedAddress] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);

  const handleComenzar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setSavedAddress(address.trim());
    setStep("covered");
  };

  const handleAdquirir = () => {
    // Open modal with a generic "Plan a tu medida" — user picks plan inside the form
    setSelectedPlan({
      planNombre: "Plan a tu medida",
      planPrecio: "—",
      tipoServicio: "sim",
      direccionPrellenada: savedAddress,
    });
    setStep("modal");
  };

  const handleClose = () => {
    setStep("covered");
    setSelectedPlan(null);
  };

  const handleReset = () => {
    setStep("idle");
    setAddress("");
    setSavedAddress("");
  };

  return (
    <>
      <section className="bg-background py-20 text-center px-6">
        <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase font-medium">
          PRUEBA DE 30 DÍAS
        </p>
        <p className="text-foreground text-xl md:text-2xl font-medium mt-3 max-w-lg mx-auto">
          Si no quedas satisfecho, devuelve Starlink para un reembolso completo.
        </p>

        <div className="max-w-md mx-auto mt-10">

          {/* Step 1 — Input address */}
          {step === "idle" && (
            <form onSubmit={handleComenzar}>
              <div className="flex gap-0">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección de servicio"
                  className="flex-1 bg-card border border-border rounded-l px-4 py-3 text-foreground placeholder:text-muted-foreground text-sm outline-none focus:border-foreground/30 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-foreground text-background px-6 py-3 rounded-r text-sm font-semibold tracking-wider shrink-0 hover:bg-foreground/90 transition-colors"
                >
                  COMENZAR
                </button>
              </div>
            </form>
          )}

          {/* Step 2 — Coverage confirmed */}
          {step === "covered" && (
            <div className="space-y-4">
              {/* Coverage badge */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-5 py-4 flex items-start gap-3 text-left">
                <CheckCircle size={20} className="text-green-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-400 font-bold text-sm">¡Tenemos cobertura en tu área!</p>
                  <p className="text-muted-foreground text-xs mt-0.5 flex items-center gap-1">
                    <MapPin size={11} /> {savedAddress}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleAdquirir}
                className="w-full bg-foreground text-background py-3 rounded text-sm font-bold tracking-widest uppercase hover:bg-foreground/90 transition-all"
              >
                ADQUIRIR MI PLAN →
              </button>

              <button
                onClick={handleReset}
                className="text-muted-foreground text-xs hover:text-foreground transition-colors underline underline-offset-2"
              >
                Cambiar dirección
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Acquisition modal */}
      {step === "modal" && selectedPlan && (
        <AcquirePlanModal
          plan={selectedPlan}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default TrialBanner;
