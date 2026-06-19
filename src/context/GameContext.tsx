import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { ViewTab, GameView, BallDropData, MatchResolvedData, Cartela } from '@/types';
import { wsService } from '@/services/websocket';

interface GameState {
  currentTab: ViewTab;
  gameView: GameView;
  selectedTier: number;
  selectedCartela: number | null;
  currentCartela: Cartela | null;
  gameId: string | null;
  timeRemaining: number;
  playersRegistered: number;
  prizePool: number;
  calledBalls: string[];
  latestBall: string | null;
  totalCalled: number;
  isAutoDab: boolean;
  isSpectator: boolean;
  winner: MatchResolvedData | null;
  showWinOverlay: boolean;
}

interface GameContextType extends GameState {
  setCurrentTab: (tab: ViewTab) => void;
  setGameView: (view: GameView) => void;
  selectTier: (tier: number) => void;
  selectCartela: (num: number) => void;
  joinGameRoom: () => void;
  toggleAutoDab: () => void;
  leaveGame: () => void;
  dismissWinOverlay: () => void;
  isInLobby: boolean;
}

const initialState: GameState = {
  currentTab: 'game',
  gameView: 'lobby',
  selectedTier: 10,
  selectedCartela: null,
  currentCartela: null,
  gameId: null,
  timeRemaining: 30,
  playersRegistered: 0,
  prizePool: 0,
  calledBalls: [],
  latestBall: null,
  totalCalled: 0,
  isAutoDab: true,
  isSpectator: false,
  winner: null,
  showWinOverlay: false,
};

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const cleanupRef = useRef<(() => void) | null>(null);

  const setCurrentTab = useCallback((tab: ViewTab) => {
    setState((prev) => ({ ...prev, currentTab: tab }));
  }, []);

  const setGameView = useCallback((view: GameView) => {
    setState((prev) => ({ ...prev, gameView: view }));
  }, []);

  const selectTier = useCallback((tier: number) => {
    setState((prev) => ({ ...prev, selectedTier: tier, gameView: 'picker' }));
  }, []);

  const selectCartela = useCallback((num: number) => {
    setState((prev) => ({ ...prev, selectedCartela: num }));
    wsService.selectCartela(num);
  }, []);

  const joinGameRoom = useCallback(() => {
    wsService.connect();

    // Wait for connection then join
    const checkAndJoin = setInterval(() => {
      if (wsService.isConnected) {
        clearInterval(checkAndJoin);
        const initData = window.Telegram?.WebApp?.initData || '';
        wsService.joinRoom(state.selectedTier, initData);
      }
    }, 100);

    // Set up message handler
    const cleanup = wsService.onMessage((event) => {
      switch (event.event) {
        case 'room:ticker': {
          const data = event.data as { game_id: string; time_remaining_s: number; players_registered: number; prize_pool_derash: number };
          setState((prev) => ({
            ...prev,
            gameId: data.game_id,
            timeRemaining: data.time_remaining_s,
            playersRegistered: data.players_registered,
            prizePool: data.prize_pool_derash,
          }));
          break;
        }
        case 'card:confirmed': {
          const data = event.data as { cartela_number: number; matrix: number[][] };
          setState((prev) => ({
            ...prev,
            currentCartela: { id: Date.now(), cartela_number: data.cartela_number, matrix_data: data.matrix },
            gameView: 'arena',
          }));
          break;
        }
        case 'match:ball_drop': {
          const data = event.data as BallDropData;
          setState((prev) => ({
            ...prev,
            latestBall: data.ball,
            calledBalls: [...data.history, data.ball],
            totalCalled: data.total_called_count,
          }));
          break;
        }
        case 'match:resolved': {
          const data = event.data as MatchResolvedData;
          setState((prev) => ({
            ...prev,
            winner: data,
            showWinOverlay: true,
          }));
          // Auto-dismiss after 2s
          setTimeout(() => {
            setState((prev) => ({
              ...prev,
              showWinOverlay: false,
              gameView: 'lobby',
              winner: null,
              selectedCartela: null,
              currentCartela: null,
              calledBalls: [],
              latestBall: null,
              totalCalled: 0,
            }));
          }, 2000);
          break;
        }
        case 'error': {
          console.error('WebSocket error:', event.data);
          break;
        }
      }
    });

    cleanupRef.current = cleanup;
  }, [state.selectedTier]);

  const toggleAutoDab = useCallback(() => {
    setState((prev) => ({ ...prev, isAutoDab: !prev.isAutoDab }));
  }, []);

  const leaveGame = useCallback(() => {
    wsService.disconnect();
    if (cleanupRef.current) cleanupRef.current();
    setState((prev) => ({
      ...prev,
      gameView: 'lobby',
      selectedCartela: null,
      currentCartela: null,
      calledBalls: [],
      latestBall: null,
      totalCalled: 0,
      isSpectator: false,
    }));
  }, []);

  const dismissWinOverlay = useCallback(() => {
    setState((prev) => ({ ...prev, showWinOverlay: false }));
  }, []);

  const value: GameContextType = {
    ...state,
    setCurrentTab,
    setGameView,
    selectTier,
    selectCartela,
    joinGameRoom,
    toggleAutoDab,
    leaveGame,
    dismissWinOverlay,
    isInLobby: state.gameView === 'lobby',
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
