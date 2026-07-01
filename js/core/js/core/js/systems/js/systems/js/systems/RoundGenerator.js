/**
 * RoundGenerator — Lógica del efecto Stroop.
 * Genera cada ronda: palabra, tinta, regla y las 4 casillas (con trampa incluida).
 */
import { CONFIG } from '../config.js';
import { pick, shuffle } from '../utils.js';

export class RoundGenerator {
  #current = null;

  generate(score) {
    const D = CONFIG.DIFFICULTY;
    // Tutorial: primeras rondas siempre "significado" para enseñar la mecánica
    const ruleIsMeaning =
      score < D.TUTORIAL_ROUNDS ? true : Math.random() >= D.INK_RULE_CHANCE;

    const word = pick(CONFIG.COLORS);
    const ink =
      Math.random() < D.SAME_COLOR_CHANCE
        ? word
        : pick(CONFIG.COLORS.filter((c) => c.id !== word.id));

    const target = ruleIsMeaning ? word : ink;
    const trap = ruleIsMeaning ? ink : word; // la casilla que engaña al cerebro

    const distractors = shuffle(
      CONFIG.COLORS.filter((c) => c.id !== target.id && c.id !== trap.id)
    ).slice(0, trap.id === target.id ? D.TILE_COUNT - 1 : D.TILE_COUNT - 2);

    const tiles = shuffle(
      trap.id === target.id ? [target, ...distractors] : [target, trap, ...distractors]
    );

    this.#current = { word, ink, target, tiles, ruleIsMeaning };
    return this.#current;
  }

  isCorrect(tileIndex) {
    return this.#current?.tiles[tileIndex]?.id === this.#current?.target.id;
  }
}
