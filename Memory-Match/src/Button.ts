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

  draw(): void {
    const ctx = this._renderer.getContext();

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this._x, this._y, this._width, this._height);

    ctx.strokeStyle = '#000000';
    ctx.strokeRect(this._x, this._y, this._width, this._height);

    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this._text, this._x + this._width / 2, this._y + this._height / 2);
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