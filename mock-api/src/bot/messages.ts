// Daily marketing broadcast copy — edit this list to change what gets sent.
// One message is picked per day (rotates through the list), so you can queue
// up a week's worth of variety without needing to touch any scheduling code.
export const marketingMessages: string[] = [
  '💰 Your TON, always in view. Open Zolotia to check your balance and recent activity.',
  '📈 Curious what your TON could be earning? Check out Zolotia\'s Invest pools — demo yields, real insight into how staking works.',
  '💳 Need a little flexibility? Zolotia\'s demo Credit line lets you try an advance and repay flow, no strings attached.',
  '↗️ Sending TON shouldn\'t be complicated. Zolotia keeps it to a few taps — try a testnet transfer today.',
  '🔒 Zolotia never holds your keys. Connect your own TON wallet and stay fully in control.',
];

export function messageForToday(date: Date = new Date()): string {
  const dayOfYear = Math.floor(
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      Date.UTC(date.getUTCFullYear(), 0, 0)) /
      86_400_000
  );
  return marketingMessages[dayOfYear % marketingMessages.length];
}
