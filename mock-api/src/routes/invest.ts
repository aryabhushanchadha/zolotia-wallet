import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { db } from '../db.js';
import { investPools } from '../seed.js';

export const investRouter = Router();

function accruedValue(stakedNano: bigint, apy: number, stakedAtMs: number): bigint {
  const days = Math.max(0, (Date.now() - stakedAtMs) / (1000 * 60 * 60 * 24));
  const dailyRate = apy / 100 / 365;
  const growth = Math.pow(1 + dailyRate, days);
  return BigInt(Math.floor(Number(stakedNano) * growth));
}

investRouter.get('/pools', (_req, res) => {
  res.json(investPools);
});

investRouter.get('/positions/:address', async (req, res, next) => {
  try {
    const result = await db.execute({
      sql: 'SELECT pool_id, staked_nano, staked_at FROM positions WHERE address = ?',
      args: [req.params.address],
    });

    res.json(
      result.rows.map((r) => ({
        poolId: r.pool_id,
        stakedNano: r.staked_nano,
        stakedAt: r.staked_at,
      }))
    );
  } catch (err) {
    next(err);
  }
});

const stakeSchema = z.object({
  address: z.string().min(1),
  poolId: z.string().min(1),
  amountNano: z.string().regex(/^\d+$/),
});

investRouter.post('/stake', async (req, res, next) => {
  try {
    const parsed = stakeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid request' });
    const { address, poolId, amountNano } = parsed.data;

    if (!investPools.some((p) => p.id === poolId)) {
      return res.status(400).json({ error: 'Unknown pool' });
    }

    const existingResult = await db.execute({
      sql: 'SELECT staked_nano FROM positions WHERE address = ? AND pool_id = ?',
      args: [address, poolId],
    });
    const existing = existingResult.rows[0] as { staked_nano: string } | undefined;

    const newAmount = (existing ? BigInt(existing.staked_nano) : 0n) + BigInt(amountNano);
    const now = Date.now();

    await db.execute({
      sql: `INSERT INTO positions (address, pool_id, staked_nano, staked_at) VALUES (?, ?, ?, ?)
            ON CONFLICT(address, pool_id) DO UPDATE SET staked_nano = excluded.staked_nano, staked_at = excluded.staked_at`,
      args: [address, poolId, newAmount.toString(), now],
    });

    await db.execute({
      sql: 'INSERT INTO ledger_events (id, address, type, amount_nano, timestamp, status) VALUES (?, ?, ?, ?, ?, ?)',
      args: [randomUUID(), address, 'invest_stake', amountNano, now, 'simulated'],
    });

    res.json({ poolId, stakedNano: newAmount.toString(), stakedAt: now });
  } catch (err) {
    next(err);
  }
});

const unstakeSchema = z.object({
  address: z.string().min(1),
  poolId: z.string().min(1),
});

investRouter.post('/unstake', async (req, res, next) => {
  try {
    const parsed = unstakeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid request' });
    const { address, poolId } = parsed.data;

    const existingResult = await db.execute({
      sql: 'SELECT staked_nano, staked_at FROM positions WHERE address = ? AND pool_id = ?',
      args: [address, poolId],
    });
    const existing = existingResult.rows[0] as { staked_nano: string; staked_at: number } | undefined;

    if (!existing) return res.status(404).json({ error: 'No position found' });

    const pool = investPools.find((p) => p.id === poolId)!;
    const value = accruedValue(BigInt(existing.staked_nano), pool.apy, existing.staked_at);

    await db.execute({
      sql: 'DELETE FROM positions WHERE address = ? AND pool_id = ?',
      args: [address, poolId],
    });
    await db.execute({
      sql: 'INSERT INTO ledger_events (id, address, type, amount_nano, timestamp, status) VALUES (?, ?, ?, ?, ?, ?)',
      args: [randomUUID(), address, 'invest_unstake', value.toString(), Date.now(), 'simulated'],
    });

    res.json({ ok: true, payoutNano: value.toString() });
  } catch (err) {
    next(err);
  }
});
