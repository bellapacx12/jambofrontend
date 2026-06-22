import { useEffect, useState } from "react";
import { User, Wallet, Trophy, Users, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/utils/cn";
import { api } from "@/services/api";
import type { PlayerStats } from "@/types";

export default function ProfileView() {
  const [soundOn, setSoundOn] = useState(true);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const userId = userData ? JSON.parse(userData).id : null;

    if (!userId) {
      setError("Please log in");
      setLoading(false);
      return;
    }

    api
      .getPlayerStats(userId)
      .then((res) => {
        setStats(res.stats);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bingo-gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center px-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  const displayStats = stats || {
    main_wallet: 0,
    play_wallet: 0,
    games_won: 0,
    total_invites: 0,
    total_earning: 0,
  };

  const statCards = [
    {
      label: "Main Wallet",
      value: displayStats.main_wallet.toFixed(2),
      icon: Wallet,
    },
    {
      label: "Play Wallet",
      value: displayStats.play_wallet.toFixed(2),
      icon: Wallet,
    },
    {
      label: "Games Won",
      value: displayStats.games_won.toString(),
      icon: Trophy,
    },
    {
      label: "Total Invite",
      value: displayStats.total_invites.toString(),
      icon: Users,
    },
  ];

  // Get user info from localStorage
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const username = user?.username || "Player";
  const displayName =
    username.length > 2
      ? username.slice(0, 2).toUpperCase()
      : username.toUpperCase();

  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-20 overflow-y-auto">
      {/* Avatar & Name */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-bingo-gold to-bingo-orange flex items-center justify-center mb-3 shadow-lg shadow-orange-900/30">
          <User size={36} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-white">{displayName}</h2>
        <p className="text-sm text-gray-400">@{username}</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-bingo-indigo/60 rounded-xl p-3 border border-white/5 text-center"
            >
              <Icon size={18} className="text-bingo-gold mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Total Earning */}
      <div className="bg-gradient-to-r from-bingo-gold/20 to-bingo-orange/20 rounded-xl p-4 border border-bingo-gold/20 mb-6">
        <p className="text-xs text-gray-400 mb-1">Total Earning</p>
        <p className="text-2xl font-black text-bingo-gold">
          {displayStats.total_earning.toFixed(2)}
        </p>
      </div>

      {/* Settings */}
      <div className="bg-bingo-indigo/40 rounded-xl border border-white/5">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {soundOn ? (
              <Volume2 size={20} className="text-bingo-gold" />
            ) : (
              <VolumeX size={20} className="text-gray-500" />
            )}
            <span className="text-sm font-medium text-white">Sound</span>
          </div>
          <button
            onClick={() => setSoundOn(!soundOn)}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              soundOn ? "bg-bingo-emerald" : "bg-gray-700",
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                soundOn ? "translate-x-6" : "translate-x-0.5",
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
