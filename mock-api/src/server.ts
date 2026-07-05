import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { initDb } from './db.js';
import { investRouter } from './routes/invest.js';
import { creditRouter } from './routes/credit.js';
import { buySellRouter } from './routes/buySell.js';
import { ledgerRouter } from './routes/ledger.js';
import { createBot } from './bot.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

await initDb();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/invest', investRouter);
app.use('/api/credit', creditRouter);
app.use('/api/buysell', buySellRouter);
app.use('/api/ledger', ledgerRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

// In production the Mini App is built alongside this backend and served from
// the same origin, so the bot's web_app URL and the API share one permanent
// URL. Locally the mini-app runs on its own Vite dev server instead, so this
// directory won't exist.
const miniAppDist = path.resolve(__dirname, '../../mini-app/dist');
if (fs.existsSync(miniAppDist)) {
  app.use(express.static(miniAppDist));
  app.get(/^\/(?!api|health).*/, (_req, res) => {
    res.sendFile(path.join(miniAppDist, 'index.html'));
  });
}

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Zolotia mock-api listening on http://localhost:${PORT}`);
});

createBot();
