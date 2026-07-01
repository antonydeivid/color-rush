/**
 * UIManager — Única capa que toca el DOM.
 * Escucha eventos del juego y actualiza pantalla. La lógica nunca vive aquí.
 */
import { Events } from '../core/EventBus.js';
import { States } from '../core/StateManager.js';
import { vibrate } from '../utils.js';

export class UIManager {
  #bus;
  #el = {};

  constructor(eventBus) {
    this.#bus = eventBus;
    this.#cacheElements();
    this.#bindGameEvents();
  }

  #cacheElements() {
    const ids = [
      'menu', 'game', 'over', 'score', 'level', 'combo', 'timerBar',
      'rule', 'word', 'grid', 'finalScore', 'finalCombo', 'finalBest',
      'newRecord', 'menuBest', 'flash',
    ];
    ids.forEach((id) => (this.#el[id] = document.getElementById(id)));
    this.#el.tiles = [...document.querySelectorAll('.tile')];
  }

  /** Conecta la entrada del usuario con callbacks del exterior (inyección). */
  bindInput({ onPlay, onTileTap }) {
    document.getElementById('playBtn').addEventListener('click', onPlay);
    document.getElementById('retryBtn').addEventListener('click', onPlay);
    this.#el.tiles.forEach((tile, i) =>
      tile.addEventListener('pointerdown', () => onTileTap(i))
    );
  }

  #bindGameEvents() {
    this.#bus.on(Events.STATE_CHANGE, ({ to }) => this.#showScreen(to));
    this.#bus.on(Events.GAME_START, () => this.#resetHud());
    this.#bus.on(Events.ROUND_NEW, (round) => this.#renderRound(round));
    this.#bus.on(Events.ROUND_HIT, (r) => this.#renderHit(r));
    this.#bus.on(Events.ROUND_MISS, () => this.#renderMiss());
    this.#bus.on(Events.TIMER_TICK, ({ ratio }) => {
      this.#el.timerBar.style.width = `${ratio * 100}%`;
    });
    this.#bus.on(Events.GAME_OVER, (summary) => this.#renderGameOver(summary));
  }

  #showScreen(state) {
    const map = { [States.MENU]: 'menu', [States.PLAYING]: 'game', [States.GAME_OVER]: 'over' };
    ['menu', 'game', 'over'].forEach((id) =>
      this.#el[id].classList.toggle('hidden', id !== map[state])
    );
  }

  #resetHud() {
    this.#el.score.textContent = '0';
    this.#el.level.textContent = '1';
    this.#el.combo.textContent = '';
  }

  #renderRound({ word, ink, tiles, ruleIsMeaning }) {
    this.#el.rule.textContent = ruleIsMeaning ? 'TOCA EL SIGNIFICADO' : 'TOCA EL COLOR DE LA TINTA';
    this.#el.rule.className = ruleIsMeaning ? 'meaning' : 'ink';

    const w = this.#el.word;
    w.textContent = word.name;
    w.style.color = ink.hex;
    w.classList.remove('pop'); void w.offsetWidth; w.classList.add('pop');

    tiles.forEach((color, i) => (this.#el.tiles[i].style.background = color.hex));
  }

  #renderHit({ score, combo }) {
    this.#el.score.textContent = score;
    this.#el.combo.textContent = combo >= 3 ? `🔥 x${combo}` : '';
    vibrate(15);
  }

  #renderMiss() {
    const f = this.#el.flash;
    f.classList.remove('flashAnim'); void f.offsetWidth; f.classList.add('flashAnim');
    this.#el.word.classList.add('shake');
    setTimeout(() => this.#el.word.classList.remove('shake'), 300);
    vibrate([60, 40, 60]);
  }

  #renderGameOver({ score, bestCombo, best, isRecord }) {
    setTimeout(() => {
      this.#el.finalScore.textContent = score;
      this.#el.finalCombo.textContent = bestCombo;
      this.#el.finalBest.textContent = best;
      this.#el.menuBest.textContent = best;
      this.#el.newRecord.textContent = isRecord ? '⭐ ¡NUEVO RÉCORD!' : '';
    }, 120);
  }

  setLevel(level) {
    this.#el.level.textContent = level;
  }

  setMenuBest(best) {
    this.#el.menuBest.textContent = best;
  }
}
