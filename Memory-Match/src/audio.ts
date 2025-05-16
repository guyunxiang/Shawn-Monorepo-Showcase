export class SoundManager {
  bgMusic: HTMLAudioElement;
  flipSound: HTMLAudioElement;
  matchSound: HTMLAudioElement;
  failSound: HTMLAudioElement;
  victorySound: HTMLAudioElement;

  constructor() {
    this.bgMusic = new Audio('/assets/audio/bg-music.mp3');
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.4;

    this.flipSound = new Audio('/assets/audio/flip.mp3');
    this.matchSound = new Audio('/assets/audio/match.mp3');
    this.failSound = new Audio('/assets/audio/fail.mp3');
    this.victorySound = new Audio('/assets/audio/victory.mp3');
  }

  playFlip() {
    this.flipSound.currentTime = 0;
    this.flipSound.play();
  }

  playMatch() {
    this.matchSound.currentTime = 0;
    this.matchSound.play();
  }

  playFail() {
    this.failSound.currentTime = 0;
    this.failSound.play();
  }

  playVictory() {
    this.victorySound.currentTime = 0;
    this.victorySound.play();
  }

  playBackground() {
    this.bgMusic.play().catch(e => {
      console.warn('autoplay blocked');
    });
  }

  toggleMute() {
    const muted = !this.bgMusic.muted;
    this.bgMusic.muted = muted;
    this.victorySound.muted = muted;
    this.flipSound.muted = muted;
    this.matchSound.muted = muted;
    this.failSound.muted = muted;
  }
}
