/**
 * StateManager — Máquina de estados finitos (FSM).
 * El juego solo puede estar en UN estado a la vez, con transiciones controladas.
 */
import { Events } from './EventBus.js';

export const States = Object.freeze({
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
});

const TRANSITIONS = {
  [States.MENU]:      [States.PLAYING],
  [States.PLAYING]:   [States.GAME_OVER],
  [States.GAME_OVER]: [States.PLAYING, States.MENU],
};

export class StateManager {
  #current = States.MENU;
  #bus;

  constructor(eventBus) {
    this.#bus = eventBus;
  }

  get current() {
    return this.#current;
  }

  is(state) {
    return this.#current === state;
  }

  /** Transición validada: lanza error si el cambio no está permitido. */
  transition(to) {
    if (!TRANSITIONS[this.#current]?.includes(to)) {
      throw new Error(`Transición inválida: ${this.#current} → ${to}`);
    }
    const from = this.#current;
    this.#current = to;
    this.#bus.emit(Events.STATE_CHANGE, { from, to });
  }
}
