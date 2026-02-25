import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, Zap, Crown, MapPin, MessageCircle } from "lucide-react";

const PRENOMS = [
  "Moussa", "Fatou", "Ibrahima", "Awa", "Ousmane", "Aminata", "Mamadou", "Mariam",
  "Abdoulaye", "Khady", "Cheikh", "Djeneba", "Modou", "Aïssatou", "Boubacar", "Rama",
];

const VILLES = ["Dakar", "Saly", "Saint-Louis", "Abidjan", "Thiès", "Ziguinchor", "Bamako", "Conakry"];

const STYLES = ["Ndaanaan 🦁", "Taquin 😉", "Poétique ✨", "Direct 🎯", "Mystérieux 🌙"];

const randomId = () => `RIZZ-${Math.floor(1000 + Math.random() * 9000)}`;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const generateMessage = (): { text: string; icon: React.ReactNode } => {
  const templates = [
    {
      text: `${pick(PRENOMS)} vient de générer une réponse Style ${pick(STYLES)}`,
      icon: <MessageCircle className="w-4 h-4 text-primary" />,
    },
    {
      text: `${randomId()} vient de passer VIP ! 💎`,
      icon: <Crown className="w-4 h-4 text-secondary" />,
    },
    {
      text: `Nouveau scan effectué à ${pick(VILLES)} à l'instant 🔥`,
      icon: <MapPin className="w-4 h-4 text-primary" />,
    },
    {
      text: `${pick(PRENOMS)} a sauvé ses DM avec une réponse ${pick(STYLES)}`,
      icon: <Zap className="w-4 h-4 text-secondary" />,
    },
    {
      text: `Un membre VIP est en train de rédiger...`,
      icon: <User className="w-4 h-4 text-primary" />,
    },
    {
      text: `${pick(PRENOMS)} de ${pick(VILLES)} vient de scanner une conv 📸`,
      icon: <MapPin className="w-4 h-4 text-primary" />,
    },
  ];
  return pick(templates);
};

const SocialProofToast = () => {
  const [current, setCurrent] = useState<{ text: string; icon: React.ReactNode; key: number } | null>(null);

  const showNext = useCallback(() => {
    const msg = generateMessage();
    setCurrent({ ...msg, key: Date.now() });
    setTimeout(() => setCurrent(null), 5000);
  }, []);

  useEffect(() => {
    const scheduleNext = () => {
      const delay = 15000 + Math.random() * 15000; // 15-30s
      return setTimeout(() => {
        showNext();
        timerId = scheduleNext();
      }, delay);
    };

    // First one after 8s
    let timerId = setTimeout(() => {
      showNext();
      timerId = scheduleNext();
    }, 8000);

    return () => clearTimeout(timerId);
  }, [showNext]);

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs pointer-events-none">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl
              backdrop-blur-xl
              border border-[hsl(var(--neon-violet)/0.4)]
              shadow-[0_0_20px_hsl(var(--neon-violet)/0.15)]"
            style={{ backgroundColor: "var(--glass-bg)" }}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              {current.icon}
            </div>
            <p className="text-xs text-foreground/90 leading-snug font-medium">
              {current.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialProofToast;
