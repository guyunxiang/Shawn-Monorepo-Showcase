import Button from "../Button";
import Renderer from "../Render";

type Difficulty = 'easy' | 'normal' | 'hard';

class StartScreen {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _renderer: Renderer;
  private _buttons: Button[] = [];
  private _emojis = ['😀', '😅', '😂', '😍', '😎', '😡', '😱', '😴', '😇'];
  private _emojiIndex = 0;
  private _flipped = false;
  private _scaleX = 1;
  private _onSelect: (difficulty: Difficulty) => void;

  constructor(canvas: HTMLCanvasElement, renderer: Renderer, onSelect: (difficulty: Difficulty) => void) {
    this._canvas = canvas;
    this._ctx = canvas.getContext("2d")!;
    this._renderer = renderer;
    this._onSelect = onSelect;

    this.setupButtons();
    this.draw();
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
  }

  private handleClick = (e: MouseEvent): void => {
    const rect = this._canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // check if clicked on card
    if (this.isCardClicked(x, y)) {
      this.flipCard();
      return;
    }

    // check buttons
    for (const button of this._buttons) {
      if (button.isClicked(x, y)) {
        const text = button.getText().toLowerCase() as Difficulty;
        this.cleanup();
        this._onSelect(text);
        return;
      }
    }
  };

  private isCardClicked(x: number, y: number): boolean {
    const w = 120;
    const h = 160;
    const cx = (this._canvas.width - w) / 2;
    const cy = this._canvas.height * 0.25;

    return x >= cx && x <= cx + w && y >= cy && y <= cy + h;
  }

  private flipCard(): void {
    this._flipped = !this._flipped;
    let progress = 0;

    const animate = () => {
      progress += 0.1;
      this._scaleX = Math.cos(progress);

      if (progress >= Math.PI / 2 && this._flipped) {
        this._emojiIndex = (this._emojiIndex + 1) % this._emojis.length;
      }

      this.draw();

      if (progress < Math.PI) {
        requestAnimationFrame(animate);
      } else {
        this._scaleX = 1;
        this.draw();
      }
    };

    animate();
  }

  public draw(): void {
    this._renderer.clear();

    // draw card
    const w = 120;
    const h = 160;
    const x = (this._canvas.width - w) / 2;
    const y = this._canvas.height * 0.25;

    this._ctx.save();
    this._ctx.translate(x + w / 2, y + h / 2);
    this._ctx.scale(this._scaleX, 1);
    this._ctx.translate(-w / 2, -h / 2);

    this._renderer.drawRoundedRect(0, 0, w, h, 12);
    this._ctx.fillStyle = "#ffe082";
    this._ctx.fill();
    this._ctx.strokeStyle = "#888";
    this._ctx.stroke();

    this._ctx.fillStyle = "#000";
    this._ctx.font = "48px serif";
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "middle";

    if (this._flipped) {
      this._ctx.fillText(this._emojis[this._emojiIndex], w / 2, h / 2);
    } else {
      this._ctx.fillText("?", w / 2, h / 2);
    }

    this._ctx.restore();

    // draw buttons
    this._buttons.forEach(btn => btn.draw());
  }

  public cleanup(): void {
    this._canvas.removeEventListener('click', this.handleClick);
  }
}

export default StartScreen;
