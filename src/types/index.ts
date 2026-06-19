export interface User {
  id: number;
  telegram_id: number;
  username: string;
  phone_number: string;
  is_verified: boolean;
  created_at: string;
}

export interface Wallet {
  main_balance: number;
  play_balance: number;
}

export interface GameSession {
  game_id: string;
  stake_amount: number;
  total_players: number;
  prize_pool: number;
  status: 'lobby' | 'active' | 'resolution';
  balls_called: number[];
  created_at: string;
}

export interface Cartela {
  id: number;
  cartela_number: number;
  matrix_data: number[][];
}

export interface GameHistoryItem {
  game_id: string;
  timestamp: string;
  stake: number;
  cards: number;
  prize: number;
  winners: number;
  outcome: 'won' | 'lost' | 'spectated';
  cartela_number: number;
}

export interface PlayerStats {
  main_wallet: number;
  play_wallet: number;
  games_won: number;
  total_invites: number;
  total_earning: number;
}

export interface BallDropData {
  ball: string;
  history: string[];
  total_called_count: number;
}

export interface MatchResolvedData {
  winner_username: string;
  winning_cartela: number;
  prize_won: number;
  winning_matrix: {
    hit_numbers: number[];
    full_board_snapshot: number[][];
  };
}

export type ViewTab = 'game' | 'history' | 'wallet' | 'profile';
export type GameView = 'lobby' | 'picker' | 'arena' | 'spectator';
