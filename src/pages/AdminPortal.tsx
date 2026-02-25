import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Users, BarChart3, Crown, LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ADMIN_PASSWORD = "ZiablosurYoutube132";

interface AdminUser {
  id: string;
  pseudo: string;
  phone: string;
  uploads_count: number;
  created_at: string;
  is_vip: boolean;
}

interface AdminStats {
  total_users: number;
  total_analyses: number;
  vip_count: number;
}

const AdminPortal = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      loadData();
    } else {
      toast.error("Mot de passe incorrect");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        supabase.rpc("get_admin_stats"),
        supabase.rpc("get_admin_users"),
      ]);
      if (statsRes.data) setStats(statsRes.data as unknown as AdminStats);
      if (usersRes.data) setUsers(usersRes.data as unknown as AdminUser[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleVip = async (userId: string) => {
    setTogglingId(userId);
    try {
      const { data, error } = await supabase.rpc("toggle_vip", { _target_user_id: userId });
      if (error) throw error;
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_vip: !!data } : u))
      );
      toast.success(data ? "Utilisateur promu VIP 👑" : "VIP retiré");
    } catch (e: any) {
      toast.error(e.message || "Erreur");
    } finally {
      setTogglingId(null);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 max-w-sm w-full"
        >
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold">Admin Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">Accès restreint</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Mot de passe"
            className="w-full glass-card rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            className="w-full gradient-bg py-3 rounded-xl font-display font-semibold text-primary-foreground"
          >
            Accéder
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold gradient-text">Admin Panel</h1>
          <button onClick={() => setAuthenticated(false)} className="text-muted-foreground hover:text-foreground">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Utilisateurs", value: stats?.total_users ?? 0, icon: Users, color: "text-primary" },
                { label: "Analyses", value: stats?.total_analyses ?? 0, icon: BarChart3, color: "text-secondary" },
                { label: "VIP", value: stats?.vip_count ?? 0, icon: Crown, color: "text-secondary" },
              ].map((s) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
                  <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
                  <p className="text-3xl font-display font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Users */}
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Gestion des utilisateurs</h2>
            <div className="space-y-3">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">{user.pseudo}</p>
                      {user.is_vip && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary font-medium">VIP</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{user.phone} • {user.uploads_count} analyses</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleVip(user.id)}
                    disabled={togglingId === user.id}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                      user.is_vip
                        ? "glass-card text-muted-foreground hover:text-foreground"
                        : "gradient-bg text-primary-foreground"
                    }`}
                  >
                    {togglingId === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : user.is_vip ? (
                      "Retirer VIP"
                    ) : (
                      "Passer VIP 👑"
                    )}
                  </motion.button>
                </motion.div>
              ))}
              {users.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Aucun utilisateur inscrit</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
