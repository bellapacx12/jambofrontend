import { useEffect, useState } from "react";
import { Trophy, Gamepad2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { api } from "@/services/api";
import type { GameHistoryItem } from "@/types";

export default function HistoryView() {
  const [history, setHistory] = useState<GameHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get user ID from localStorage or context
    const userData = localStorage.getItem("user");
    const userId = userData ? JSON.parse(userData).id : null;

    if (!userId) {
      setError("Please log in to view history");
      setLoading(false);
      return;
    }

    api
      .getGameHistory(userId)
      .then((res) => {
        setHistory((res.history as GameHistoryItem[]) || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load history");
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

  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-20 overflow-y-auto">
      {/* Stats Box */}
      <div className="bg-bingo-indigo/60 rounded-xl p-4 border border-white/5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Gamepad2 size={18} className="text-bingo-gold" />
          <span className="text-sm text-gray-400">Total Games</span>
        </div>
        <p className="text-3xl font-bold text-white">{history.length}</p>
      </div>

      {/* History Logs */}
      <h2 className="text-lg font-semibold text-white mb-3">Game History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-8">
          No games played yet
        </p>
      ) : (
        <div className="space-y-3">
          {history.map((game) => (
            <div
              key={game.game_id}
              className="bg-bingo-indigo/40 rounded-xl p-3 border border-white/5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy size={14} className="text-bingo-gold" />
                  <span className="text-sm font-semibold text-white">
                    Game {game.game_id}
                  </span>
                </div>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                    game.outcome === "won"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30",
                  )}
                >
                  {game.outcome}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                {new Date(game.timestamp).toLocaleString()}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Stake:</span>
                  <span className="text-white font-medium">{game.stake}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cards:</span>
                  <span className="text-white font-medium">{game.cards}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Prize:</span>
                  <span className="text-bingo-gold font-medium">
                    {game.prize}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Winners:</span>
                  <span className="text-white font-medium">{game.winners}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
