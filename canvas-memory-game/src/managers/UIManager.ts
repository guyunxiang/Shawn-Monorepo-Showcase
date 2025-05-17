import GameManager from "./GameManager";
import Renderer from "../components/Render";
import Button from "../components/Button";

class UIManager {
  private _gameManager: GameManager;
  private _renderer: Renderer;
  private _restartButton: Button;
  private _backButton: Button;
  private _active: boolean = false;
  private _headerTopOffset: number = 20;

  constructor(_gameManager: GameManager, _renderer: Renderer) {
    this._gameManager = _gameManager;
    this._renderer = _renderer;

    const canvas = this._gameManager.getCanvas();
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    this._restartButton = new Button((canvasWidth - 200) / 2, canvasHeight * 0.5, 200, 60, "RESTART", _renderer);
    this._backButton = new Button(20, 10 + this._headerTopOffset, 100, 40, "BACK", _renderer);

    const canvasEl = canvas.getElement();
    canvasEl.addEventListener("mousedown", this.handleMouseDown);
    canvasEl.addEventListener("mouseup", this.handleMouseUp);
  }

  private handleMouseDown = (e: MouseEvent): void => {
    const rect = this._gameManager.getCanvas().getElement().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this._backButton.isClicked(x, y)) {
      window.location.reload(); // ✅ simulate back to StartScreen
      return;
    }
    
    this._active = this._restartButton.isClicked(x, y);
    this._gameManager.draw();
  };

  private handleMouseUp = (): void => {
    this._active = false;
    this._gameManager.draw();
  };

  drawGameInfo(steps: number, bestSteps: number): void {
    const ctx = this._renderer.getContext();
    const canvas = this._gameManager.getCanvas();
    const canvasWidth = canvas.getWidth();

    // clear any existing header
    ctx.clearRect(0, 0, canvasWidth, 80);

    // draw back button
    this._backButton.draw();

    // draw Steps in center
    ctx.fillStyle = '#000';
    ctx.font = '48px Gloria Hallelujah';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`Steps: ${steps}`, canvasWidth / 2, 20 + this._headerTopOffset);

    // draw Best on right
    ctx.textAlign = 'right';
    ctx.font = '20px Gloria Hallelujah';
    ctx.fillText(`Best: ${isFinite(bestSteps) ? bestSteps : '-'}`, canvasWidth - 20, 26 + this._headerTopOffset);
  }

  drawGameOver(steps: number): void {
    const ctx = this._renderer.getContext();
    const canvas = this._gameManager.getCanvas();
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = '#fff';
    ctx.font = '48px Gloria Hallelujah';
    ctx.textAlign = 'center';
    ctx.fillText(`🎉 Victory! You finished in ${steps} steps`, canvasWidth / 2, canvasHeight * 0.4);

    this._restartButton.draw(this._active);
  }

  isRestartClicked(x: number, y: number): boolean {
    return this._restartButton.isClicked(x, y);
  }

  isBackClicked(x: number, y: number): boolean {
    return this._backButton.isClicked(x, y);
  }
}

export default UIManager;