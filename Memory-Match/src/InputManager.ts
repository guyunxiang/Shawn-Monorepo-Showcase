import GameManager from "./GameManager";

class InputManager {
  private _gameManager: GameManager;
  private _canvas: HTMLCanvasElement;

  constructor(_gameManager: GameManager, _canvas: HTMLCanvasElement) {
    this._gameManager = _gameManager;
    this._canvas = _canvas;
    this.setupEventListeners();
  }

  setupEventListeners(): void {
    this._canvas.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(event: MouseEvent): void {
    const rect = this._canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (this._gameManager.isGameFinished()) {
      // Check if restart button was clicked
      const uiManager = this._gameManager.getUIManager();
      if (uiManager.isRestartButtonClicked(clickX, clickY)) {
        this._gameManager.startGame();
      }
      return;
    }

    // Handle card clicks
    this._gameManager.getCardManager().handleCardClick(clickX, clickY);
  }
}

export default InputManager;