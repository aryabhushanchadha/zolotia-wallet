import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { db } from '../db.js';

export const buySellRouter = Router();

const BASE_RATE = 5.8;

function currentRate() {
  const jitter = (Math.random() - 0.5) * 0.4;
  return Number((BASE_RATE + jitter).toFixed(3));
}

const quoteSchema = z.object({
  side: z.enum(['buy', 'sell']),
  amountNano: z.string().regex(/^\d+$/),
});

buySellRouter.post('/quote', (req, res) => {
  const parsed = quoteSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid request' });
  const { amountNano } = parsed.data;

  const rate = currentRate();
  const amountTon = Number(amountNano) / 1e9;
  res.json({ rate, fiatEquivalent: Number((amountTon * rate).toFixed(2)) });
});

const executeSchema = z.object({
  address: z.string().min(1),
  side: z.enum(['buy', 'sell']),
  amountNano: z.string().regex(/^\d+$/),
});

buySellRouter.post('/execute', async (req, res, next) => {
  try {
    const parsed = executeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid request' });
    const { address, side, amountNano } = parsed.data;

    const id = randomUUID();
    const timestamp = Date.now();
    await db.execute({
      sql: 'INSERT INTO ledger_events (id, address, type, amount_nano, timestamp, status) VALUES (?, ?, ?, ?, ?, ?)',
      args: [id, address, side, amountNano, timestamp, 'simulated'],
    });

    res.json({ id, type: side, amountNano, timestamp, status: 'simulated' });
  } catch (err) {
    next(err);
  }
});
