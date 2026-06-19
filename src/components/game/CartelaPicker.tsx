import { useState, useEffect } from 'react';
import { Timer, Wallet } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useGame } from '@/context/GameContext';

const BINGO_HEADERS = ['B', 'I', 'N', 'G', 'O'];

export default function CartelaPicker() {
  const { selectedTier, selectedCartela, selectCartela, joinGameRoom, timeRemaining } = useGame();
  const [previewMatrix, setPreviewMatrix] = useState<number[][] | null>(null);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    setCountdown(timeRemaining > 0 ? timeRemaining : 30);
    joinGameRoom();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelect = (num: number) => {
    selectCartela(num);
    // Generate preview matrix
    const matrix: number[][] = [];
    const ranges = [[1,15],[16,30],[31,45],[46,60],[61,75]];
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

  const isSelected = (num: number) => selectedCartela === num;

  return (
    <div className="flex flex-col h-full px-3 pt-4 pb-20 overflow-y-auto">
      {/* Header Stats */}
      <div className="flex items-center justify-between bg-bingo-indigo/50 rounded-lg px-3 py-2 mb-3 text-xs">
        <div className="flex items-center gap-1.5">
          <Wallet size={14} className="text-bingo-gold" />
          <span className="text-gray-300">Main: <span className="text-white font-semibold">0</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-300">Play: <span className="text-white font-semibold">10</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-300">Stake: <span className="text-bingo-emerald font-semibold">{selectedTier}</span></span>
        </div>
      </div>

      {/* Countdown */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <Timer size={18} className={cn('text-bingo-orange', countdown <= 5 && 'animate-pulse')} />
        <span className={cn(
          'text-2xl font-bold font-mono',
          countdown > 10 ? 'text-white' : countdown > 5 ? 'text-bingo-orange' : 'text-red-500'
        )}>
          {countdown}s
        </span>
      </div>

      {/* Selection Grid 12x8 */}
      <div className="mb-4">
        <div className="grid grid-cols-8 gap-1.5">
          {Array.from({ length: 96 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handleSelect(num)}
              className={cn(
                'aspect-square rounded-lg text-xs font-bold flex items-center justify-center',
                'transition-all active:scale-95',
                isSelected(num)
                  ? 'bg-bingo-emerald text-white shadow-lg shadow-emerald-900/50'
                  : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60'
              )}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Cartela Preview */}
      {previewMatrix && (
        <div className="bg-bingo-indigo/40 rounded-xl p-3 border border-white/5">
          <p className="text-center text-sm font-semibold text-bingo-gold mb-2">
            Cartela No : {selectedCartela}
          </p>
          <div className="grid grid-cols-5 gap-1">
            {BINGO_HEADERS.map((h) => (
              <div key={h} className="text-center text-xs font-bold text-bingo-gold py-1">{h}</div>
            ))}
            {previewMatrix.map((row, ri) =>
              row.map((cell, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  className={cn(
                    'aspect-square rounded-md flex items-center justify-center text-xs font-bold',
                    cell === 0
                      ? 'bg-bingo-emerald/30 text-bingo-emerald'
                      : 'bg-gray-800/60 text-white'
                  )}
                >
                  {cell === 0 ? '★' : cell}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
