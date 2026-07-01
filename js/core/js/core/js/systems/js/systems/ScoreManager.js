/**
 * ScoreManager — Puntuación, combo, nivel y récord.
 * Única fuente de verdad del progreso del jugador.
 */
import { CONFIG } from '../config.js';
import { StorageManager } from './StorageManager.js';

export class ScoreManager {
  #score = 0;
  #combo = 0;
  #bestCombo = 0;
  #level = 1;
  #best;

  constructor() {
    this.#best = StorageManager.getNumber(CONFIG.STORAGE_KEYS.BEST_SCORE, 0);
  }

  get score() { return this.#score; }
  get level() { return this.#level; }
  get best()  { return this.#best; }

  reset() {
    this.#score = 0;
    this.#combo = 0;
    this.#bestCombo = 0;
    this.#level = 1;
  }

  registerHit() {
    this.#score++;
    this.#combo++;
    this.#bestCombo = Math.max(this.#bestCombo, this.#combo);

    let leveledUp = false;
    if (this.#score % CONFIG.DIFFICULTY.POINTS_PER_LEVEL === 0) {
      this.#level++;
      leveledUp = true;
    }
    return { score: this.#score, combo: this.#combo, level: this.#level, leveledUp };
  }

  summary() {
    const isRecord = this.#score > this.#best;
    if (isRecord) {
      this.#best = this.#score;
      StorageManager.set(CONFIG.STORAGE_KEYS.BEST_SCORE, this.#best);
    }
    return {
      score: this.#score,
      bestCombo: this.#bestCombo,
      best: this.#best,
      isRecord: isRecord && this.#score > 0,
    };
  }
}
