import { useEffect, useState } from "react";
import { GameProvider, useGame } from "@/context/GameContext";
import { api } from "@/services/api";
import BottomNav from "@/components/layout/BottomNav";
import GameContainer from "@/components/game/GameContainer";
import HistoryView from "@/components/history/HistoryView";
import WalletView from "@/components/wallet/WalletView";
import ProfileView from "@/components/profile/ProfileView";

function AppContent() {
  const { currentTab } = useGame();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      console.log("Not in Telegram WebApp");
      setAuthReady(true);
      return;
    }

    tg.ready();
    tg.expand();
    tg.setHeaderColor("#0B0A1A");
    tg.setBackgroundColor("#0B0A1A");

    const initData = tg.initData;
    console.log("initData exists:", !!initData);
    console.log("auth_token exists:", !!localStorage.getItem("auth_token"));

    if (initData && !localStorage.getItem("auth_token")) {
      console.log("Calling verifyInitData...");
      api
        .verifyInitData(initData)
        .then((res) => {
          console.log("Auth success, user:", res.user);
          setAuthReady(true);
        })
        .catch((err) => {
          console.error("Auth failed:", err);
          setAuthReady(true); // Show app anyway
        });
    } else {
      setAuthReady(true);
    }
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case "game":
        return <GameContainer />;
      case "history":
        return <HistoryView />;
      case "wallet":
        return <WalletView />;
      case "profile":
        return <ProfileView />;
      default:
        return <GameContainer />;
    }
  };

  if (!authReady) {
    return (
      <div className="h-full w-full bg-bingo-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bingo-gold" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-bingo-dark flex flex-col">
      <main className="flex-1 overflow-hidden">{renderContent()}</main>
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
