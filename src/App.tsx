import { useEffect } from 'react';
import { GameProvider, useGame } from '@/context/GameContext';
import BottomNav from '@/components/layout/BottomNav';
import GameContainer from '@/components/game/GameContainer';
import HistoryView from '@/components/history/HistoryView';
import WalletView from '@/components/wallet/WalletView';
import ProfileView from '@/components/profile/ProfileView';

function AppContent() {
  const { currentTab } = useGame();

  useEffect(() => {
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#0B0A1A');
      tg.setBackgroundColor('#0B0A1A');
      tg.MainButton.setText('PLAY');
      tg.MainButton.color = '#10B981';
    }
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case 'game':
        return <GameContainer />;
      case 'history':
        return <HistoryView />;
      case 'wallet':
        return <WalletView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <GameContainer />;
    }
  };

  return (
    <div className="h-full w-full bg-bingo-dark flex flex-col">
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
