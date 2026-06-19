import { Crown, Trophy } from 'lucide-react';
import type { MatchResolvedData } from '@/types';

interface WinOverlayProps {
  winner: MatchResolvedData;
}

export default function WinOverlay({ winner }: WinOverlayProps) {
  const { winner_username, winning_cartela, prize_won, winning_matrix } = winner;

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-bounce-in">
      <Crown size={64} className="text-bingo-gold mb-2 animate-pulse-glow" />
      <h1 className="text-4xl font-black text-bingo-gold mb-2 tracking-wider">BINGO!</h1>

      <div className="bg-bingo-indigo/80 rounded-2xl p-4 mx-4 border border-bingo-gold/30 text-center">
        <p className="text-lg font-bold text-white mb-1">
          🎉 {winner_username} ❤ WON! 🎉
        </p>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy size={16} className="text-bingo-gold" />
          <span className="text-sm text-gray-300">
            Winning Cartela : <span className="text-bingo-gold font-bold">{winning_cartela}</span>
          </span>
        </div>
        <p className="text-bingo-emerald font-bold text-lg">{prize_won.toFixed(0)} Prize</p>

        {/* Winning Matrix Mini Preview */}
        <div className="mt-3 grid grid-cols-5 gap-1 max-w-[200px] mx-auto">
          {winning_matrix.full_board_snapshot.map((row, ri) =>
            row.map((cell, ci) => {
              const isHit = winning_matrix.hit_numbers.includes(cell);
              const isFree = cell === 0;
              return (
                <div
                  key={`${ri}-${ci}`}
                  className={`aspect-square rounded flex items-center justify-center text-[10px] font-bold ${
                    isHit
                      ? 'bg-green-500 text-white'
                      : isFree
                      ? 'bg-bingo-emerald/30 text-bingo-emerald'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {isFree ? '★' : cell}
                </div>
              );
            })
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 animate-pulse">
        ● Auto-starting next game in 2s
      </p>
    </div>
  );
}
