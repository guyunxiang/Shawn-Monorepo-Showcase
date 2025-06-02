import { Card } from "../gameObjects/Card.js";
import { eventBus } from "../core/EventBus.js";

export class CardManager extends Phaser.GameObjects.Container {
  constructor(scene, config) {
    super(scene);
    this.scene = scene;
    this.config = config;

    this.cards = [];
    this.selectedCards = [];
    this.isProcessing = false;
    this.matchedCount = 0;

    eventBus.on("cardManager:createCards", this.createCards, this);
    eventBus.on("cardManager:clearCards", this.clearCards, this);
    eventBus.on("cardManager:matchSuccess", this.handleMatchSuccess, this);
    eventBus.on("cardManager:matchFailure", this.handleMatchFailure, this);

    scene.add.existing(this);
  }

  createCards({ levelConfig, themeConfig }) {
    // Clear existing cards
    this.clearCards();

    const { pairs, cols } = levelConfig;
    const cardTextures = themeConfig.cards;

    // Create card pairs with proper IDs
    const cardData = this.createCardPairs(pairs, cardTextures);

    // Calculate layout
    const layout = this.calculateLayout(pairs, cols);

    // Create card instances
    this.createCardInstances(cardData, layout);
  }

  createCardPairs(pairs, textures) {
    const cardData = [];

    // Create pairs with matching IDs
    for (let i = 0; i < pairs; i++) {
      const texture = textures[i];
      // Each pair gets the same ID
      cardData.push({ texture, id: i });
      cardData.push({ texture, id: i });
    }

    // Shuffle the array to randomize positions
    return this.shuffleCards(cardData);
  }

  calculateLayout(pairs, cols) {
    const rows = Math.ceil((pairs * 2) / cols);
    let cardWidth = 135;
    let cardHeight = 180;
    let padding = 20;

    if (rows > 2) {
      cardWidth = 120;
      cardHeight = 160;
      padding = 20;
    }

    return {
      startX:
        (this.scene.cameras.main.width - cols * (cardWidth + padding)) / 2 +
        cardWidth / 2,
      startY:
        (this.scene.cameras.main.height - rows * (cardHeight + padding)) / 2 +
        cardHeight / 2 +
        35,
      cardWidth,
      cardHeight,
      padding,
      cols,
      rows,
    };
  }

  createCardInstances(cardData, layout) {
    cardData.forEach((data, index) => {
      const col = index % layout.cols;
      const row = Math.floor(index / layout.cols);

      const x = layout.startX + col * (layout.cardWidth + layout.padding);
      const y = layout.startY + row * (layout.cardHeight + layout.padding);

      const card = new Card(this.scene, x, y, {
        width: layout.cardWidth,
        height: layout.cardHeight,
        frontTexture: `card-${data.texture.replace(".png", "")}`,
        onClick: this.onCardClick.bind(this),
        cardData: { id: data.id },
      });

      this.cards.push(card);
    });
  }

  onCardClick(card) {
    if (
      this.isProcessing ||
      card.isFlipped ||
      this.selectedCards.includes(card)
    ) {
      return;
    }

    card.showFront();
    this.selectedCards.push(card);
    if (this.selectedCards.length === 2) {
      this.isProcessing = true;
    }
    eventBus.emit("gameManager:cardSelected", {
      card,
      selectedCards: this.selectedCards,
    });
  }

  clearCards() {
    this.cards.forEach((card) => card.destroy());
    this.cards = [];
    this.selectedCards = [];
    this.isProcessing = false;
    this.matchedCount = 0;
  }

  resetCards() {
    this.cards.forEach((card) => card.showBack());
    this.selectedCards = [];
    this.isProcessing = false;
  }

  shuffleCards(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  handleMatchFailure({ card1, card2 }) {
    // Wait for a short delay before flipping cards back
    this.scene.time.delayedCall(1000, () => {
      card1.showBack();
      card2.showBack();
      this.selectedCards = [];
      this.isProcessing = false;
    });
  }

  handleMatchSuccess({ card1, card2 }) {
    // Keep cards face up and remove them from selection
    this.selectedCards = [];
    this.isProcessing = false;

    this.matchedCount += 2;
    if (this.matchedCount === this.cards.length) {
      eventBus.emit("gameManager:allMatched");
    }
  }

  destroy() {
    // Clean up event listeners
    eventBus.removeGroup("cardManager");
    // Clean up cards
    this.clearCards();
    this.scene = null;

    // Call parent destroy
    super.destroy();
  }
}
