type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  colorScheme: 'light' | 'dark';
  onEvent: (event: 'themeChanged', cb: () => void) => void;
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
    notificationOccurred: (type: 'success' | 'error' | 'warning') => void;
  };
};

function getWebApp(): TelegramWebApp | null {
  const w = window as unknown as { Telegram?: { WebApp?: TelegramWebApp } };
  return w.Telegram?.WebApp ?? null;
}

function applyTheme() {
  const tg = getWebApp();
  const isDark = tg ? tg.colorScheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
}

export function initTelegram() {
  const tg = getWebApp();
  tg?.ready();
  tg?.expand();
  applyTheme();
  if (tg) {
    tg.onEvent('themeChanged', applyTheme);
  } else {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);
  }
}

export function setBackButton(onBack: (() => void) | null) {
  const tg = getWebApp();
  if (!tg) return;
  if (onBack) {
    tg.BackButton.show();
    tg.BackButton.onClick(onBack);
  } else {
    tg.BackButton.hide();
  }
}

export function haptic(kind: 'light' | 'medium' | 'heavy' = 'light') {
  getWebApp()?.HapticFeedback?.impactOccurred(kind);
}

export function hapticNotify(kind: 'success' | 'error' | 'warning') {
  getWebApp()?.HapticFeedback?.notificationOccurred(kind);
}

export function isInsideTelegram(): boolean {
  return getWebApp() !== null;
}
