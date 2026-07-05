import { Router } from 'express';
import { db } from '../db.js';

export const ledgerRouter = Router();

ledgerRouter.get('/:address', async (req, res, next) => {
  try {
    const result = await db.execute({
      sql: 'SELECT id, type, amount_nano, timestamp, status FROM ledger_events WHERE address = ? ORDER BY timestamp DESC',
      args: [req.params.address],
    });

    res.json(
      result.rows.map((r) => ({
        id: r.id,
        type: r.type,
        amountNano: r.amount_nano,
        timestamp: r.timestamp,
        status: r.status,
      }))
    );
  } catch (err) {
    next(err);
  }
});
