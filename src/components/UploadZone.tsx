import { motion } from "framer-motion";
import { Upload, Image } from "lucide-react";
import { useCallback, useState } from "react";

interface UploadZoneProps {
  onUpload: (file: File) => void;
}

const UploadZone = ({ onUpload }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onUpload(file);
      }
    },
    [onUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onUpload(file);
    },
    [onUpload]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 pb-8"
    >
      <div className="max-w-lg mx-auto">
        <h2 className="font-display text-2xl font-bold text-center mb-2">
          Upload ta <span className="gradient-text">capture</span>
        </h2>
        <p className="text-muted-foreground text-center text-sm mb-6">
          Glisse ta capture d'écran WhatsApp ou Instagram ici
        </p>

        <motion.label
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`glass-card rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all min-h-[200px] ${
            isDragging ? "neon-glow-violet border-primary/40" : "gradient-border"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center">
            {isDragging ? (
              <Image className="w-7 h-7 text-primary-foreground" />
            ) : (
              <Upload className="w-7 h-7 text-primary-foreground" />
            )}
          </div>
          <div className="text-center">
            <p className="text-foreground font-medium mb-1">
              {isDragging ? "Lâche ici ! 🔥" : "Drag & Drop"}
            </p>
            <p className="text-muted-foreground text-sm">
              ou clique pour sélectionner
            </p>
          </div>
        </motion.label>

        <p className="text-center text-muted-foreground text-xs mt-4">
          PNG, JPG • Max 10 MB
        </p>
      </div>
    </motion.div>
  );
};

export default UploadZone;
