/**
 * config.js — Configuración central del juego.
 * Toda constante de balance/diseño vive aquí.
 */
export const CONFIG = Object.freeze({
  GAME_NAME: 'Color Rush',
  VERSION: '1.0.0',

  // Paleta jugable
  COLORS: [
    { id: 'rojo',     name: 'ROJO',     hex: '#ff3b5c' },
    { id: 'azul',     name: 'AZUL',     hex: '#2f7bff' },
    { id: 'verde',    name: 'VERDE',    hex: '#19d97c' },
    { id: 'amarillo', name: 'AMARILLO', hex: '#ffc93b' },
    { id: 'morado',   name: 'MORADO',   hex: '#b44bff' },
    { id: 'naranja',  name: 'NARANJA',  hex: '#ff7a2f' },
  ],

  // Balance / dificultad
  DIFFICULTY: {
    INITIAL_TIME_MS: 3000,   // tiempo por ronda al inicio
    MIN_TIME_MS: 900,        // tiempo mínimo (techo de dificultad)
    TIME_STEP_MS: 250,       // cuánto se reduce por nivel
    POINTS_PER_LEVEL: 5,     // puntos para subir de nivel
    TUTORIAL_ROUNDS: 5,      // primeras rondas siempre "significado"
    INK_RULE_CHANCE: 0.5,    // prob. de regla "tinta"
    SAME_COLOR_CHANCE: 0.25, // prob. de que palabra y tinta coincidan
    TILE_COUNT: 4,
  },

  // Monetización (AdMob vía Capacitor)
  ADS: {
    ENABLED: false,
    INTERSTITIAL_EVERY_N_GAMES: 3,
    BANNER_ID: 'ca-app-pub-XXXX/BANNER',
    INTERSTITIAL_ID: 'ca-app-pub-XXXX/INTERSTITIAL',
  },

  STORAGE_KEYS: {
    BEST_SCORE: 'cr_best_score',
    GAMES_PLAYED: 'cr_games_played',
    SOUND_ON: 'cr_sound_on',
  },
});
