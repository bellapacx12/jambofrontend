import { Trophy, Gamepad2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const mockHistory = [
  {
    game_id: 'BB6FMO52',
    timestamp: '6/13/2026, 9:11:22 AM',
    stake: 10,
    cards: 36,
    prize: 600,
    winners: 1,
    outcome: 'lost' as const,
  },
  {
    game_id: 'BB7XKP91',
    timestamp: '6/12/2026, 8:45:15 PM',
    stake: 20,
    cards: 12,
    prize: 1200,
    winners: 1,
    outcome: 'won' as const,
  },
];

export default function HistoryView() {
  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-20 overflow-y-auto">
      {/* Stats Box */}
      <div className="bg-bingo-indigo/60 rounded-xl p-4 border border-white/5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Gamepad2 size={18} className="text-bingo-gold" />
          <span className="text-sm text-gray-400">Total Games</span>
        </div>
        <p className="text-3xl font-bold text-white">{mockHistory.length}</p>
      </div>

      {/* History Logs */}
      <h2 className="text-lg font-semibold text-white mb-3">Game History</h2>
      <div className="space-y-3">
        {mockHistory.map((game) => (
          <div
            key={game.game_id}
            className="bg-bingo-indigo/40 rounded-xl p-3 border border-white/5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-bingo-gold" />
                <span className="text-sm font-semibold text-white">Game {game.game_id}</span>
              </div>
              <span
                className={cn(
                  'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide',
                  game.outcome === 'won'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                )}
              >
                {game.outcome}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-2">{game.timestamp}</p>
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
                <span className="text-bingo-gold font-medium">{game.prize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Winners:</span>
                <span className="text-white font-medium">{game.winners}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
