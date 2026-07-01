/**
 * main.js — Punto de entrada (composition root).
 * Aquí se construyen e inyectan todas las dependencias. Nada más.
 */
import { EventBus, Events } from './core/EventBus.js';
import { StateManager } from './core/StateManager.js';
import { GameEngine } from './core/GameEngine.js';
import { RoundGenerator } from './systems/RoundGenerator.js';
import { ScoreManager } from './systems/ScoreManager.js';
import { AudioManager } from './systems/AudioManager.js';
import { AdsManager } from './systems/AdsManager.js';
import { UIManager } from './ui/UIManager.js';

const bus = new EventBus();
const state = new StateManager(bus);
const rounds = new RoundGenerator();
const score = new ScoreManager();
const audio = new AudioManager();
const ads = new AdsManager();
const ui = new UIManager(bus);

const engine = new GameEngine({
  eventBus: bus,
  stateManager: state,
  roundGenerator: rounds,
  scoreManager: score,
});

// Audio y anuncios reaccionan a eventos, sin acoplarse al motor
bus.on(Events.ROUND_HIT, ({ combo }) => audio.hit(combo));
bus.on(Events.LEVEL_UP, ({ level }) => { audio.levelUp(); ui.setLevel(level); });
bus.on(Events.ROUND_MISS, () => audio.gameOver());
bus.on(Events.ROUND_TIMEOUT, () => audio.gameOver());
bus.on(Events.GAME_OVER, () => ads.onGameEnd());

ui.bindInput({
  onPlay: () => { audio.tap(); engine.start(); },
  onTileTap: (i) => engine.handleTap(i),
});

ui.setMenuBest(score.best);
ads.init();
