/**
 * EventBus — Patrón publicador/suscriptor.
 * Desacopla los sistemas: nadie se conoce directamente, solo emiten/escuchan eventos.
 */
export class EventBus {
  #listeners = new Map();

  on(event, callback) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(callback);
    return () => this.off(event, callback); // devuelve función para desuscribir
  }

  off(event, callback) {
    this.#listeners.get(event)?.delete(callback);
  }

  emit(event, payload) {
    this.#listeners.get(event)?.forEach((cb) => cb(payload));
  }
}

/** Catálogo de eventos del juego: evita strings mágicos regados por el código. */
export const Events = Object.freeze({
  GAME_START: 'game:start',
  ROUND_NEW: 'round:new',
  ROUND_HIT: 'round:hit',
  ROUND_MISS: 'round:miss',
  ROUND_TIMEOUT: 'round:timeout',
  LEVEL_UP: 'level:up',
  GAME_OVER: 'game:over',
  TIMER_TICK: 'timer:tick',
  STATE_CHANGE: 'state:change',
});
