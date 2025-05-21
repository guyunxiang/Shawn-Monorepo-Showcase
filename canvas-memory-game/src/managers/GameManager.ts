import Canvas from "../canvas/Canvas";
import CardManager from "./CardManager";
import InputManager from "./InputManager";
import Renderer from "../components/Render";
import SoundManager from "./SoundManager";
import UIManager from "./UIManager";
import type { Difficulty } from "../types/types";

export default class GameManager {
  private _canvas: Canvas;
  private _renderer: Renderer;
  private _cardManager: CardManager;
  private _uiManager: UIManager;
  private _soundManager: SoundManager;

  private _steps: number = 0;
  private _bestSteps: number = Infinity;
  private _isGameOver: boolean = false;
  private _theme: string = 'animals';

  private _leftBgImage: HTMLImageElement = new Image();
  private _rightBgImage: HTMLImageElement = new Image();
  private _imgLoaded: number = 0;

  // background entrance animation
  private _bgAnimProgress: number = 0;
  private _bgAnimSpeed: number = 0.05;

  constructor(difficulty: Difficulty = 'normal', theme: string = 'animals') {
    this._canvas = new Canvas(() => this.resize());
    this._renderer = new Renderer(this._canvas.getContext());
    this._soundManager = new SoundManager();
    this._theme = theme;

    this._cardManager = new CardManager(this, difficulty);
    this._cardManager.setTheme(this._theme);
    this._uiManager = new UIManager(this, this._renderer);
    new InputManager(this, this._canvas.getElement());

    this._leftBgImage.src = '/assets/game-bg-lb.png';
    this._rightBgImage.src = '/assets/game-bg-rb.png';
    this._leftBgImage.onload = this._onImgLoad.bind(this);
    this._rightBgImage.onload = this._onImgLoad.bind(this);

    this.init();
  }

  init(): void {
    this.loadBestSteps();
    this._canvas.resize();
    this._cardManager.loadAssets(() => {
      this.startGame();
    });
  }

  private _onImgLoad() {
    this._imgLoaded++;
    // when both images are ready, start drawing with animation
    if (this._imgLoaded === 2 && this._cardManager.isReady()) {
      // ensure card assets are also loaded
      this._bgAnimProgress = 0;
      this.draw();
    }
  }

  resize(): void {
    this._cardManager.resizeAndLayout();
    this._renderer.clear();
    this.draw();
  }

  startGame(): void {
    this._steps = 0;
    this._isGameOver = false;
    this._bgAnimProgress = 0; // reset animation progress
    this._cardManager.generateCards();
    // this.draw();
  }

  draw(): void {
    this._renderer.clear();
    this._cardManager.drawCards();
    this._uiManager.drawGameInfo(this._steps, this._bestSteps);

    // draw animated decorative background images
    if (this._imgLoaded >= 2) {
      this.drawBackageImage();

      // animate until progress reaches 1
      if (this._bgAnimProgress < 1) {
        this._bgAnimProgress += this._bgAnimSpeed;
        if (this._bgAnimProgress > 1) this._bgAnimProgress = 1;

        requestAnimationFrame(() => this.draw());
      }
    }

    if (this._isGameOver) {
      this._uiManager.drawGameOver(this._steps);
    }
  }

  private drawBackageImage() {
    const ctx = this._canvas.getContext();
    const canvasWidth = this._canvas.getWidth();
    const canvasHeight = this._canvas.getHeight();

    const leftX = -this._leftBgImage.width + this._leftBgImage.width * this._bgAnimProgress;
    const rightX = canvasWidth - this._rightBgImage.width * this._bgAnimProgress;
    const y = canvasHeight - this._leftBgImage.height;

    ctx.drawImage(this._leftBgImage, leftX, y);
    ctx.drawImage(this._rightBgImage, rightX, y);
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

  setTheme(theme: string): void {
    if (theme === this._theme) return;

    this._theme = theme;
    this._cardManager.setTheme(theme);

    this._cardManager.loadAssets(() => {
      this.startGame();
    });
  }

  getTheme(): string {
    return this._theme;
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
}
