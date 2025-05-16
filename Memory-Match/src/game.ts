import { Card } from './card';
import { canvas } from './canvas';

export function generateCards(): Card[] {
  const EMOJIS = ['😄', '😢', '😠', '😱', '😯', '😌'];
  const pairs = [...EMOJIS, ...EMOJIS]; // 12 cards
  const shuffled = shuffleArray(pairs);

  const cols = 4;
  const rows = 3;

  const paddingTop = 80;
  const availableWidth = canvas.width;
  const availableHeight = canvas.height - paddingTop;

  // calculate max card height based on available height
  const cardHeight = availableHeight / (rows + 1); // leave spacing
  const cardWidth = (cardHeight * 3) / 4; // enforce 4:3 ratio

  // now check if width is too wide, adjust if needed
  const totalCardWidth = cols * cardWidth + (cols + 1) * (cardWidth / 2);

  let finalCardWidth = cardWidth;
  let finalCardHeight = cardHeight;

  if (totalCardWidth > availableWidth) {
    // fallback to width-limited layout
    finalCardWidth = availableWidth / (cols + 1);
    finalCardHeight = (finalCardWidth * 4) / 3;
  }

  const paddingX = (availableWidth - cols * finalCardWidth) / (cols + 1);
  const paddingY = (availableHeight - rows * finalCardHeight) / (rows + 1);

  const cards: Card[] = [];

  for (let i = 0; i < shuffled.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const x = paddingX + col * (finalCardWidth + paddingX);
    const y = paddingTop + paddingY + row * (finalCardHeight + paddingY);
    const card = new Card(x, y, finalCardWidth, finalCardHeight, shuffled[i]);
    cards.push(card);
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
