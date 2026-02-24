import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Heart, Laugh, Zap, Copy, Check } from "lucide-react";

const responses = [
  {
    id: "ndaanaan",
    label: "Le Ndaanaan",
    icon: Heart,
    description: "Poétique, respectueux, classe",
    color: "text-secondary",
    messages: [
      "Wallah, ton sourire c'est le genre de truc qui rend Dakar encore plus belle qu'elle l'est déjà 🌙",
      "T'as ce petit truc... genre tu passes et le mood de toute la room change. J'aimerais bien comprendre ce power-là autour d'un thiébou 😌",
      "Sérieux, tes photos c'est de l'art. Mais j'ai l'impression que la meilleure version c'est en vrai. On vérifie ? ☕",
    ],
  },
  {
    id: "taquin",
    label: "Le Taquin",
    icon: Laugh,
    description: "Humour, challenge, taquinerie",
    color: "text-primary",
    messages: [
      "Attends... t'as mis 3h à répondre? T'étais en train de chercher la réponse parfaite ou bien ? 😏",
      "Ton enjaillement en story c'est 10/10, mais en DM t'es timide comme ça ? Challenge: prouve-moi le contraire 🎯",
      "Wawaw tu fais la mystérieuse là... Ça marche pas avec moi, j'ai le WiFi du charme, je capte tout 📡😂",
    ],
  },
  {
    id: "cash",
    label: "Le Cash",
    icon: Zap,
    description: "Direct, proposition, no loss",
    color: "text-neon-rose",
    messages: [
      "Écoute, on peut continuer à s'envoyer des emojis pendant 3 mois OU on peut aller prendre un café demain. T'es dans le game? ☕",
      "Pas de détour: t'es intéressante, j'suis intéressant, et la vie est courte. Almadies samedi, t'es partante? 🌊",
      "Soyons cash: cette conv' a du potentiel. Mais les DM c'est limité. Passe en mode réel, je t'invite. Wave ou Orange Money pour le jus, c'est moi qui gère 😎",
    ],
  },
];

interface ResponseCardsProps {
  creditsLeft: number;
  onUseCredit: () => void;
}

const ResponseCards = ({ creditsLeft, onUseCredit }: ResponseCardsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const current = responses[activeTab];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 pb-32"
    >
      <div className="max-w-lg mx-auto">
        {/* Tab bar */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
          {responses.map((r, i) => {
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

        {/* Description */}
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
            {current.messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-4 group"
              >
                <p className="text-foreground text-sm leading-relaxed mb-3">
                  {msg}
                </p>
                <button
                  onClick={() => handleCopy(msg, i)}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {copiedIndex === i ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copier
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Credits info */}
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
