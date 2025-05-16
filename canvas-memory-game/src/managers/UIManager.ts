import GameManager from "./GameManager";
import Renderer from "../components/Render";

class UIManager {
  private _gameManager: GameManager;
  private _renderer: Renderer;
  private _restartButtonRect = { x: 0, y: 0, width: 200, height: 60 };

  constructor(_gameManager: GameManager, _renderer: Renderer) {
    this._gameManager = _gameManager;
    this._renderer = _renderer;
  }

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

    // text
    const message = `🎉 Game Over! You finished in ${steps} steps`;
    ctx.fillStyle = '#fff';
    ctx.font = '36px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, canvasWidth / 2, canvasHeight / 2 - 60);

    // draw restart button
    this._restartButtonRect.width = 200;
    this._restartButtonRect.height = 60;
    this._restartButtonRect.x = canvasWidth / 2 - this._restartButtonRect.width / 2;
    this._restartButtonRect.y = canvasHeight / 2 + 10;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(
      this._restartButtonRect.x,
      this._restartButtonRect.y,
      this._restartButtonRect.width,
      this._restartButtonRect.height
    );

    ctx.strokeStyle = '#000000';
    ctx.strokeRect(
      this._restartButtonRect.x,
      this._restartButtonRect.y,
      this._restartButtonRect.width,
      this._restartButtonRect.height
    );

    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.fillText('🔁 Restart', canvasWidth / 2, this._restartButtonRect.y + this._restartButtonRect.height / 2);
  }

  isRestartButtonClicked(x: number, y: number): boolean {
    const { x: buttonX, y: buttonY, width, height } = this._restartButtonRect;
    return (
      x >= buttonX &&
      x <= buttonX + width &&
      y >= buttonY &&
      y <= buttonY + height
    );
  }
}

export default UIManager;