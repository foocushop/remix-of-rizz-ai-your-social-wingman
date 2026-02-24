import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, Laugh, Zap, Copy, Check } from "lucide-react";

export interface AIResponses {
  ndaanaan: string[];
  taquin: string[];
  cash: string[];
}

interface ResponseCardsProps {
  creditsLeft: number;
  onUseCredit: () => void;
  aiResponses?: AIResponses;
  moodAnalysis?: string;
}

const tabConfig = [
  { id: "ndaanaan", label: "Le Ndaanaan", icon: Heart, description: "Poétique, respectueux, classe" },
  { id: "taquin", label: "Le Taquin", icon: Laugh, description: "Humour, challenge, taquinerie" },
  { id: "cash", label: "Le Cash", icon: Zap, description: "Direct, proposition, no loss" },
];

const ResponseCards = ({ creditsLeft, aiResponses, moodAnalysis }: ResponseCardsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const current = tabConfig[activeTab];
  const messages = aiResponses
    ? aiResponses[current.id as keyof AIResponses] || []
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 pb-32"
    >
      <div className="max-w-lg mx-auto">
        {/* Mood analysis */}
        {moodAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-4 mb-6 text-center"
          >
            <p className="text-sm text-muted-foreground">🧠 Analyse du mood</p>
            <p className="text-foreground text-sm font-medium mt-1">{moodAnalysis}</p>
          </motion.div>
        )}

        {/* Tab bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
          {tabConfig.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.button
                key={r.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                  i === activeTab
                    ? "gradient-bg text-primary-foreground neon-glow-violet"
                    : "glass-card text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{r.label}</span>
                <span className="sm:hidden">{r.label.split(" ")[1]}</span>
              </motion.button>
            );
          })}
        </div>

        <p className="text-muted-foreground text-sm mb-4 text-center">
          {current.description}
        </p>

        {/* Response cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-4 group"
              >
                <p className="text-foreground text-sm leading-relaxed mb-3">{msg}</p>
                <button
                  onClick={() => handleCopy(msg, i)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {copiedIndex === i ? (
                    <><Check className="w-3.5 h-3.5" /> Copié !</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copier</>
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-xs">
            {creditsLeft > 0
              ? `${creditsLeft} crédit${creditsLeft > 1 ? "s" : ""} restant${creditsLeft > 1 ? "s" : ""}`
              : "Plus de crédits disponibles"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ResponseCards;
