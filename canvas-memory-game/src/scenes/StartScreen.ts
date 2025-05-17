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
  // private _ctx: CanvasRenderingContext2D;
  private _renderer: Renderer;
  private _soundManager: SoundManager;
  private _buttons: Button[] = [];
  private _emojis = ['😀', '😅', '😂', '😍', '😎', '😡', '😱', '😴', '😇'];
  // private _emojiIndex = 0;
  private _onSelect: (difficulty: Difficulty) => void;
  private _backImage: HTMLImageElement = new Image();
  private _previewCard!: Card;
  private _activeButton: Button | null = null;
  private _windowManager: WindowManager;
  private _themeImages: HTMLImageElement[] = [];
  private _theme: string = 'animals';

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

    this._soundManager.enableAutoBGM(this._canvas);
    this.initBackgroundImage();

    this.setupButtons();
    this.bindEvents();

    this._windowManager.addResizeListener(this.handleResize);
  }

  // initialize background image and background music
  private initBackgroundImage(): void {
    this._backImage.src = `/assets/${this._theme}/card-back.png`;
    this._backImage.onload = () => this.initTheme();
  }

  // initialize preview card with current canvas size
  private initPreviewCard(): void {
    const w = 225;
    const h = 300;
    const x = (this._canvas.width - w) / 2;
    const y = this._canvas.height * 0.25;

    const frontImage = this.getRandomThemeImage();

    this._previewCard = new Card(
      x, y,
      w, h,
      frontImage,
      this._renderer,
      this._backImage
    );
  }

  private getRandomThemeImage(): HTMLImageElement | string {
    if (this._themeImages.length === 0) {
      const idx = Math.floor(Math.random() * this._emojis.length);
      return this._emojis[idx];
    }
    const idx = Math.floor(Math.random() * this._themeImages.length);
    return this._themeImages[idx];
  }

  private async initTheme() {
    this._themeImages = await loadThemeImages(this._theme);
    this.initPreviewCard();
    this.draw();
  }

  // adjust layout of preview card and buttons based on canvas size
  private layout(): void {
    // re-layout preview card
    const w = this._previewCard.getWidth();
    const x = (this._canvas.width - w) / 2;
    const y = this._canvas.height * 0.25;
    this._previewCard.setPosition(x, y);

    // re-layout buttons
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

  // handle window resize
  private handleResize = (): void => {
    if (!this._previewCard) return;
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
    this.layout();
    this.draw();
  };

  // setup difficulty buttons
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

  // bind mouse events to canvas
  private bindEvents(): void {
    this._canvas.addEventListener('click', this.handleClick);
    this._canvas.addEventListener('mousedown', this.handleMouseDown);
    this._canvas.addEventListener('mouseup', this.handleMouseUp);
  }

  // handle click event on canvas
  private handleClick = (e: MouseEvent): void => {
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
        () => this.draw(),       // draw at the end
        () => this.draw()        // draw every frame
      );
      return;
    }

    for (const button of this._buttons) {
      if (button.isClicked(x, y)) {
        this._soundManager.playFlip();
        const text = button.getText().toLowerCase() as Difficulty;
        this.cleanup();
        this._onSelect(text);
        return;
      }
    }
  };

  // handle mousedown to highlight active button
  private handleMouseDown = (e: MouseEvent): void => {
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

  // handle mouseup to remove highlight
  private handleMouseUp = (): void => {
    this._activeButton = null;
    this.draw();
  };

  // redraw all UI
  public draw(): void {
    this._renderer.clear();
    this._previewCard.draw();
    this._buttons.forEach(btn => btn.draw(btn === this._activeButton));
  }

  // remove event listeners
  public cleanup(): void {
    this._canvas.removeEventListener('click', this.handleClick);
    this._canvas.removeEventListener('mousedown', this.handleMouseDown);
    this._canvas.removeEventListener('mouseup', this.handleMouseUp);
  }
}

export default StartScreen;
