import SoundManager from "../managers/SoundManager";

class BGMController {
  private _sound: SoundManager;
  private _hasStarted = false;
  private _alreadyTried = false;

  constructor(sound: SoundManager) {
    this._sound = sound;
  }

  tryPlay(): void {
    if (this._hasStarted || this._alreadyTried) return;

    this._alreadyTried = true;
    this._sound.playBackground(); // internally handles catch
  }

  enableAutoStart(canvas: HTMLCanvasElement): void {
    // try immediately
    this.tryPlay();

    // fallback: wait for user interaction
    const handler = () => {
      if (!this._hasStarted) {
        this._sound.playBackground();
        this._hasStarted = true;
      }
      // remove listener after first interaction
      canvas.removeEventListener('click', handler);
      canvas.removeEventListener('touchstart', handler);
    };

    canvas.addEventListener('click', handler);
    canvas.addEventListener('touchstart', handler);
  }
}

export default BGMController;