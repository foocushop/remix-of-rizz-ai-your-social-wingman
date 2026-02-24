import { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import UploadZone from "@/components/UploadZone";
import ScanningAnimation from "@/components/ScanningAnimation";
import ResponseCards, { AIResponses } from "@/components/ResponseCards";
import RizzMeter from "@/components/RizzMeter";
import PremiumModal from "@/components/PremiumModal";
import { ArrowLeft, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AppState = "hero" | "upload" | "scanning" | "results";

interface AnalysisResult {
  rizzScore: number;
  moodAnalysis: string;
  responses: AIResponses;
}

const Index = () => {
  const [state, setState] = useState<AppState>("hero");
  const [credits, setCredits] = useState(3);
  const [showPremium, setShowPremium] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pendingFileRef = useRef<File | null>(null);

  const handleStartScan = () => setState("upload");

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = useCallback(
    (file: File) => {
      if (credits <= 0) {
        setShowPremium(true);
        return;
      }
      pendingFileRef.current = file;
      setCredits((c) => c - 1);
      setError(null);
      setState("scanning");
    },
    [credits]
  );

  const handleScanComplete = useCallback(async () => {
    const file = pendingFileRef.current;
    if (!file) {
      setState("upload");
      return;
    }

    try {
      const imageBase64 = await fileToBase64(file);

      const { data, error: fnError } = await supabase.functions.invoke(
        "analyze-conversation",
        { body: { imageBase64 } }
      );

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      setAnalysisResult({
        rizzScore: data.rizzScore ?? Math.floor(Math.random() * 40) + 55,
        moodAnalysis: data.moodAnalysis ?? "",
        responses: data.responses,
      });
      setState("results");
    } catch (e: any) {
      console.error("Analysis failed:", e);
      toast.error(e.message || "Erreur lors de l'analyse. Réessaie !");
      setCredits((c) => c + 1); // refund credit
      setState("upload");
    }
  }, []);

  const handleBack = () => {
    if (state === "results" || state === "upload") setState("hero");
    if (state === "scanning") setState("upload");
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
              onClick={() => setShowPremium(true)}
              className="flex items-center gap-1 text-xs text-secondary"
            >
              <Crown className="w-4 h-4" />
              <span className="font-medium">{credits}</span>
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
              creditsLeft={credits}
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
                  if (credits <= 0) {
                    setShowPremium(true);
                  } else {
                    setState("upload");
                  }
                }}
                className="w-full gradient-bg gradient-bg-hover py-4 rounded-2xl font-display font-semibold text-primary-foreground neon-glow-violet"
              >
                {credits > 0 ? "Scanner une autre Conv 🔥" : "Débloquer le Premium 👑"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  );
};

export default Index;
