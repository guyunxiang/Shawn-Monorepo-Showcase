import BGMController from "./BGMController";
import Canvas from "./Canvas";
import CardManager from "./CardManager";
import InputManager from "./InputManager";
import Renderer from "./Render";
import SoundManager from "./SoundManager";
import UIManager from "./UIManager";

type Difficulty = 'easy' | 'normal' | 'hard';
export default class GameManager {
  private _canvas: Canvas;
  private _renderer: Renderer;
  private _cardManager: CardManager;
  private _inputManager: InputManager;
  private _uiManager: UIManager;
  private _soundManager: SoundManager;

  private _steps: number = 0;
  private _bestSteps: number = Infinity;
  private _isGameOver: boolean = false;

  constructor(difficulty: Difficulty = 'normal') {
    this._canvas = new Canvas(() => this.resize());
    this._renderer = new Renderer(this._canvas.getContext());
    this._soundManager = new SoundManager();

    this._cardManager = new CardManager(this, difficulty);
    this._cardManager = new CardManager(this);
    this._inputManager = new InputManager(this, this._canvas.getElement());
    this._uiManager = new UIManager(this, this._renderer);

    this.init();
  }

  init(): void {
    this.loadBestSteps();
    this.initSounds();
    this._canvas.resize();
    this._cardManager.loadAssets(() => {
      this.startGame();
    });
  }

  resize(): void {
    this._cardManager.resizeAndLayout();
    this._renderer.clear();
    this.draw();
  }

  startGame(): void {
    this._steps = 0;
    this._isGameOver = false;
    this._cardManager.generateCards();
    this.draw();
  }

  draw(): void {
    this._renderer.clear();
    this._cardManager.drawCards();
    this._uiManager.drawGameInfo(this._steps, this._bestSteps);

    if (this._isGameOver) {
      this._uiManager.drawGameOver(this._steps);
    }
  }

  incrementSteps(): void {
    this._steps++;
  }

  checkGameOver(): void {
    if (this._cardManager.allCardsMatched()) {
      this._isGameOver = true;
      this._soundManager.playVictory();
      this.saveBestSteps(this._steps);
      this.draw();
    }
  }

  loadBestSteps(): void {
    const stored = localStorage.getItem('_bestSteps');
    this._bestSteps = stored ? parseInt(stored) : Infinity;
  }

  saveBestSteps(_steps: number): void {
    if (_steps < this._bestSteps) {
      this._bestSteps = _steps;
      localStorage.setItem('_bestSteps', _steps.toString());
    }
  }

  // Getters
  getSoundManager(): SoundManager {
    return this._soundManager;
  }

  getCardManager(): CardManager {
    return this._cardManager;
  }

  getUIManager(): UIManager {
    return this._uiManager;
  }

  getRenderer(): Renderer {
    return this._renderer;
  }

  getCanvas(): Canvas {
    return this._canvas;
  }

  getSteps(): number {
    return this._steps;
  }

  getBestSteps(): number {
    return this._bestSteps;
  }

  isGameFinished(): boolean {
    return this._isGameOver;
  }

  private initSounds(): void {
    const bgmController = new BGMController(this._soundManager);
    bgmController.enableAutoStart(this._canvas.getElement());
  }
}