import { SoundManager } from './audio';

export class BGMController {
  private sound: SoundManager;
  private hasStarted = false;
  private alreadyTried = false;

  constructor(sound: SoundManager) {
    this.sound = sound;
  }

  tryPlay() {
    if (this.hasStarted || this.alreadyTried) return;

    this.alreadyTried = true;
    this.sound.playBackground(); // internally handles catch
  }

  enableAutoStart(canvas: HTMLCanvasElement) {
    // try immediately
    this.tryPlay();

    // fallback: wait for user interaction
    const handler = () => {
      if (!this.hasStarted) {
        this.sound.playBackground();
        this.hasStarted = true;
      }
      // remove listener after first interaction
      canvas.removeEventListener('click', handler);
      canvas.removeEventListener('touchstart', handler);
    };

    canvas.addEventListener('click', handler);
    canvas.addEventListener('touchstart', handler);
  }
}
