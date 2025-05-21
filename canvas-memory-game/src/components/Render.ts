class Renderer {
  private _ctx: CanvasRenderingContext2D;

  constructor(_ctx: CanvasRenderingContext2D) {
    this._ctx = _ctx;
  }

  clear(): void {
    this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    this._ctx.fillStyle = '#fbe2c2';
    this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
  }

  drawRoundedRect(x: number, y: number, width: number, height: number, radius: number): void {
    this._ctx.beginPath();
    this._ctx.moveTo(x + radius, y);
    this._ctx.lineTo(x + width - radius, y);
    this._ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this._ctx.lineTo(x + width, y + height - radius);
    this._ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this._ctx.lineTo(x + radius, y + height);
    this._ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this._ctx.lineTo(x, y + radius);
    this._ctx.quadraticCurveTo(x, y, x + radius, y);
    this._ctx.closePath();
  }

  getContext(): CanvasRenderingContext2D {
    return this._ctx;
  }
}

export default Renderer;