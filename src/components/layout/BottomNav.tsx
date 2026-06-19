import { Gamepad2, Clock, Wallet, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useGame } from '@/context/GameContext';
import type { ViewTab } from '@/types';

const tabs: { id: ViewTab; label: string; icon: typeof Gamepad2 }[] = [
  { id: 'game', label: 'Game', icon: Gamepad2 },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const { currentTab, setCurrentTab, gameView } = useGame();

  // Hide nav when in arena
  if (gameView === 'arena') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bingo-purple/95 backdrop-blur-lg border-t border-white/10">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors',
                isActive ? 'text-bingo-gold' : 'text-gray-400 hover:text-gray-200'
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
