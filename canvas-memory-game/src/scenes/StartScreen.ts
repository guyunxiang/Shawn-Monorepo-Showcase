import Button from "../components/Button";
import Renderer from "../components/Render";
import SoundManager from "../managers/SoundManager";
import Card from "../components/Card";

type Difficulty = 'easy' | 'normal' | 'hard';

class StartScreen {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _renderer: Renderer;
  private _soundManager: SoundManager;
  private _buttons: Button[] = [];
  private _emojis = ['😀', '😅', '😂', '😍', '😎', '😡', '😱', '😴', '😇'];
  private _emojiIndex = 0;
  private _onSelect: (difficulty: Difficulty) => void;
  private _backImage: HTMLImageElement = new Image();
  private _previewCard: Card;
  private _activeButton: Button | null = null;

  constructor(canvas: HTMLCanvasElement, renderer: Renderer, onSelect: (difficulty: Difficulty) => void) {
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d")!;
    this._renderer = renderer;
    this._onSelect = onSelect;

    this._soundManager = new SoundManager();
    this._soundManager.enableAutoBGM(canvas);

    this._backImage.src = "/assets/card-back.png";
    this._backImage.onload = () => this.draw();

    const w = 180;
    const h = 240;
    const x = (this._canvas.width - w) / 2;
    const y = this._canvas.height * 0.25;
    this._previewCard = new Card(
      x, y,
      w, h,
      this._emojis[this._emojiIndex],
      this._renderer,
      this._backImage
    );

    this.setupButtons();
    this.bindEvents();
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
      this.animateFlip(this._previewCard, () => {
        this._emojiIndex = (this._emojiIndex + 1) % this._emojis.length;
        this._previewCard.setLabel(this._emojis[this._emojiIndex]);
        this._previewCard.setFlipped(true);
      });
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

  private handleMouseUp = (): void => {
    this._activeButton = null;
    this.draw();
  };

  private animateFlip(card: Card, onHalfFlip: () => void, onDone?: () => void): void {
    card.startAnimation();
    let progress = 0;
    let direction = -1;

    const animate = () => {
      progress += 0.1;
      card.setScaleX(Math.cos(progress));

      if (progress >= Math.PI / 2 && direction === -1) {
        onHalfFlip();
        direction = 1;
      }

      if (progress >= Math.PI) {
        card.setScaleX(1);
        card.stopAnimation();
        this.draw();
        if (onDone) onDone();
        return;
      }

      this.draw();
      requestAnimationFrame(animate);
    };

    animate();
  }

  public draw(): void {
    this._renderer.clear();
    this._previewCard.draw();
    this._buttons.forEach(btn => btn.draw(btn === this._activeButton));
  }

  public cleanup(): void {
    this._canvas.removeEventListener('click', this.handleClick);
    this._canvas.removeEventListener('mousedown', this.handleMouseDown);
    this._canvas.removeEventListener('mouseup', this.handleMouseUp);
  }
}

export default StartScreen;