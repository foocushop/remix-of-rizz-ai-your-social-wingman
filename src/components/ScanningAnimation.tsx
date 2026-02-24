import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const scanSteps = [
  { text: "Analyse du mood...", emoji: "🧠" },
  { text: "Détection du sarcasme...", emoji: "😏" },
  { text: "Calcul du charisme...", emoji: "✨" },
  { text: "Génération des punchlines...", emoji: "🔥" },
];

interface ScanningAnimationProps {
  onComplete: () => void;
}

const ScanningAnimation = ({ onComplete }: ScanningAnimationProps) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= scanSteps.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]"
    >
      {/* Scanner circle */}
      <div className="relative w-32 h-32 mb-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full gradient-border"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-2 rounded-full gradient-bg opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            key={step}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl"
          >
            {scanSteps[step].emoji}
          </motion.span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 w-full max-w-xs">
        {scanSteps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: i <= step ? 1 : 0.3,
              x: 0,
            }}
            transition={{ delay: i * 0.2, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div
              className={`w-2 h-2 rounded-full transition-colors ${
                i <= step ? "gradient-bg" : "bg-muted"
              }`}
            />
            <span
              className={`text-sm font-medium transition-colors ${
                i <= step ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s.text}
            </span>
            {i === step && (
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="ml-auto text-xs text-primary"
              >
                ●
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ScanningAnimation;
