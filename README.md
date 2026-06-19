# Beteseb Bingo - Telegram Mini App Frontend

React 19 + TypeScript + Vite + Tailwind CSS frontend for the Beteseb Bingo Telegram Mini App.

## Features

- **Game Lobby**: Stake selection (Play 10 / Play 20) with deep purple theme
- **Cartela Picker**: 12×8 grid selection (1-96) with 30s countdown and 5×5 preview
- **Live Arena**: Split interface with BINGO tracker, ball announcer, auto-dab toggle, live card
- **Spectator Mode**: "Watching Only" overlay with Amharic text
- **Win Overlay**: Golden crown BINGO animation with auto-reset
- **History**: Game logs with Won/Lost badges
- **Wallet**: Main/Play balance with transaction history
- **Profile**: Avatar, 2×2 metrics grid, sound toggle
- **Bottom Nav**: Fixed 4-tab navigation (Game, History, Wallet, Profile)

## Tech Stack

- React 19 + TypeScript
- Vite (fast HMR)
- Tailwind CSS (custom bingo theme)
- @twa-dev/sdk (Telegram WebApp integration)
- Lucide React (icons)
- clsx + tailwind-merge (class utilities)

## Quick Start

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

## Environment Variables

```
VITE_API_URL=http://localhost:8080/api/v1
VITE_WS_URL=ws://localhost:8080/ws
```

## Telegram Mini App Setup

1. Create a bot with @BotFather
2. Enable WebApp and set the URL to your deployed frontend
3. The bot will pass `initData` which the backend validates via HMAC-SHA256
