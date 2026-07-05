import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { db } from '../db.js';
import { DEFAULT_CREDIT_LIMIT_NANO, DEFAULT_CREDIT_APR } from '../seed.js';

export const creditRouter = Router();

type CreditRow = { limit_nano: string; utilized_nano: string; apr_percent: number };

async function getOrCreateLine(address: string): Promise<CreditRow> {
  const result = await db.execute({
    sql: 'SELECT limit_nano, utilized_nano, apr_percent FROM credit_lines WHERE address = ?',
    args: [address],
  });
  let row = result.rows[0] as unknown as CreditRow | undefined;
  if (!row) {
    await db.execute({
      sql: 'INSERT INTO credit_lines (address, limit_nano, utilized_nano, apr_percent) VALUES (?, ?, ?, ?)',
      args: [address, DEFAULT_CREDIT_LIMIT_NANO, '0', DEFAULT_CREDIT_APR],
    });
    row = { limit_nano: DEFAULT_CREDIT_LIMIT_NANO, utilized_nano: '0', apr_percent: DEFAULT_CREDIT_APR };
  }
  return row;
}

function toResponse(row: CreditRow) {
  return { limitNano: row.limit_nano, utilizedNano: row.utilized_nano, aprPercent: row.apr_percent };
}

creditRouter.get('/line/:address', async (req, res, next) => {
  try {
    res.json(toResponse(await getOrCreateLine(req.params.address)));
  } catch (err) {
    next(err);
  }
});

const amountSchema = z.object({
  address: z.string().min(1),
  amountNano: z.string().regex(/^\d+$/),
});

creditRouter.post('/advance', async (req, res, next) => {
  try {
    const parsed = amountSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid request' });
    const { address, amountNano } = parsed.data;

    const row = await getOrCreateLine(address);
    const available = BigInt(row.limit_nano) - BigInt(row.utilized_nano);
    if (BigInt(amountNano) > available) {
      return res.status(400).json({ error: 'Amount exceeds available credit' });
    }

    const newUtilized = (BigInt(row.utilized_nano) + BigInt(amountNano)).toString();
    await db.execute({
      sql: 'UPDATE credit_lines SET utilized_nano = ? WHERE address = ?',
      args: [newUtilized, address],
    });
    await db.execute({
      sql: 'INSERT INTO ledger_events (id, address, type, amount_nano, timestamp, status) VALUES (?, ?, ?, ?, ?, ?)',
      args: [randomUUID(), address, 'credit_advance', amountNano, Date.now(), 'simulated'],
    });

    res.json(toResponse({ ...row, utilized_nano: newUtilized }));
  } catch (err) {
    next(err);
  }
});

creditRouter.post('/repay', async (req, res, next) => {
  try {
    const parsed = amountSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid request' });
    const { address, amountNano } = parsed.data;

    const row = await getOrCreateLine(address);
    const repayAmount = BigInt(amountNano) > BigInt(row.utilized_nano) ? BigInt(row.utilized_nano) : BigInt(amountNano);
    const newUtilized = (BigInt(row.utilized_nano) - repayAmount).toString();

    await db.execute({
      sql: 'UPDATE credit_lines SET utilized_nano = ? WHERE address = ?',
      args: [newUtilized, address],
    });
    await db.execute({
      sql: 'INSERT INTO ledger_events (id, address, type, amount_nano, timestamp, status) VALUES (?, ?, ?, ?, ?, ?)',
      args: [randomUUID(), address, 'credit_repay', repayAmount.toString(), Date.now(), 'simulated'],
    });

    res.json(toResponse({ ...row, utilized_nano: newUtilized }));
  } catch (err) {
    next(err);
  }
});
