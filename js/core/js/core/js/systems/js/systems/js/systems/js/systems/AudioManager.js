/**
 * AudioManager — Sonido procedural con Web Audio API.
 * Genera los efectos por síntesis (cero archivos de audio = APK más liviano).
 */
export class AudioManager {
  #ctx = null;
  #enabled = true;

  /** El AudioContext debe crearse tras un gesto del usuario (política de navegadores). */
  #ensureContext() {
    if (!this.#ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.#ctx = new AC();
    }
    if (this.#ctx?.state === 'suspended') this.#ctx.resume();
    return this.#ctx;
  }

  setEnabled(on) { this.#enabled = on; }

  #beep({ freq = 440, duration = 0.1, type = 'sine', volume = 0.25, slideTo = null }) {
    if (!this.#enabled) return;
    const ctx = this.#ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + duration);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  hit(combo = 1) {
    // El tono sube con el combo: refuerzo positivo progresivo
    this.#beep({ freq: 500 + Math.min(combo, 12) * 60, duration: 0.08, type: 'triangle' });
  }

  levelUp() {
    this.#beep({ freq: 660, slideTo: 990, duration: 0.18, type: 'square', volume: 0.18 });
  }

  gameOver() {
    this.#beep({ freq: 330, slideTo: 110, duration: 0.4, type: 'sawtooth', volume: 0.2 });
  }

  tap() {
    this.#beep({ freq: 880, duration: 0.04, type: 'sine', volume: 0.12 });
  }
}
