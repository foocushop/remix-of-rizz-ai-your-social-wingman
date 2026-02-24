import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onStartScan: () => void;
}

const HeroSection = ({ onStartScan }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center max-w-lg mx-auto z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8"
        >
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="text-sm text-muted-foreground">Powered by l'IA du Rizz</span>
        </motion.div>

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-6">
          Ne laisse plus tes DM mourir en{" "}
          <span className="gradient-text">Vu.</span>
        </h1>

        <p className="text-muted-foreground text-lg mb-10 text-balance">
          Upload ta conversation. L'IA analyse le mood et te génère la réponse parfaite. 
          Fini le syndrome de la page blanche. 🔥
        </p>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onStartScan}
          className="gradient-bg gradient-bg-hover w-full sm:w-auto px-8 py-4 rounded-2xl font-display font-semibold text-lg text-primary-foreground flex items-center justify-center gap-3 mx-auto neon-glow-violet transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          Scanner la Conv
        </motion.button>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-sm text-muted-foreground"
        >
          +2,400 conversations analysées cette semaine 💬
        </motion.p>
      </motion.div>

      {/* Floating emojis */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[10%] text-3xl opacity-20"
      >
        💜
      </motion.div>
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[20%] right-[10%] text-3xl opacity-20"
      >
        🔥
      </motion.div>
    </section>
  );
};

export default HeroSection;
