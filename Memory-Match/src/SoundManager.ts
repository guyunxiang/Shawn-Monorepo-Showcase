class SoundManager {
  private _bgMusic: HTMLAudioElement;
  private _flipSound: HTMLAudioElement;
  private _matchSound: HTMLAudioElement;
  private _failSound: HTMLAudioElement;
  private _victorySound: HTMLAudioElement;

  constructor() {
    this._bgMusic = new Audio('/assets/audio/bg-music.mp3');
    this._bgMusic.loop = true;
    this._bgMusic.volume = 0.4;

    this._flipSound = new Audio('/assets/audio/flip.mp3');
    this._matchSound = new Audio('/assets/audio/match.mp3');
    this._failSound = new Audio('/assets/audio/fail.mp3');
    this._victorySound = new Audio('/assets/audio/victory.mp3');
  }

  playFlip(): void {
    this._flipSound.currentTime = 0;
    this._flipSound.play();
  }

  playMatch(): void {
    this._matchSound.currentTime = 0;
    this._matchSound.play();
  }

  playFail(): void {
    this._failSound.currentTime = 0;
    this._failSound.play();
  }

  playVictory(): void {
    this._victorySound.currentTime = 0;
    this._victorySound.play();
  }

  playBackground(): void {
    this._bgMusic.play().catch(e => {
      console.warn('autoplay blocked');
    });
  }

  toggleMute(): void {
    const muted = !this._bgMusic.muted;
    this._bgMusic.muted = muted;
    this._victorySound.muted = muted;
    this._flipSound.muted = muted;
    this._matchSound.muted = muted;
    this._failSound.muted = muted;
  }

  isMuted(): boolean {
    return this._bgMusic.muted;
  }
}

export default SoundManager;