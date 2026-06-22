import { useState } from "react";
import { Timer, Wallet, Users, CheckCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { useGame } from "@/context/GameContext";

const BINGO_HEADERS = ["B", "I", "N", "G", "O"];

export default function CartelaPicker() {
  const {
    selectedTier,
    selectedCartela,
    selectCartela,
    joinGameRoom,
    timeRemaining,
    playersJoined,
    playersReady,
    minRequired,
    selectedCards,
    waitingForPlayers,
  } = useGame();

  const [previewMatrix, setPreviewMatrix] = useState<number[][] | null>(null);

  // Join room on mount
  useState(() => {
    joinGameRoom();
  });

  const handleSelect = (num: number) => {
    if (selectedCartela !== null) return; // Already selected
    selectCartela(num);
    // Generate preview matrix (same logic as server)
    const matrix: number[][] = [];
    const ranges = [
      [1, 15],
      [16, 30],
      [31, 45],
      [46, 60],
      [61, 75],
    ];
    for (let row = 0; row < 5; row++) {
      const r: number[] = [];
      for (let col = 0; col < 5; col++) {
        if (row === 2 && col === 2) {
          r.push(0);
        } else {
          const [min, max] = ranges[col];
          r.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
      }
      matrix.push(r);
    }
    setPreviewMatrix(matrix);
  };

  // Check card status across all players
  const getCardStatus = (num: number): "mine" | "other" | "available" => {
    if (selectedCartela === num) return "mine";
    const otherSelected = selectedCards.find((c) => c.cartela_number === num);
    if (otherSelected) return "other";
    return "available";
  };

  const getCardOwner = (num: number): string | null => {
    const card = selectedCards.find((c) => c.cartela_number === num);
    return card?.username || `Player ${card?.user_id}` || null;
  };

  return (
    <div className="flex flex-col h-full px-3 pt-4 pb-20 overflow-y-auto">
      {/* Header Stats */}
      <div className="flex items-center justify-between bg-bingo-indigo/50 rounded-lg px-3 py-2 mb-3 text-xs">
        <div className="flex items-center gap-1.5">
          <Wallet size={14} className="text-bingo-gold" />
          <span className="text-gray-300">
            Main: <span className="text-white font-semibold">0</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-300">
            Play: <span className="text-white font-semibold">10</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-300">
            Stake:{" "}
            <span className="text-bingo-emerald font-semibold">
              {selectedTier}
            </span>
          </span>
        </div>
      </div>

      {/* Countdown + Players */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <Timer
            size={18}
            className={cn(
              "text-bingo-orange",
              timeRemaining <= 5 && "animate-pulse",
            )}
          />
          <span
            className={cn(
              "text-2xl font-bold font-mono",
              timeRemaining > 10
                ? "text-white"
                : timeRemaining > 5
                  ? "text-bingo-orange"
                  : "text-red-500",
            )}
          >
            {timeRemaining}s
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-bingo-gold" />
          <span className="text-sm text-gray-300">
            <span className="text-white font-bold">{playersReady}</span>
            <span className="text-gray-500">/{minRequired}</span>
          </span>
        </div>
      </div>

      {/* Waiting banner */}
      {waitingForPlayers && (
        <div className="bg-bingo-orange/20 border border-bingo-orange/30 rounded-lg px-3 py-2 mb-3 text-center">
          <p className="text-xs text-bingo-orange">
            Waiting for {minRequired - playersReady} more player
            {minRequired - playersReady !== 1 ? "s" : ""}...
          </p>
        </div>
      )}

      {/* Selection Grid */}
      <div className="mb-4">
        <div className="grid grid-cols-8 gap-1.5">
          {Array.from({ length: 96 }, (_, i) => i + 1).map((num) => {
            const status = getCardStatus(num);
            const owner = status === "other" ? getCardOwner(num) : null;

            return (
              <button
                key={num}
                onClick={() => status === "available" && handleSelect(num)}
                disabled={status !== "available"}
                title={owner || undefined}
                className={cn(
                  "aspect-square rounded-lg text-xs font-bold flex items-center justify-center",
                  "transition-all relative",
                  status === "mine"
                    ? "bg-bingo-emerald text-white shadow-lg shadow-emerald-900/50 scale-105 z-10"
                    : status === "other"
                      ? "bg-purple-600 text-white shadow-md cursor-not-allowed"
                      : "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 active:scale-95",
                )}
              >
                {num}
                {/* Mini indicator for other players */}
                {status === "other" && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full border border-purple-800" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-bingo-emerald" />
          <span className="text-gray-400">Your card</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-purple-600" />
          <span className="text-gray-400">Taken</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-700" />
          <span className="text-gray-400">Available</span>
        </div>
      </div>

      {/* Cartela Preview */}
      {previewMatrix && (
        <div className="bg-bingo-indigo/40 rounded-xl p-3 border border-white/5 mb-4">
          <p className="text-center text-sm font-semibold text-bingo-gold mb-2">
            Cartela No : {selectedCartela}
          </p>
          <div className="grid grid-cols-5 gap-1">
            {BINGO_HEADERS.map((h) => (
              <div
                key={h}
                className="text-center text-xs font-bold text-bingo-gold py-1"
              >
                {h}
              </div>
            ))}
            {previewMatrix.map((row, ri) =>
              row.map((cell, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  className={cn(
                    "aspect-square rounded-md flex items-center justify-center text-xs font-bold",
                    cell === 0
                      ? "bg-bingo-emerald/30 text-bingo-emerald"
                      : "bg-gray-800/60 text-white",
                  )}
                >
                  {cell === 0 ? "★" : cell}
                </div>
              )),
            )}
          </div>
        </div>
      )}

      {/* Selected Cards List */}
      {selectedCards.length > 0 && (
        <div className="bg-bingo-indigo/30 rounded-xl p-3 border border-white/5">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <CheckCircle size={12} className="text-bingo-emerald" />
            Players Ready ({selectedCards.length}/{minRequired})
          </h3>
          <div className="space-y-1.5">
            {selectedCards.map((card) => (
              <div
                key={card.user_id}
                className="flex items-center justify-between text-xs bg-gray-800/40 rounded-lg px-2 py-1.5"
              >
                <span className="text-gray-300 truncate max-w-[120px]">
                  {card.username || `Player ${card.user_id}`}
                </span>
                <span className="text-bingo-gold font-mono">
                  #{card.cartela_number}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
