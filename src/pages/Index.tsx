import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import UploadZone from "@/components/UploadZone";
import ScanningAnimation from "@/components/ScanningAnimation";
import ResponseCards, { AIResponses } from "@/components/ResponseCards";
import RizzMeter from "@/components/RizzMeter";
import PremiumModal from "@/components/PremiumModal";
import AuthModal from "@/components/AuthModal";
import { ArrowLeft, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

type AppState = "hero" | "upload" | "scanning" | "results";

interface AnalysisResult {
  rizzScore: number;
  moodAnalysis: string;
  responses: AIResponses;
}

const FREE_LIMIT = 3;

const Index = () => {
  const [state, setState] = useState<AppState>("hero");
  const [showPremium, setShowPremium] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const pendingFileRef = useRef<File | null>(null);

  // Auth & user state
  const [user, setUser] = useState<User | null>(null);
  const [isVip, setIsVip] = useState(false);
  const [uploadsCount, setUploadsCount] = useState(0);

  // Session-based counter for anonymous users
  const [anonUploads, setAnonUploads] = useState(() => {
    const stored = sessionStorage.getItem("rizz_anon_uploads");
    return stored ? parseInt(stored, 10) : 0;
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Load profile & role data
        setTimeout(() => {
          loadUserData(session.user.id);
        }, 0);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadUserData(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    const [profileRes, roleRes] = await Promise.all([
      supabase.from("profiles").select("uploads_count").eq("id", userId).single(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    if (profileRes.data) setUploadsCount(profileRes.data.uploads_count);
    if (roleRes.data) setIsVip(roleRes.data.some((r: any) => r.role === "vip" || r.role === "admin"));
  };

  const creditsLeft = user
    ? (isVip ? 999 : Math.max(0, FREE_LIMIT - uploadsCount))
    : Math.max(0, FREE_LIMIT - anonUploads);

  const handleStartScan = () => setState("upload");

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleUpload = useCallback(
    (file: File) => {
      // Check limits
      if (!user && anonUploads >= FREE_LIMIT) {
        setShowAuth(true);
        return;
      }
      if (user && !isVip && uploadsCount >= FREE_LIMIT) {
        setShowPremium(true);
        return;
      }

      pendingFileRef.current = file;
      setState("scanning");
    },
    [user, anonUploads, uploadsCount, isVip]
  );

  const handleScanComplete = useCallback(async () => {
    const file = pendingFileRef.current;
    if (!file) { setState("upload"); return; }

    try {
      const imageBase64 = await fileToBase64(file);

      // Get previous analyses for context (if logged in)
      let previousAnalyses: any[] = [];
      if (user) {
        const { data } = await supabase
          .from("analyses")
          .select("mood_analysis, responses")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);
        if (data) previousAnalyses = data;
      }

      const { data, error: fnError } = await supabase.functions.invoke(
        "analyze-conversation",
        { body: { imageBase64, previousAnalyses } }
      );

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      const result: AnalysisResult = {
        rizzScore: data.rizzScore ?? Math.floor(Math.random() * 40) + 55,
        moodAnalysis: data.moodAnalysis ?? "",
        responses: data.responses,
      };

      // Save analysis & increment counter
      if (user) {
        await Promise.all([
          supabase.from("analyses").insert({
            user_id: user.id,
            rizz_score: result.rizzScore,
            mood_analysis: result.moodAnalysis,
            responses: result.responses as any,
          }),
          supabase.from("profiles").update({ uploads_count: uploadsCount + 1 }).eq("id", user.id),
        ]);
        setUploadsCount((c) => c + 1);
      } else {
        const newCount = anonUploads + 1;
        setAnonUploads(newCount);
        sessionStorage.setItem("rizz_anon_uploads", String(newCount));
      }

      setAnalysisResult(result);
      setState("results");
    } catch (e: any) {
      console.error("Analysis failed:", e);
      toast.error(e.message || "Erreur lors de l'analyse. Réessaie !");
      setState("upload");
    }
  }, [user, uploadsCount, anonUploads]);

  const handleBack = () => {
    if (state === "results" || state === "upload") setState("hero");
    if (state === "scanning") setState("upload");
  };

  const handleAuthSuccess = () => {
    // Reset anon counter since user is now logged in
    sessionStorage.removeItem("rizz_anon_uploads");
    setAnonUploads(0);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Top bar */}
      <AnimatePresence>
        {state !== "hero" && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-0 z-40 glass-card px-4 py-3 flex items-center justify-between"
          >
            <button onClick={handleBack} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold gradient-text">Rizz-AI</h1>
            <button
              onClick={() => (user && !isVip && creditsLeft <= 0 ? setShowPremium(true) : !user ? setShowAuth(true) : null)}
              className="flex items-center gap-1 text-xs text-secondary"
            >
              <Crown className="w-4 h-4" />
              <span className="font-medium">{isVip ? "∞" : creditsLeft}</span>
            </button>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Content */}
      <AnimatePresence mode="wait">
        {state === "hero" && (
          <motion.div key="hero" exit={{ opacity: 0, y: -20 }}>
            <HeroSection onStartScan={handleStartScan} />
          </motion.div>
        )}
        {state === "upload" && (
          <motion.div key="upload" exit={{ opacity: 0 }}>
            <UploadZone onUpload={handleUpload} />
          </motion.div>
        )}
        {state === "scanning" && (
          <motion.div key="scanning" exit={{ opacity: 0 }}>
            <ScanningAnimation onComplete={handleScanComplete} />
          </motion.div>
        )}
        {state === "results" && analysisResult && (
          <motion.div key="results" exit={{ opacity: 0 }}>
            <div className="px-4 pt-4 pb-2 max-w-lg mx-auto">
              <RizzMeter score={analysisResult.rizzScore} />
            </div>
            <ResponseCards
              creditsLeft={creditsLeft}
              onUseCredit={() => {}}
              aiResponses={analysisResult.responses}
              moodAnalysis={analysisResult.moodAnalysis}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed bottom CTA */}
      <AnimatePresence>
        {state === "results" && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 p-4 glass-card z-30"
          >
            <div className="max-w-lg mx-auto">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (!user && anonUploads >= FREE_LIMIT) {
                    setShowAuth(true);
                  } else if (user && !isVip && uploadsCount >= FREE_LIMIT) {
                    setShowPremium(true);
                  } else {
                    setState("upload");
                  }
                }}
                className="w-full gradient-bg gradient-bg-hover py-4 rounded-2xl font-display font-semibold text-primary-foreground neon-glow-violet"
              >
                {creditsLeft > 0 || isVip ? "Scanner une autre Conv 🔥" : !user ? "S'inscrire pour continuer 🔐" : "Débloquer le Premium 👑"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
};

export default Index;
