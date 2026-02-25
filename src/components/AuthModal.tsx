import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Phone, User, Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const countryCodes = [
  { code: "+221", country: "🇸🇳 Sénégal" },
  { code: "+225", country: "🇨🇮 Côte d'Ivoire" },
  { code: "+223", country: "🇲🇱 Mali" },
  { code: "+224", country: "🇬🇳 Guinée" },
  { code: "+226", country: "🇧🇫 Burkina Faso" },
  { code: "+228", country: "🇹🇬 Togo" },
  { code: "+229", country: "🇧🇯 Bénin" },
  { code: "+237", country: "🇨🇲 Cameroun" },
  { code: "+241", country: "🇬🇦 Gabon" },
  { code: "+242", country: "🇨🇬 Congo" },
  { code: "+243", country: "🇨🇩 RD Congo" },
  { code: "+33", country: "🇫🇷 France" },
  { code: "+1", country: "🇺🇸 USA / 🇨🇦 Canada" },
];

type Step = "form" | "verifying" | "otp" | "success";

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [step, setStep] = useState<Step>("form");
  const [pseudo, setPseudo] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+221");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitForm = async () => {
    if (!pseudo.trim() || !phone.trim()) {
      toast.error("Remplis tous les champs waw !");
      return;
    }
    setStep("verifying");
    // Simulate WhatsApp verification delay
    setTimeout(() => setStep("otp"), 2500);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      toast.error("Entre un code à 4 chiffres");
      return;
    }
    setLoading(true);
    try {
      // Use email-based auth with phone as identifier
      const email = `${countryCode.replace("+", "")}${phone}@rizz-ai.app`;
      const password = `rizz_${countryCode}${phone}_${pseudo}`;

      // Try signup first
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { pseudo, phone, country_code: countryCode },
        },
      });

      if (signUpError) {
        // If user exists, try login
        if (signUpError.message.includes("already") || signUpError.message.includes("exists")) {
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (loginError) throw loginError;
        } else {
          throw signUpError;
        }
      }

      setStep("success");
      setTimeout(() => {
        onSuccess();
        onClose();
        resetForm();
      }, 1500);
    } catch (e: any) {
      console.error("Auth error:", e);
      toast.error("Erreur d'inscription. Réessaie !");
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep("form");
    setPseudo("");
    setPhone("");
    setOtp("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="glass-card rounded-t-3xl p-6 max-w-lg mx-auto">
              <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-6" />
              {step !== "verifying" && step !== "success" && (
                <button onClick={() => { onClose(); resetForm(); }} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}

              <AnimatePresence mode="wait">
                {step === "form" && (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-4 neon-glow-violet">
                        <User className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h2 className="font-display text-2xl font-bold mb-2">
                        Crée ton <span className="gradient-text">compte</span>
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Inscris-toi pour continuer à rizzer 🔥
                      </p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Pseudo</label>
                        <input
                          type="text"
                          value={pseudo}
                          onChange={(e) => setPseudo(e.target.value)}
                          placeholder="Ton pseudo de légende"
                          className="w-full glass-card rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          maxLength={30}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">Numéro de téléphone</label>
                        <div className="flex gap-2">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="glass-card rounded-xl px-3 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                          >
                            {countryCodes.map((c) => (
                              <option key={c.code} value={c.code} className="bg-card text-foreground">
                                {c.country} ({c.code})
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            placeholder="77 123 45 67"
                            className="flex-1 glass-card rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            maxLength={15}
                          />
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSubmitForm}
                      className="w-full gradient-bg gradient-bg-hover py-4 rounded-2xl font-display font-semibold text-primary-foreground neon-glow-violet"
                    >
                      Recevoir le code 📱
                    </motion.button>
                  </motion.div>
                )}

                {step === "verifying" && (
                  <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-8">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold mb-2">Vérification en cours...</h3>
                    <p className="text-muted-foreground text-sm">
                      Envoi du code via WhatsApp à {countryCode} {phone}
                    </p>
                  </motion.div>
                )}

                {step === "otp" && (
                  <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="text-center mb-8">
                      <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                      <h3 className="font-display text-xl font-bold mb-2">Entre le code</h3>
                      <p className="text-muted-foreground text-sm">
                        Code envoyé à {countryCode} {phone}
                      </p>
                    </div>

                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="• • • •"
                      className="w-full glass-card rounded-xl px-4 py-4 text-center text-foreground text-2xl font-display tracking-[1em] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-6"
                      maxLength={4}
                    />

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="w-full gradient-bg gradient-bg-hover py-4 rounded-2xl font-display font-semibold text-primary-foreground neon-glow-violet disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Valider ✅"}
                    </motion.button>

                    <p className="text-center text-muted-foreground text-xs mt-4">
                      Pour le test, entre n'importe quel code à 4 chiffres
                    </p>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="font-display text-xl font-bold mb-2">Bienvenue {pseudo} ! 🎉</h3>
                    <p className="text-muted-foreground text-sm">
                      Tu es maintenant dans le game
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
