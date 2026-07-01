/**
 * GameEngine — Orquestador central.
 * Contiene el game loop (requestAnimationFrame + delta time) y coordina
 * los sistemas a través del EventBus. No toca el DOM directamente.
 */
import { CONFIG } from '../config.js';
import { Events } from './EventBus.js';
import { States } from './StateManager.js';

export class GameEngine {
  #bus; #state; #rounds; #score;
  #timeLimit = CONFIG.DIFFICULTY.INITIAL_TIME_MS;
  #timeLeft = 0;
  #lastTs = 0;
  #rafId = null;

  constructor({ eventBus, stateManager, roundGenerator, scoreManager }) {
    this.#bus = eventBus;
    this.#state = stateManager;
    this.#rounds = roundGenerator;
    this.#score = scoreManager;
  }

  start() {
    this.#score.reset();
    this.#timeLimit = CONFIG.DIFFICULTY.INITIAL_TIME_MS;
    this.#state.transition(States.PLAYING);
    this.#bus.emit(Events.GAME_START);
    this.#newRound();
    this.#startLoop();
  }

  /** El jugador tocó la casilla i. */
  handleTap(index) {
    if (!this.#state.is(States.PLAYING)) return;

    if (this.#rounds.isCorrect(index)) {
      const result = this.#score.registerHit();
      this.#bus.emit(Events.ROUND_HIT, result);
      if (result.leveledUp) {
        this.#timeLimit = Math.max(
          CONFIG.DIFFICULTY.MIN_TIME_MS,
          this.#timeLimit - CONFIG.DIFFICULTY.TIME_STEP_MS
        );
        this.#bus.emit(Events.LEVEL_UP, { level: result.level });
      }
      this.#newRound();
    } else {
      this.#bus.emit(Events.ROUND_MISS);
      this.#end();
    }
  }

  #newRound() {
    const round = this.#rounds.generate(this.#score.score);
    this.#timeLeft = this.#timeLimit;
    this.#bus.emit(Events.ROUND_NEW, round);
  }

  #startLoop() {
    cancelAnimationFrame(this.#rafId);
    this.#lastTs = performance.now();
    const tick = (ts) => {
      if (!this.#state.is(States.PLAYING)) return;
      const dt = ts - this.#lastTs;
      this.#lastTs = ts;
      this.#timeLeft -= dt;
      this.#bus.emit(Events.TIMER_TICK, {
        ratio: Math.max(0, this.#timeLeft / this.#timeLimit),
      });
      if (this.#timeLeft <= 0) {
        this.#bus.emit(Events.ROUND_TIMEOUT);
        this.#end();
        return;
      }
      this.#rafId = requestAnimationFrame(tick);
    };
    this.#rafId = requestAnimationFrame(tick);
  }

  #end() {
    cancelAnimationFrame(this.#rafId);
    this.#state.transition(States.GAME_OVER);
    this.#bus.emit(Events.GAME_OVER, this.#score.summary());
  }
}
