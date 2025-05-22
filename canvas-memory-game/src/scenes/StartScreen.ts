import type { Difficulty } from "../types/types";
import Button from "../components/Button";
import Renderer from "../components/Render";
import SoundManager from "../managers/SoundManager";
import Card from "../components/Card";
import WindowManager from "../managers/WindowManager";
import { animateCardFlip } from "../utils/animations";
import { loadThemeImages } from "../utils/themeLoader";

class StartScreen {
  private _canvas: HTMLCanvasElement;
  private _renderer: Renderer;
  private _soundManager: SoundManager;
  private _buttons: Button[] = [];
  private _emojis = ['😀', '😅', '😂', '😍', '😎', '😡', '😱', '😴', '😇'];
  private _onSelect: (difficulty: Difficulty) => void;
  private _backImage: HTMLImageElement = new Image();
  private _previewCard!: Card;
  private _activeButton: Button | null = null;
  private _windowManager: WindowManager;
  private _themeImages: HTMLImageElement[] = [];
  private _theme: string = 'animals';
  private _leftBgImage: HTMLImageElement = new Image();
  private _rightBgImage: HTMLImageElement = new Image();
  private _titleImage: HTMLImageElement = new Image();
  private _centerBgImage: HTMLImageElement = new Image();

  private _transitionProgress = 0;
  private _transitionSpeed = 0.02;
  private _isTransitioning = false;
  private _hasEntered = false;
  private _transitionDirection: 'in' | 'out' = 'in';
  private _onTransitionEnd?: () => void;

  constructor(
    canvas: HTMLCanvasElement,
    renderer: Renderer,
    onSelect: (difficulty: Difficulty) => void,
    theme: string = "animals"
  ) {
    this._canvas = canvas;
    this._renderer = renderer;
    this._onSelect = onSelect;
    this._theme = theme;

    this._soundManager = new SoundManager();
    this._windowManager = new WindowManager();

    this.initImage();

    this.setupButtons();
    this.bindEvents();

    this._windowManager.addResizeListener(this.handleResize);
  }

  private initImage(): void {
    this._backImage.src = `/assets/${this._theme}/card-back.png`;
    this._leftBgImage.src = "/assets/start-bg-left.png";
    this._rightBgImage.src = "/assets/start-bg-right.png";
    this._titleImage.src = "/assets/title.png";
    this._centerBgImage.src = "/assets/bg-center.png";

    this._backImage.onload = () => this.initTheme();
  }

  private async initTheme() {
    this._themeImages = await loadThemeImages(this._theme);
    this.initPreviewCard();
    this.drawWithEntry();
  }

  private drawWithEntry(): void {
    if (this._hasEntered || this._isTransitioning) return;
    this._transitionDirection = 'in';
    this._transitionProgress = 0;
    this._isTransitioning = true;
    this.drawTransition(() => {
      this._hasEntered = true;
      this._isTransitioning = false;
      this.draw();
    });
  }

  private startExitTransition(callback: () => void) {
    if (this._isTransitioning) return;
    this._transitionDirection = 'out';
    this._transitionProgress = 1;
    this._isTransitioning = true;
    this._onTransitionEnd = callback;
    this.drawTransition(() => {
      this._isTransitioning = false;
      this._onTransitionEnd?.();
    });
  }

  private drawTransition(onComplete?: () => void): void {
    this._renderer.clear();
    const ctx = this._canvas.getContext("2d");
    if (!ctx) return;

    const progress = this._transitionProgress;
    const offsetLeft = -this._leftBgImage.width + this._leftBgImage.width * progress;
    const offsetRight = this._canvas.width - this._rightBgImage.width * progress;

    ctx.fillStyle = "#fbe2c2";
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    ctx.drawImage(this._leftBgImage, offsetLeft, 0, this._leftBgImage.width, this._canvas.height);
    ctx.drawImage(this._rightBgImage, offsetRight, 0, this._rightBgImage.width, this._canvas.height);

    this.drawTitle();
    this.drawCenterPreview();
    this._buttons.forEach(btn => btn.draw(btn === this._activeButton));

    this._transitionProgress += (this._transitionDirection === 'in' ? 1 : -1) * this._transitionSpeed;
    if ((this._transitionDirection === 'in' && this._transitionProgress < 1) ||
      (this._transitionDirection === 'out' && this._transitionProgress > 0)) {
      requestAnimationFrame(() => this.drawTransition(onComplete));
    } else {
      onComplete?.();
    }
  }

  public draw(): void {
    if (this._isTransitioning) return;
    this._renderer.clear();
    this.drawStaticBackground();
    this.drawTitle();
    this.drawCenterPreview();
    this._buttons.forEach(btn => btn.draw(btn === this._activeButton));
  }

  private drawStaticBackground(): void {
    const ctx = this._canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fbe2c2";
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    ctx.drawImage(this._leftBgImage, 0, 0, this._leftBgImage.width, this._canvas.height);
    ctx.drawImage(this._rightBgImage, this._canvas.width - this._rightBgImage.width, 0, this._rightBgImage.width, this._canvas.height);
  }

  private drawTitle(): void {
    const ctx = this._canvas.getContext("2d");
    if (!ctx || !this._titleImage.complete) return;
    const centerX = this._canvas.width / 2;
    const imgWidth = 508;
    const imgHeight = 75;
    const imgX = centerX - imgWidth / 2;
    const imgY = 80;
    ctx.drawImage(this._titleImage, imgX, imgY, imgWidth, imgHeight);
    ctx.font = "800 24px 'Playpen Sans Arabic', sans-serif";
    ctx.fillStyle = "#2e5c3f";
    ctx.textAlign = "center";
    ctx.fillText("A Cozy Game for Sharp Minds", centerX, imgY + imgHeight + 40);
  }

  private drawCenterPreview(): void {
    const ctx = this._canvas.getContext("2d");
    if (!ctx || !this._centerBgImage.complete) return;
    const bgWidth = 615;
    const bgHeight = 393;
    const centerX = this._canvas.width / 2;
    const bgX = centerX - bgWidth / 2;
    const bgY = 220;
    ctx.drawImage(this._centerBgImage, bgX, bgY, bgWidth, bgHeight);
    if (this._previewCard) {
      const cardW = this._previewCard.getWidth();
      const cardH = this._previewCard.getHeight();
      const cardX = centerX - cardW / 2;
      const cardY = bgY + (bgHeight - cardH) / 2;
      this._previewCard.setPosition(cardX, cardY);
      this._previewCard.draw();
    }
  }

  private handleClick = (e: MouseEvent): void => {
    if (this._isTransitioning) return;
    const rect = this._canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (
      x >= this._previewCard.getX() &&
      x <= this._previewCard.getX() + this._previewCard.getWidth() &&
      y >= this._previewCard.getY() &&
      y <= this._previewCard.getY() + this._previewCard.getHeight()
    ) {
      this._soundManager.playFlip();
      animateCardFlip(
        this._previewCard,
        () => {
          const newImage = this.getRandomThemeImage();
          this._previewCard.setLabel(newImage);
          this._previewCard.setFlipped(true);
        },
        () => this.draw(),
        () => this.draw()
      );
      return;
    }

    for (const button of this._buttons) {
      if (button.isClicked(x, y)) {
        this._soundManager.playFlip();
        const text = button.getText().toLowerCase() as Difficulty;

        this.startExitTransition(() => {
          this.cleanup();
          this._onSelect(text);
        });
        return;
      }
    }
  };

  private handleMouseDown = (e: MouseEvent): void => {
    if (this._isTransitioning) return;
    const rect = this._canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    this._activeButton = null;
    for (const button of this._buttons) {
      if (button.isClicked(x, y)) {
        this._activeButton = button;
        break;
      }
    }
    this.draw();
  };

  private handleMouseUp = (): void => {
    if (this._isTransitioning) return;
    this._activeButton = null;
    this.draw();
  };

  private handleResize = (): void => {
    if (!this._previewCard) return;
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
    this.layout();
    this.draw();
  };

  private initPreviewCard(): void {
    const w = 165;
    const h = 220;
    const x = (this._canvas.width - w) / 2;
    const y = this._canvas.height * 0.25;
    const frontImage = this.getRandomThemeImage();
    this._previewCard = new Card(x, y, w, h, frontImage, this._renderer, this._backImage);
  }

  private getRandomThemeImage(): HTMLImageElement | string {
    if (this._themeImages.length === 0) {
      return this._emojis[Math.floor(Math.random() * this._emojis.length)];
    }
    return this._themeImages[Math.floor(Math.random() * this._themeImages.length)];
  }

  private setupButtons(): void {
    const btnWidth = 120;
    const btnHeight = 50;
    const spacing = 40;
    const totalWidth = 3 * btnWidth + 2 * spacing;
    const startX = (this._canvas.width - totalWidth) / 2;
    const y = this._canvas.height * 0.7;
    const difficulties: Difficulty[] = ['easy', 'normal', 'hard'];
    difficulties.forEach((label, i) => {
      const x = startX + i * (btnWidth + spacing);
      const button = new Button(x, y, btnWidth, btnHeight, label.toUpperCase(), this._renderer);
      this._buttons.push(button);
    });
  }

  private bindEvents(): void {
    this._canvas.addEventListener('click', this.handleClick);
    this._canvas.addEventListener('mousedown', this.handleMouseDown);
    this._canvas.addEventListener('mouseup', this.handleMouseUp);
  }

  private layout(): void {
    const w = this._previewCard.getWidth();
    const x = (this._canvas.width - w) / 2;
    const y = this._canvas.height * 0.25;
    this._previewCard.setPosition(x, y);

    const btnWidth = 120;
    const spacing = 40;
    const totalWidth = 3 * btnWidth + 2 * spacing;
    const startX = (this._canvas.width - totalWidth) / 2;
    const yBtn = this._canvas.height * 0.7;

    this._buttons.forEach((button, i) => {
      const x = startX + i * (btnWidth + spacing);
      button.setPosition(x, yBtn);
    });
  }

  public cleanup(): void {
    this._canvas.removeEventListener('click', this.handleClick);
    this._canvas.removeEventListener('mousedown', this.handleMouseDown);
    this._canvas.removeEventListener('mouseup', this.handleMouseUp);
  }
}

export default StartScreen;