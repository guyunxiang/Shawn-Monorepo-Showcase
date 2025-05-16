import { resizeCanvas, ctx, canvas } from './canvas';
import { generateCards } from './game';
import { Card } from './card';

resizeCanvas();

let cards: Card[] = [];
let flippedCards: Card[] = [];
let steps = 0;
let bestSteps = loadBestSteps();
let isGameOver = false;

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cards.forEach(card => card.draw());

  // draw step info
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Steps: ${steps}`, 20, 30);
  ctx.fillText(`Best: ${isFinite(bestSteps) ? bestSteps : '-'}`, 20, 60);
}

let restartButtonRect = {
  x: 0,
  y: 0,
  width: 200,
  height: 60
};

function drawGameOver() {
  // dark overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // text
  const message = `🎉 Game Over! You finished in ${steps} steps`;
  ctx.fillStyle = '#fff';
  ctx.font = '36px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(message, canvas.width / 2, canvas.height / 2 - 60);

  // draw restart button
  restartButtonRect.width = 200;
  restartButtonRect.height = 60;
  restartButtonRect.x = canvas.width / 2 - restartButtonRect.width / 2;
  restartButtonRect.y = canvas.height / 2 + 10;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(
    restartButtonRect.x,
    restartButtonRect.y,
    restartButtonRect.width,
    restartButtonRect.height
  );

  ctx.strokeStyle = '#000000';
  ctx.strokeRect(
    restartButtonRect.x,
    restartButtonRect.y,
    restartButtonRect.width,
    restartButtonRect.height
  );

  ctx.fillStyle = '#000000';
  ctx.font = '24px Arial';
  ctx.fillText('🔁 Restart', canvas.width / 2, restartButtonRect.y + restartButtonRect.height / 2);
}


function loadBestSteps(): number {
  const stored = localStorage.getItem('bestSteps');
  return stored ? parseInt(stored) : Infinity;
}

function saveBestSteps(newSteps: number) {
  if (newSteps < bestSteps) {
    bestSteps = newSteps;
    localStorage.setItem('bestSteps', newSteps.toString());
  }
}

// initial draw
cards.forEach(card => {
  card.flipped = false;
});
drawAll();

// handle click event
canvas.addEventListener('click', (event: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  if (isGameOver) {
    const { x, y, width, height } = restartButtonRect;
    const within = (
      clickX >= x &&
      clickX <= x + width &&
      clickY >= y &&
      clickY <= y + height
    );
    if (within) {
      resetGame();
    }
    return;
  }

  for (let card of cards) {
    if (
      clickX >= card.x &&
      clickX <= card.x + card.width &&
      clickY >= card.y &&
      clickY <= card.y + card.height &&
      !card.flipped
    ) {
      if (flippedCards.length >= 2) return; // block if already 2 flipped

      animateFlip(card, () => {
        card.flipped = true;
        flippedCards.push(card);
        if (flippedCards.length === 2) {
          checkMatch();
        }
      });

      if (flippedCards.length === 2) {
        checkMatch();
      }
      break;
    }
  }
});

function checkGameOver() {
  const allMatched = cards.every(card => card.flipped);

  if (allMatched) {
    isGameOver = true;
    saveBestSteps(steps);
    setTimeout(() => {
      drawGameOver();
    }, 500);
  }
}

function resetGame() {
  cards = generateCards();
  flippedCards = [];
  steps = 0;
  isGameOver = false;
  drawAll();
}

resetGame();

function checkMatch() {
  const [card1, card2] = flippedCards;

  steps++;

  if (card1.label === card2.label) {
    flippedCards = [];
    drawAll();
    checkGameOver();
  } else {
    // disable interaction during animation
    setTimeout(() => {
      // use animateFlip to flip back
      animateFlip(card1, () => (card1.flipped = false));
      animateFlip(card2, () => (card2.flipped = false), () => {
        flippedCards = [];
        drawAll();
      });
    }, 1000);
  }
}


function animateFlip(card: Card, onHalfFlip: () => void, onDone?: () => void) {
  card.isAnimating = true;

  let progress = 0;
  let direction = -1;

  function animate() {
    progress += 0.1;
    card.scaleX = Math.cos(progress); // from 1 → 0 → -1

    // halfway point
    if (progress >= Math.PI / 2 && direction === -1) {
      onHalfFlip(); // flip label or reverse flip
      direction = 1;
    }

    if (progress >= Math.PI) {
      card.scaleX = 1;
      card.isAnimating = false;
      drawAll();
      if (onDone) onDone();
      return;
    }

    drawAll();
    requestAnimationFrame(animate);
  }

  animate();
}

