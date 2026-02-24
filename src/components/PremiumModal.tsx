import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, Zap, Star, Infinity } from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: "Starter",
    price: "990 FCFA",
    period: "/semaine",
    credits: "15 analyses",
    icon: Zap,
    popular: false,
  },
  {
    name: "Rizz Illimité",
    price: "2,990 FCFA",
    period: "/mois",
    credits: "Illimité",
    icon: Crown,
    popular: true,
  },
];

const PremiumModal = ({ isOpen, onClose }: PremiumModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="glass-card rounded-t-3xl p-6 max-w-lg mx-auto">
              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-6" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-bg mb-4 neon-glow-violet">
                  <Crown className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  Débloque le Rizz <span className="gradient-text">Illimité</span>
                </h2>
                <p className="text-muted-foreground text-sm">
                  T'es trop dans le game pour être limité 🔥
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {[
                  "Analyses illimitées",
                  "Réponses personnalisées IA",
                  "Punchlines exclusives",
                  "Conseils en temps réel",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </div>

              {/* Plans */}
              <div className="space-y-3 mb-6">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  return (
                    <motion.button
                      key={plan.name}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all ${
                        plan.popular
                          ? "gradient-bg neon-glow-violet"
                          : "glass-card gradient-border"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          plan.popular ? "text-primary-foreground" : "text-primary"
                        }`}
                      />
                      <div className="text-left flex-1">
                        <p
                          className={`font-display font-semibold ${
                            plan.popular ? "text-primary-foreground" : "text-foreground"
                          }`}
                        >
                          {plan.name}
                        </p>
                        <p
                          className={`text-xs ${
                            plan.popular
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {plan.credits}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-display font-bold ${
                            plan.popular ? "text-primary-foreground" : "text-foreground"
                          }`}
                        >
                          {plan.price}
                        </p>
                        <p
                          className={`text-xs ${
                            plan.popular
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {plan.period}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Payment buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="glass-card rounded-xl py-3 px-4 text-center"
                >
                  <p className="font-display font-semibold text-sm text-foreground">
                    Wave 🌊
                  </p>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="glass-card rounded-xl py-3 px-4 text-center"
                >
                  <p className="font-display font-semibold text-sm text-foreground">
                    Orange Money 🟠
                  </p>
                </motion.button>
              </div>

              <p className="text-center text-muted-foreground text-xs">
                Annule quand tu veux • Paiement sécurisé
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;
