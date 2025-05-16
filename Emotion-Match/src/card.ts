import { ctx } from './canvas';

export class Card {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  flipped: boolean;
  isAnimating: boolean = false;
  scaleX: number = 1;

  constructor(x: number, y: number, width: number, height: number, label: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.flipped = false;
  }

  draw() {
    ctx.save();

    // translate to center of card
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.scale(this.scaleX, 1); // simulate horizontal flip
    ctx.translate(-this.width / 2, -this.height / 2);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.strokeStyle = '#333';
    ctx.strokeRect(0, 0, this.width, this.height);

    if (this.flipped) {
      ctx.fillStyle = '#000';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.label, this.width / 2, this.height / 2);
    }

    ctx.restore();
  }
}
