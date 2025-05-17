import type { Difficulty } from "../types/types";

import Card from "../components/Card";
import GameManager from "./GameManager";
import { animateCardFlip } from "../utils/animations";

class CardManager {
  private _difficulty: Difficulty;
  private _gameManager: GameManager;
  private _cards: Card[] = [];
  private _flippedCards: Card[] = [];
  private static _backImage: HTMLImageElement;

  constructor(_gameManager: GameManager, difficulty: Difficulty) {
    this._gameManager = _gameManager;
    this._difficulty = difficulty;
  }

  loadAssets(onLoaded: () => void): void {
    const img = new Image();
    img.src = '/assets/card-back.png';
    img.onload = () => {
      CardManager._backImage = img;
      onLoaded();
    };
  }

  private getGridSize(): { rows: number; cols: number } {
    switch (this._difficulty) {
      case 'easy':
        return { rows: 2, cols: 4 };  // 8 cards
      case 'hard':
        return { rows: 4, cols: 5 };  // 20 cards
      default:
        return { rows: 3, cols: 4 };  // 12 cards
    }
  }

  private layoutCards(): void {
    const canvas = this._gameManager.getCanvas();
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    const { rows, cols } = this.getGridSize();
    const paddingTop = 80;

    const availableWidth = canvasWidth;
    const availableHeight = canvasHeight - paddingTop;

    const cardHeight = availableHeight / (rows + 1);
    const cardWidth = (cardHeight * 3) / 4;

    const totalCardWidth = cols * cardWidth + (cols + 1) * (cardWidth / 2);

    let finalCardWidth = cardWidth;
    let finalCardHeight = cardHeight;

    if (totalCardWidth > availableWidth) {
      finalCardWidth = availableWidth / (cols + 1);
      finalCardHeight = (finalCardWidth * 4) / 3;
    }

    const paddingX = (availableWidth - cols * finalCardWidth) / (cols + 1);
    const paddingY = (availableHeight - rows * finalCardHeight) / (rows + 1);

    for (let i = 0; i < this._cards.length; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = paddingX + col * (finalCardWidth + paddingX);
      const y = paddingTop + paddingY + row * (finalCardHeight + paddingY);

      const card = this._cards[i];
      card.setPosition(x, y);
      card.setSize(finalCardWidth, finalCardHeight);
    }
  }

  generateCards(): void {
    const { rows, cols } = this.getGridSize();
    const totalCards = rows * cols;
    const numPairs = totalCards / 2;

    const EMOJIS = ['😄', '😢', '😠', '😱', '😯', '😌', '😇', '🤓', '🤑', '🤠', '👻', '💀', '👽', '🤖', '🎃'];
    const selected = EMOJIS.slice(0, numPairs);
    const pairs = this.shuffleArray([...selected, ...selected]); // double for pairing

    this._cards = [];
    this._flippedCards = [];

    for (let i = 0; i < pairs.length; i++) {
      // placeholder positions and sizes, will be set in layoutCards()
      const card = new Card(
        0, 0, 0, 0,
        pairs[i],
        this._gameManager.getRenderer(),
        CardManager._backImage
      );
      this._cards.push(card);
    }

    this.layoutCards(); // layout after cards created
  }


  public resizeAndLayout(): void {
    this.layoutCards();              // just recalculate positions & sizes
  }


  drawCards(): void {
    this._cards.forEach(card => card.draw());
  }

  handleCardClick(x: number, y: number): void {
    const soundManager = this._gameManager.getSoundManager();

    if (this._flippedCards.length >= 2) return; // block if already 2 flipped

    for (let card of this._cards) {
      if (
        x >= card.getX() &&
        x <= card.getX() + card.getWidth() &&
        y >= card.getY() &&
        y <= card.getY() + card.getHeight() &&
        !card.isFlipped()
      ) {
        soundManager.playFlip();

        animateCardFlip(
          card,
          () => {
            card.setFlipped(true);
            this._flippedCards.push(card);
            if (this._flippedCards.length === 2) {
              this.checkMatch();
            }
          },
          undefined,
          () => this._gameManager.draw()
        );

        break;
      }
    }
  }

  checkMatch(): void {
    const [card1, card2] = this._flippedCards;
    const soundManager = this._gameManager.getSoundManager();

    this._gameManager.incrementSteps();

    if (card1.getLabel() === card2.getLabel()) {
      soundManager.playMatch();
      this._flippedCards = [];
      this._gameManager.draw();
      this._gameManager.checkGameOver();
    } else {
      soundManager.playFail();
      // disable interaction during animation
      setTimeout(() => {
        animateCardFlip(
          card1,
          () => card1.setFlipped(false),
          undefined,
          () => this._gameManager.draw()
        );

        animateCardFlip(
          card2,
          () => card2.setFlipped(false),
          () => {
            this._flippedCards = [];
            this._gameManager.draw();
          },
          () => this._gameManager.draw()
        );
      }, 1000);
    }
  }

  allCardsMatched(): boolean {
    return this._cards.every(card => card.isFlipped());
  }

  getCards(): Card[] {
    return this._cards;
  }

  // helper function: Fisher-Yates shuffle
  private shuffleArray<T>(arr: T[]): T[] {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export default CardManager;