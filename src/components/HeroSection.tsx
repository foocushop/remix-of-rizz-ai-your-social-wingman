import { motion } from "framer-motion";
import { MessageCircle, Sparkles, LogIn, LogOut, Crown, Star, Users, Zap, TrendingUp } from "lucide-react";

interface HeroSectionProps {
  onStartScan: () => void;
  user: any;
  isVip: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const stats = [
  { label: "Conversations analysées", value: "47,800+", icon: MessageCircle },
  { label: "Utilisateurs actifs", value: "12,500+", icon: Users },
  { label: "Taux de succès", value: "89%", icon: TrendingUp },
  { label: "Temps de réponse", value: "<3s", icon: Zap },
];

const reviews = [
  { name: "Mamadou S.", rating: 5, text: "Wallah cette app m'a sauvé la vie. J'avais plus de réponse depuis 3 jours, Rizz-AI m'a sorti le message parfait. Résultat : date samedi 🔥", avatar: "🇸🇳" },
  { name: "Aïcha K.", rating: 5, text: "J'utilise l'app pour aider mes copines. On est devenues des expertes du DM grâce à l'IA. Le mode taquin est incroyable 😂", avatar: "🇨🇮" },
  { name: "Ousmane D.", rating: 5, text: "Depuis que j'ai le VIP, plus aucune conversation ne meurt en vu. Mon rizz est au max. Merci l'équipe !", avatar: "🇲🇱" },
  { name: "Fatou B.", rating: 4, text: "Super app ! Les réponses sont vraiment adaptées au contexte. Parfois c'est trop cash mais le mode ndaanaan est top 💜", avatar: "🇸🇳" },
];

const partners = [
  { name: "Wave", emoji: "💳" },
  { name: "Orange Money", emoji: "📱" },
  { name: "WhatsApp", emoji: "💬" },
  { name: "Instagram", emoji: "📸" },
  { name: "Snapchat", emoji: "👻" },
  { name: "TikTok", emoji: "🎵" },
];

const HeroSection = ({ onStartScan, user, isVip, onLogin, onLogout }: HeroSectionProps) => {
  return (
    <div className="relative overflow-hidden">
      {/* Top nav bar on hero */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 flex items-center justify-between px-4 py-3"
      >
        <h1 className="font-display text-lg font-bold gradient-text">Rizz-AI</h1>
        <div className="flex items-center gap-2">
          {user && isVip && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/20 text-secondary font-bold">VIP 👑</span>
          )}
          {user ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 glass-card rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 gradient-bg rounded-full px-4 py-1.5 text-xs font-medium text-primary-foreground"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </button>
          )}
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center px-4">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-lg mx-auto z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-muted-foreground">Powered by l'IA du Rizz</span>
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Ne laisse plus tes DM mourir en{" "}
            <span className="gradient-text">Vu.</span>
          </h1>

          <p className="text-muted-foreground text-lg mb-10 text-balance">
            Upload ta conversation. L'IA analyse le mood et te génère la réponse parfaite.
            Fini le syndrome de la page blanche. 🔥
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStartScan}
            className="gradient-bg gradient-bg-hover w-full sm:w-auto px-8 py-4 rounded-2xl font-display font-semibold text-lg text-primary-foreground flex items-center justify-center gap-3 mx-auto neon-glow-violet transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Scanner la Conv
          </motion.button>

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
        >💜</motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[10%] text-3xl opacity-20"
        >🔥</motion.div>
      </section>

      {/* Stats */}
      <section className="px-4 py-12">
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-4 text-center"
            >
              <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="px-4 py-12">
        <div className="max-w-lg mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl font-bold text-center mb-8"
          >
            Ce que disent nos <span className="gradient-text">rizzeurs</span>
          </motion.h2>
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{review.avatar}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{review.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-secondary text-secondary" />
                      ))}
                      {Array.from({ length: 5 - review.rating }).map((_, j) => (
                        <Star key={`e-${j}`} className="w-3 h-3 text-muted" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{review.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-2xl font-bold mb-2"
          >
            Compatible avec tes <span className="gradient-text">apps préférées</span>
          </motion.h2>
          <p className="text-sm text-muted-foreground mb-8">Fonctionne avec toutes tes conversations</p>
          <div className="flex flex-wrap justify-center gap-3">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl px-4 py-3 flex items-center gap-2"
              >
                <span className="text-lg">{partner.emoji}</span>
                <span className="text-sm font-medium text-foreground">{partner.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-8 gradient-border"
          >
            <Crown className="w-10 h-10 text-secondary mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-3">
              Prêt à <span className="gradient-text">rizzer</span> comme un pro ?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              3 analyses gratuites pour commencer. Passe VIP pour un accès illimité 👑
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onStartScan}
              className="gradient-bg gradient-bg-hover w-full py-4 rounded-2xl font-display font-semibold text-primary-foreground neon-glow-violet"
            >
              Commencer maintenant 🚀
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 Rizz-AI • L'assistant DM n°1 en Afrique de l'Ouest
        </p>
      </footer>
    </div>
  );
};

export default HeroSection;
