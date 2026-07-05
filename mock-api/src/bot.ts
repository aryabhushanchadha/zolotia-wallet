import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';
import { upsertSubscriber, deactivateSubscriber, getActiveSubscriberIds } from './subscribers.js';
import { messageForToday } from './bot/messages.js';
import { publicUrl } from './config.js';

function isBlockedError(err: unknown): boolean {
  const statusCode = (err as { response?: { statusCode?: number } })?.response?.statusCode;
  const errorCode = (err as { response?: { body?: { error_code?: number } } })?.response?.body?.error_code;
  return statusCode === 403 || errorCode === 403;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createBot() {
  const token = process.env.BOT_TOKEN;
  const miniAppUrl = publicUrl;

  if (!token) {
    console.warn('BOT_TOKEN not set — Telegram bot will not start.');
    return null;
  }

  const bot = new TelegramBot(token, { polling: true });

  bot
    .setChatMenuButton({
      menu_button: { type: 'web_app', text: 'Open Zolotia', web_app: { url: miniAppUrl } },
    })
    .catch((err) => console.error('Failed to set menu button:', err.message));

  bot.onText(/\/start/, async (msg) => {
    await upsertSubscriber(msg.from!.id, msg.from?.username).catch((err) =>
      console.error('Failed to save subscriber:', err)
    );
    bot.sendMessage(msg.chat.id, 'Welcome to Zolotia — your non-custodial TON wallet.', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Open Zolotia Wallet', web_app: { url: miniAppUrl } }]],
      },
    });
  });

  bot.onText(/\/stop/, async (msg) => {
    await deactivateSubscriber(msg.from!.id).catch((err) => console.error('Failed to unsubscribe:', err));
    bot.sendMessage(msg.chat.id, 'You\'ve been unsubscribed from Zolotia updates. Send /start any time to opt back in.');
  });

  bot.onText(/\/help/, (msg) => {
    bot.sendMessage(
      msg.chat.id,
      'Zolotia lets you connect a TON wallet, view your testnet balance, send/receive TON, and try demo buy/sell/credit/investment features. Tap the menu button or /start to open it. Send /stop to unsubscribe from updates.'
    );
  });

  bot.on('message', (msg) => {
    if (msg.text && (msg.text.startsWith('/start') || msg.text.startsWith('/help') || msg.text.startsWith('/stop'))) {
      return;
    }
    bot.sendMessage(msg.chat.id, 'Tap the menu button (bottom left) or /start to open the Zolotia wallet.');
  });

  bot.on('polling_error', (err) => {
    console.error('Polling error:', err.message);
  });

  const broadcastHour = Number(process.env.BROADCAST_HOUR_UTC ?? 9);
  cron.schedule(`0 ${broadcastHour} * * *`, () => runBroadcast(bot), { timezone: 'UTC' });

  console.log(`Zolotia bot is running (daily broadcast at ${broadcastHour}:00 UTC)...`);
  return bot;
}

export async function runBroadcast(bot: TelegramBot) {
  const ids = await getActiveSubscriberIds();
  const text = messageForToday();
  console.log(`Broadcasting to ${ids.length} subscriber(s)...`);

  for (const id of ids) {
    try {
      await bot.sendMessage(id, text);
    } catch (err) {
      if (isBlockedError(err)) {
        await deactivateSubscriber(Number(id)).catch(() => {});
      } else {
        console.error(`Failed to send broadcast to ${id}:`, err);
      }
    }
    await sleep(50);
  }
}
