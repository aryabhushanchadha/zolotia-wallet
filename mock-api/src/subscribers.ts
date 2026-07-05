import { db } from './db.js';

export async function upsertSubscriber(telegramId: number, username: string | undefined) {
  await db.execute({
    sql: `INSERT INTO subscribers (telegram_id, username, active, created_at) VALUES (?, ?, 1, ?)
          ON CONFLICT(telegram_id) DO UPDATE SET username = excluded.username, active = 1`,
    args: [String(telegramId), username ?? null, Date.now()],
  });
}

export async function deactivateSubscriber(telegramId: number) {
  await db.execute({
    sql: 'UPDATE subscribers SET active = 0 WHERE telegram_id = ?',
    args: [String(telegramId)],
  });
}

export async function getActiveSubscriberIds(): Promise<string[]> {
  const result = await db.execute('SELECT telegram_id FROM subscribers WHERE active = 1');
  return result.rows.map((r) => r.telegram_id as string);
}
