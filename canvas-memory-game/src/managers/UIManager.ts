import GameManager from "./GameManager";
import Renderer from "../components/Render";
import Button from "../components/Button";

class UIManager {
  private _gameManager: GameManager;
  private _renderer: Renderer;
  private _restartButton: Button;
  private _active: boolean = false;

  constructor(_gameManager: GameManager, _renderer: Renderer) {
    this._gameManager = _gameManager;
    this._renderer = _renderer;

    const canvas = this._gameManager.getCanvas();
    const w = 200;
    const h = 60;
    const x = (canvas.getWidth() - w) / 2;
    const y = canvas.getHeight() * 0.5;

    this._restartButton = new Button(x, y, w, h, "RESTART", _renderer);

    const canvasEl = canvas.getElement();
    canvasEl.addEventListener("mousedown", this.handleMouseDown);
    canvasEl.addEventListener("mouseup", this.handleMouseUp);
  }

  private handleMouseDown = (e: MouseEvent): void => {
    const rect = this._gameManager.getCanvas().getElement().getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this._active = this._restartButton.isClicked(x, y);
    this._gameManager.draw();
  };

  private handleMouseUp = (): void => {
    this._active = false;
    this._gameManager.draw();
  };

  drawGameInfo(steps: number, bestSteps: number): void {
    const ctx = this._renderer.getContext();

    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Steps: ${steps}`, 20, 30);
    ctx.fillText(`Best: ${isFinite(bestSteps) ? bestSteps : '-'}`, 20, 60);
  }

  drawGameOver(steps: number): void {
    const ctx = this._renderer.getContext();
    const canvas = this._gameManager.getCanvas();
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    // dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // draw game over text
    ctx.fillStyle = '#fff';
    ctx.font = '48px serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🎉 Victory! You finished in ${steps} steps`, canvasWidth / 2, canvasHeight * 0.4);

    // draw restart button
    this._restartButton.draw(this._active);
  }

  isRestartClicked(x: number, y: number): boolean {
    return this._restartButton.isClicked(x, y);
  }
}

export default UIManager;