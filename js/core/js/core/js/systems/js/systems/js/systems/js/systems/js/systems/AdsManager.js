/**
 * AdsManager — Capa de monetización (AdMob vía @capacitor-community/admob).
 * En web es un no-op seguro; en Android muestra anuncios reales.
 * Instalación al empaquetar:  npm i @capacitor-community/admob
 */
import { CONFIG } from '../config.js';
import { StorageManager } from './StorageManager.js';

export class AdsManager {
  #gamesPlayed;

  constructor() {
    this.#gamesPlayed = StorageManager.getNumber(CONFIG.STORAGE_KEYS.GAMES_PLAYED, 0);
  }

  async init() {
    if (!CONFIG.ADS.ENABLED) return;
    // const { AdMob } = await import('@capacitor-community/admob');
    // await AdMob.initialize();
  }

  /** Llamar en cada game over: muestra interstitial cada N partidas. */
  async onGameEnd() {
    this.#gamesPlayed++;
    StorageManager.set(CONFIG.STORAGE_KEYS.GAMES_PLAYED, this.#gamesPlayed);

    if (!CONFIG.ADS.ENABLED) return;
    if (this.#gamesPlayed % CONFIG.ADS.INTERSTITIAL_EVERY_N_GAMES !== 0) return;

    // const { AdMob } = await import('@capacitor-community/admob');
    // await AdMob.prepareInterstitial({ adId: CONFIG.ADS.INTERSTITIAL_ID });
    // await AdMob.showInterstitial();
  }
}
