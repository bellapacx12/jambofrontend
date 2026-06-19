import { Users, Trophy, Play } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useGame } from '@/context/GameContext';

export default function LobbyView() {
  const { selectTier } = useGame();

  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-20 overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          Welcome to <span className="text-gold-gradient">Beteseb Bingo</span>
        </h1>
        <p className="text-gray-400 text-sm">Real-time multiplayer bingo</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-bingo-indigo/60 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className="text-bingo-gold" />
            <span className="text-xs text-gray-400">Active Players</span>
          </div>
          <p className="text-2xl font-bold text-white">45,000+</p>
        </div>
        <div className="bg-bingo-indigo/60 rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={16} className="text-bingo-gold" />
            <span className="text-xs text-gray-400">Games Played</span>
          </div>
          <p className="text-2xl font-bold text-white">60,000+</p>
        </div>
      </div>

      {/* Stake Selection */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4 text-center">Choose Your Stake</h2>
        <div className="space-y-3">
          <button
            onClick={() => selectTier(10)}
            className={cn(
              'w-full py-4 rounded-xl font-bold text-lg text-white',
              'btn-emerald-gradient shadow-lg shadow-emerald-900/30',
              'active:scale-[0.98] transition-transform flex items-center justify-center gap-3'
            )}
          >
            <Play size={20} fill="white" />
            Play 10
          </button>
          <button
            onClick={() => selectTier(20)}
            className={cn(
              'w-full py-4 rounded-xl font-bold text-lg text-white',
              'btn-neon-gradient shadow-lg shadow-blue-900/30',
              'active:scale-[0.98] transition-transform flex items-center justify-center gap-3'
            )}
          >
            <Play size={20} fill="white" />
            Play 20
          </button>
        </div>
      </div>
    </div>
  );
}
