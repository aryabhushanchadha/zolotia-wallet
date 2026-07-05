import { createClient } from '@libsql/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const url = process.env.TURSO_DATABASE_URL ?? `file:${path.join(dataDir, 'zolotia.db')}`;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = createClient(authToken ? { url, authToken } : { url });

export async function initDb() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS positions (
      address TEXT NOT NULL,
      pool_id TEXT NOT NULL,
      staked_nano TEXT NOT NULL,
      staked_at INTEGER NOT NULL,
      PRIMARY KEY (address, pool_id)
    );

    CREATE TABLE IF NOT EXISTS credit_lines (
      address TEXT PRIMARY KEY,
      limit_nano TEXT NOT NULL,
      utilized_nano TEXT NOT NULL,
      apr_percent REAL NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ledger_events (
      id TEXT PRIMARY KEY,
      address TEXT NOT NULL,
      type TEXT NOT NULL,
      amount_nano TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subscribers (
      telegram_id TEXT PRIMARY KEY,
      username TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER NOT NULL
    );
  `);
}
