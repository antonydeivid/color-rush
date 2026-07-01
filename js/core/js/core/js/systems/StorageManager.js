/**
 * StorageManager — Persistencia con degradación elegante.
 * En Android (WebView de Capacitor) usa localStorage; si no está disponible,
 * cae a memoria sin romper el juego.
 */
const memoryFallback = new Map();

function storageAvailable() {
  try {
    const k = '__test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

const HAS_STORAGE = storageAvailable();

export const StorageManager = {
  get(key, fallback = null) {
    try {
      const raw = HAS_STORAGE ? localStorage.getItem(key) : memoryFallback.get(key);
      return raw ?? fallback;
    } catch {
      return fallback;
    }
  },

  getNumber(key, fallback = 0) {
    const n = Number(this.get(key));
    return Number.isFinite(n) && this.get(key) !== null ? n : fallback;
  },

  set(key, value) {
    try {
      if (HAS_STORAGE) localStorage.setItem(key, String(value));
      else memoryFallback.set(key, String(value));
    } catch { /* sin espacio o bloqueado: el juego sigue */ }
  },
};
