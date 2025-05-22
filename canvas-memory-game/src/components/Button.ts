import Renderer from "./Render";

class Button {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;
  private _text: string;
  private _renderer: Renderer;

  constructor(x: number, y: number, width: number, height: number, text: string, renderer: Renderer) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._text = text;
    this._renderer = renderer;
  }

  draw(isActive: boolean = false): void {
    const ctx = this._renderer.getContext();
    ctx.save();

    const offsetY = isActive ? 2 : 0;
    const y = this._y + offsetY;

    // draw outer border
    ctx.beginPath();
    this._renderer.drawRoundedRect(this._x, y, this._width, this._height, 16);
    ctx.fillStyle = "#754332"; // dark border
    ctx.fill();

    // draw inner button with lighter orange
    ctx.beginPath();
    this._renderer.drawRoundedRect(this._x + 2, y + 2, this._width - 4, this._height - 4, 14);
    const gradient = ctx.createLinearGradient(0, y, 0, y + this._height);
    if (isActive) {
      gradient.addColorStop(0, '#e19b5a'); // darker pressed state
      gradient.addColorStop(1, '#c37d34');
    } else {
      gradient.addColorStop(0, '#f7c27c');
      gradient.addColorStop(1, '#f3b66f'); // match screenshot
    }
    ctx.fillStyle = gradient;
    ctx.fill();

    // draw text
    ctx.fillStyle = "#6e3d2d"; // font color
    ctx.font = "bold 20px 'Playpen Sans Arabic'";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this._text, this._x + this._width / 2, y + this._height / 2 + 2);

    ctx.restore();
  }

  isClicked(clickX: number, clickY: number): boolean {
    return (
      clickX >= this._x &&
      clickX <= this._x + this._width &&
      clickY >= this._y &&
      clickY <= this._y + this._height
    );
  }

  // Getters and setters
  getX(): number {
    return this._x;
  }

  getY(): number {
    return this._y;
  }

  getWidth(): number {
    return this._width;
  }

  getHeight(): number {
    return this._height;
  }

  getText(): string {
    return this._text;
  }

  setPosition(x: number, y: number): void {
    this._x = x;
    this._y = y;
  }

  setSize(width: number, height: number): void {
    this._width = width;
    this._height = height;
  }

  setText(text: string): void {
    this._text = text;
  }
}

export default Button;