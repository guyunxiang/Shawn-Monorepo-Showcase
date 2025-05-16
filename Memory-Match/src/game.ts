import { Card } from './card';
import { canvas } from './canvas';

export function generateCards(): Card[] {
  const EMOJIS = ['😄', '😢', '😠', '😱', '😯', '😌'];
  const pairs = [...EMOJIS, ...EMOJIS];
  const shuffled = shuffleArray(pairs);

  const cols = 4;
  const rows = 3;

  const paddingTop = 50; // ✅ like CSS padding-top
  const availableHeight = canvas.height - paddingTop;

  const cardWidth = canvas.width / (cols + 1);
  const cardHeight = availableHeight / (rows + 1);
  const paddingX = cardWidth / (cols + 1);
  const paddingY = cardHeight / (rows + 1);

  const cards: Card[] = [];

  for (let i = 0; i < shuffled.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const x = paddingX + col * (cardWidth + paddingX);
    const y = paddingTop + paddingY + row * (cardHeight + paddingY); // ✅ simulate padding-top
    cards.push(new Card(x, y, cardWidth, cardHeight, shuffled[i]));
  }

  return cards;
}

// helper function: Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
