import type { BallDropData, MatchResolvedData } from "@/types/index";

export type WSEventType =
  | "room:join"
  | "room:ticker"
  | "room:selected_cards"
  | "room:timer_restart"
  | "card:select"
  | "card:confirmed"
  | "card:selected"
  | "game:started"
  | "game:start_failed"
  | "match:ball_drop"
  | "match:resolved"
  | "error";

export interface WSEvent {
  event: WSEventType;
  data?: unknown;
  token?: string;
  tier?: number;
  cartela_number?: number;
}

export type WSMessageHandler = (event: WSEvent) => void;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: WSMessageHandler[] = [];
  private isConnecting = false;

  constructor(url?: string) {
    this.url = url || import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8080/ws";
  }

  connect() {
    if (this.isConnecting || this.ws?.readyState === WebSocket.OPEN) return;
    this.isConnecting = true;

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
        this.isConnecting = false;
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WSEvent;
          this.messageHandlers.forEach((handler) => handler(data));
        } catch {
          console.error("Failed to parse WebSocket message:", event.data);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.isConnecting = false;
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
      };
    } catch {
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    setTimeout(() => {
      console.log(`Reconnecting... attempt ${this.reconnectAttempts}`);
      this.connect();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers = [];
  }

  send(event: WSEvent) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    } else {
      console.warn("WebSocket not connected, queueing not implemented");
    }
  }

  // Send JWT token from localStorage, NOT initData
  joinRoom(tier: number) {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.error("Cannot join room: no auth token");
      return;
    }
    this.send({ event: "room:join", tier, token });
  }

  selectCartela(cartelaNumber: number) {
    this.send({ event: "card:select", cartela_number: cartelaNumber });
  }

  onMessage(handler: WSMessageHandler) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();
