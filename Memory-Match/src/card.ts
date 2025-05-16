import { ctx } from './canvas';
import { drawRoundedRect } from './utils';

export class Card {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  flipped: boolean;
  isAnimating: boolean = false;
  scaleX: number = 1;
  static backImage: HTMLImageElement;

  constructor(x: number, y: number, width: number, height: number, label: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.flipped = false;
  }

  static loadAssets(onLoaded: () => void) {
    const img = new Image();
    img.src = '/assets/card-back.png';
    img.onload = () => {
      Card.backImage = img;
      onLoaded();
    };
  }

  draw() {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.scale(this.scaleX, 1);
    ctx.translate(-this.width / 2, -this.height / 2);

    const radius = 12;
    drawRoundedRect(ctx, 0, 0, this.width, this.height, radius);
    ctx.clip();

    if (this.flipped) {
      const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, '#fffde7');
      gradient.addColorStop(1, '#ffe082');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.fillStyle = '#000';
      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.label, this.width / 2, this.height / 2);
    } else {
      if (Card.backImage?.complete) {
        ctx.drawImage(Card.backImage, 0, 0, this.width, this.height);
      } else {
        ctx.fillStyle = '#eee';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.fillStyle = '#888';
        ctx.font = '24px serif';
        ctx.fillText('?', this.width / 2, this.height / 2);
      }
    }

    ctx.restore();
  }
}
