import { motion } from "framer-motion";

interface RizzMeterProps {
  score: number;
}

const RizzMeter = ({ score }: RizzMeterProps) => {
  const getLabel = () => {
    if (score >= 80) return { text: "Wawaw, t'es chaud 🔥", color: "text-secondary" };
    if (score >= 50) return { text: "Ça se joue bien 💪", color: "text-primary" };
    return { text: "Faut bosser le game 😤", color: "text-muted-foreground" };
  };

  const label = getLabel();

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-semibold text-sm">Rizz-mètre</h3>
        <span className="font-display font-bold text-2xl gradient-text">{score}%</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 rounded-full bg-muted overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full gradient-bg"
        />
      </div>

      <p className={`text-sm font-medium ${label.color}`}>{label.text}</p>
    </div>
  );
};

export default RizzMeter;
