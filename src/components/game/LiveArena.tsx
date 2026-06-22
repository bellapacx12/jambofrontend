import { useEffect, useState } from "react";
import {
  LogOut,
  RefreshCw,
  Zap,
  Users,
  Ticket,
  Trophy,
  Hash,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useGame } from "@/context/GameContext";
import SpectatorOverlay from "./SpectatorOverlay";
import WinOverlay from "./WinOverlay";

const BINGO_HEADERS = ["B", "I", "N", "G", "O"];
const NUMBER_RANGES = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
  [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
  [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
];

export default function LiveArena() {
  const {
    gameId,

    selectedTier,
    prizePool,
    totalCalled,
    latestBall,
    calledBalls,
    isAutoDab,
    isSpectator,
    currentCartela,
    showWinOverlay,
    playersReady,
    minRequired,
    winner,
    toggleAutoDab,
    leaveGame,
  } = useGame();

  const [announcerText, setAnnouncerText] = useState(
    "Get ready for the next number!",
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (latestBall) {
      setAnnouncerText(`Next up: ${latestBall}`);
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((p) => (p < 100 ? p + 2 : 100));
      }, 60);
      return () => clearInterval(interval);
    }
  }, [latestBall]);

  const isNumberCalled = (num: number) =>
    calledBalls.includes(
      `${num <= 15 ? "B" : num <= 30 ? "I" : num <= 45 ? "N" : num <= 60 ? "G" : "O"}-${num}`,
    );

  const isOnCartela = (num: number) => {
    if (!currentCartela) return false;
    return currentCartela.matrix_data.some((row) => row.includes(num));
  };

  const isMarked = (num: number) => {
    if (!isAutoDab || !currentCartela) return false;
    return isNumberCalled(num) && isOnCartela(num);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header HUD */}
      <div className="bg-bingo-indigo/60 px-3 py-2 border-b border-white/5">
        <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center gap-1">
            <Hash size={12} className="text-bingo-gold" />
            <span className="text-gray-400">{gameId || "BB------"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} className="text-bingo-gold" />
            <span className="text-gray-400">
              Ready: <span className="text-white">{playersReady}</span>
              <span className="text-gray-600">/{minRequired}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Ticket size={12} className="text-bingo-gold" />
            <span className="text-gray-400">
              Bet: <span className="text-white">{selectedTier}</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy size={12} className="text-bingo-gold" />
            <span className="text-gray-400">
              Derash:{" "}
              <span className="text-bingo-emerald">{prizePool.toFixed(0)}</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">
              Called: <span className="text-white">{totalCalled}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Split Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Number Tracker */}
        <div className="w-1/2 border-r border-white/5 p-2 overflow-y-auto">
          <div className="space-y-2">
            {NUMBER_RANGES.map((range, colIdx) => (
              <div key={colIdx}>
                <div className="text-[10px] font-bold text-bingo-gold mb-1 text-center">
                  {BINGO_HEADERS[colIdx]}
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {range.map((num) => {
                    const called = isNumberCalled(num);
                    return (
                      <div
                        key={num}
                        className={cn(
                          "aspect-square rounded-md flex items-center justify-center text-[10px] font-bold",
                          called
                            ? "bg-bingo-orange text-white shadow-sm"
                            : "bg-gray-800/50 text-gray-500",
                        )}
                      >
                        {num}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Interaction Panel */}
        <div className="w-1/2 p-2 flex flex-col">
          {/* Announcer */}
          <div className="text-center mb-2">
            <p className="text-xs text-gray-400 mb-1">{announcerText}</p>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-bingo-gold to-bingo-orange transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Ball History */}
          {calledBalls.length > 0 && (
            <div className="flex gap-1 justify-center mb-2 overflow-x-auto">
              {calledBalls.slice(-4).map((ball, i) => (
                <div
                  key={`${ball}-${i}`}
                  className={cn(
                    "px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap",
                    i === calledBalls.slice(-4).length - 1
                      ? "bg-bingo-orange text-white animate-pulse-glow"
                      : "bg-gray-800 text-gray-400",
                  )}
                >
                  {ball}
                </div>
              ))}
            </div>
          )}

          {/* Latest Ball Callout */}
          {latestBall && (
            <div className="text-center mb-2 animate-bounce-in">
              <div className="inline-block bg-gradient-to-br from-bingo-orange to-red-500 rounded-2xl px-6 py-3 shadow-lg">
                <span className="text-2xl font-black text-white">
                  {latestBall}
                </span>
              </div>
            </div>
          )}

          {/* Auto-Dab Toggle */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap
              size={14}
              className={isAutoDab ? "text-bingo-gold" : "text-gray-500"}
            />
            <span className="text-xs text-gray-300">Automatic</span>
            <button
              onClick={toggleAutoDab}
              className={cn(
                "w-10 h-5 rounded-full transition-colors relative",
                isAutoDab ? "bg-bingo-emerald" : "bg-gray-700",
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform",
                  isAutoDab ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>

          {/* User's Cartela */}
          {currentCartela && (
            <div className="bg-bingo-indigo/40 rounded-xl p-2 border border-white/5 flex-1">
              <div className="grid grid-cols-5 gap-0.5 h-full">
                {BINGO_HEADERS.map((h) => (
                  <div
                    key={h}
                    className="text-center text-[10px] font-bold text-bingo-gold"
                  >
                    {h}
                  </div>
                ))}
                {currentCartela.matrix_data.map((row, ri) =>
                  row.map((cell, ci) => {
                    const marked = isMarked(cell);
                    const isFree = cell === 0;
                    return (
                      <div
                        key={`${ri}-${ci}`}
                        className={cn(
                          "aspect-square rounded flex items-center justify-center text-[10px] font-bold",
                          marked
                            ? "bg-purple-500 text-white shadow-sm"
                            : isFree
                              ? "bg-bingo-emerald/30 text-bingo-emerald"
                              : "bg-gray-800/60 text-white",
                        )}
                      >
                        {isFree ? "★" : cell}
                      </div>
                    );
                  }),
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex gap-2 p-2 border-t border-white/5 bg-bingo-purple/30">
        <button
          onClick={leaveGame}
          className="flex-1 bg-bingo-orange/80 hover:bg-bingo-orange text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <LogOut size={16} />
          Leave
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Spectator Overlay */}
      {isSpectator && <SpectatorOverlay />}

      {/* Win Overlay */}
      {showWinOverlay && winner && <WinOverlay winner={winner} />}
    </div>
  );
}
