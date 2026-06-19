const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async verifyInitData(initData: string) {
    return this.request<{ token: string; user: unknown }>('/auth/verify', {
      method: 'POST',
      headers: { 'X-Telegram-Init-Data': initData },
    });
  }

  // Wallet
  async getBalance(userId: number) {
    return this.request<{ main_balance: number; play_balance: number }>(`/wallets/${userId}/balance`);
  }

  async getTransactionHistory(userId: number, limit = 50) {
    return this.request<{ transactions: unknown[] }>(`/wallets/${userId}/history?limit=${limit}`);
  }

  // Game
  async getActiveGame(tier = 10) {
    return this.request<{ game: unknown }>(`/games/active?tier=${tier}`);
  }

  async getGameHistory(userId: number) {
    return this.request<{ history: unknown[] }>(`/games/${userId}/history`);
  }

  async getPlayerStats(userId: number) {
    return this.request<{ stats: unknown }>(`/games/${userId}/stats`);
  }
}

export const api = new ApiClient();
