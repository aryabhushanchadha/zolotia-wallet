# Zolotia

A Telegram Mini App wallet for TON, branded "Zolotia". Non-custodial (connects your own TON wallet via TON Connect), running on TON **testnet**. Send/receive/wallet-connect and balance/transaction history are real testnet chain calls. Buy, sell, invest, and credit are clearly-labeled simulated/demo features backed by a local mock API.

## Structure

- `bot/` — Telegram bot (`node-telegram-bot-api`) that launches the Mini App via a `web_app` button and persistent menu button.
- `mini-app/` — the actual product: React + Vite + Tailwind, TON Connect for wallet linking/signing, `@ton/ton` for real testnet reads.
- `mock-api/` — Express + SQLite backend for the simulated buy/sell/invest/credit features, isolated behind a typed client so it can be swapped for real integrations later.

## Setup

```bash
npm install
```

## Run locally (plain browser — fastest for UI iteration)

```bash
npm run dev:mock-api   # http://localhost:4000
npm run dev:mini-app   # http://localhost:5173
```

Open `http://localhost:5173` in a browser. Telegram-specific APIs (`window.Telegram.WebApp`) no-op gracefully outside real Telegram.

## Run inside real Telegram

Telegram requires an **HTTPS** URL for `web_app` buttons — `http://localhost` will not load inside the Telegram app.

1. Install a tunnel tool if you don't have one: `brew install cloudflared`
2. Start a tunnel: `cloudflared tunnel --url http://localhost:5173`
3. Copy the HTTPS URL it prints into `bot/.env` as `MINI_APP_URL`
4. Start the bot: `npm run dev:bot`
5. Open `@zolotiabot` in Telegram, tap `/start` or the menu button next to the chat input.

Note: on the free tier, the tunnel URL changes each time you restart it — update `MINI_APP_URL` and restart the bot each session.

### Testnet TON funds

Fund a test wallet via the public faucet bot [`@testgiver_ton_bot`](https://t.me/testgiver_ton_bot), and connect with a wallet app (e.g. Tonkeeper) switched to **Testnet** mode.

## What's real vs. simulated

- **Real**: wallet connect/link, balance, transaction history, sending TON, fee estimation — all via TON Connect + testnet `toncenter.com`.
- **Simulated** (tagged "Demo" in the Activity feed): buy, sell, invest/staking yield, credit line advances/repayments — backed by `mock-api`'s SQLite ledger, no real money or real blockchain writes involved.
