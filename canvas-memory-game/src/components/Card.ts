import Renderer from "./Render";

class Card {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;
  private _label: string | HTMLImageElement;
  private _flipped: boolean;
  private _isAnimating: boolean = false;
  private _scaleX: number = 1;
  private _renderer: Renderer;
  private _backImage: HTMLImageElement;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string | HTMLImageElement,
    renderer: Renderer,
    backImage: HTMLImageElement
  ) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
    this._label = label;
    this._flipped = false;
    this._renderer = renderer;
    this._backImage = backImage;
  }

  draw(): void {
    const ctx = this._renderer.getContext();

    ctx.save();
    ctx.translate(this._x + this._width / 2, this._y + this._height / 2);
    ctx.scale(this._scaleX, 1);
    ctx.translate(-this._width / 2, -this._height / 2);

    const radius = 12;
    this._renderer.drawRoundedRect(0, 0, this._width, this._height, radius);
    ctx.clip();

    if (this._flipped) {
      const gradient = ctx.createLinearGradient(0, 0, 0, this._height);
      gradient.addColorStop(0, '#fffde7');
      gradient.addColorStop(1, '#ffe082');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this._width, this._height);

      if (this._label instanceof HTMLImageElement) {
        // Draw image content
        this.drawImageContent(ctx);
      } else {
        // Draw text/emoji content (fallback)
        ctx.fillStyle = '#000';
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this._label, this._width / 2, this._height / 2);
      }
    } else {
      if (this._backImage?.complete) {
        ctx.drawImage(this._backImage, 0, 0, this._width, this._height);
      } else {
        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, this._width, this._height);
        ctx.fillStyle = '#888';
        ctx.font = '24px serif';
        ctx.fillText('?', this._width / 2, this._height / 2);
      }
    }

    ctx.restore();
  }

  private drawImageContent(ctx: CanvasRenderingContext2D): void {
    if (!(this._label instanceof HTMLImageElement)) return;

    const image = this._label;
    const padding = 15; // Padding around the image

    // Available space for the image
    const availWidth = this._width - (padding * 2);
    const availHeight = this._height - (padding * 2);

    // Original image aspect ratio
    const imgRatio = image.width / image.height;

    // Calculate dimensions while maintaining aspect ratio
    let drawWidth, drawHeight;

    if (imgRatio > 1) {
      // Landscape image
      drawWidth = availWidth;
      drawHeight = drawWidth / imgRatio;

      // If height is still too large, scale down
      if (drawHeight > availHeight) {
        drawHeight = availHeight;
        drawWidth = drawHeight * imgRatio;
      }
    } else {
      // Portrait image
      drawHeight = availHeight;
      drawWidth = drawHeight * imgRatio;

      // If width is still too large, scale down
      if (drawWidth > availWidth) {
        drawWidth = availWidth;
        drawHeight = drawWidth / imgRatio;
      }
    }

    // Calculate position to center the image
    const xPos = (this._width - drawWidth) / 2;
    const yPos = (this._height - drawHeight) / 2;

    // Draw the image
    ctx.drawImage(image, xPos, yPos, drawWidth, drawHeight);
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

  getLabel(): string | HTMLImageElement {
    return this._label;
  }

  setLabel(label: string | HTMLImageElement): void {
    this._label = label;
  }

  isFlipped(): boolean {
    return this._flipped;
  }

  setFlipped(flipped: boolean): void {
    this._flipped = flipped;
  }

  isAnimating(): boolean {
    return this._isAnimating;
  }

  startAnimation(): void {
    this._isAnimating = true;
  }

  stopAnimation(): void {
    this._isAnimating = false;
  }

  setScaleX(scale: number): void {
    this._scaleX = scale;
  }

  setPosition(x: number, y: number): void {
    this._x = x;
    this._y = y;
  }

  setSize(width: number, height: number): void {
    this._width = width;
    this._height = height;
  }
}

export default Card;