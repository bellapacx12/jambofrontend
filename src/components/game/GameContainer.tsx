import { useGame } from '@/context/GameContext';
import LobbyView from './LobbyView';
import CartelaPicker from './CartelaPicker';
import LiveArena from './LiveArena';

export default function GameContainer() {
  const { gameView } = useGame();

  switch (gameView) {
    case 'lobby':
      return <LobbyView />;
    case 'picker':
      return <CartelaPicker />;
    case 'arena':
      return <LiveArena />;
    default:
      return <LobbyView />;
  }
}
