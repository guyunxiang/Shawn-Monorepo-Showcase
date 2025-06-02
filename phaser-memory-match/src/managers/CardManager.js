import { Card } from "../gameObjects/Card.js";
import { eventBus } from "../core/EventBus.js";

/**
 * CardManager - Manages the memory card game cards
 * Handles card creation, layout, matching logic, and card interactions
 * Extends Phaser.GameObjects.Container to manage multiple cards as a group
 */
export class CardManager extends Phaser.GameObjects.Container {
  /**
   * Initialize the card manager
   * @param {Phaser.Scene} scene - The scene instance to manage cards in
   * @param {Object} config - Configuration object containing theme manager
   */
  constructor(scene, config) {
    super(scene);
    this.scene = scene;
    this.config = config;

    // Initialize card tracking arrays and state
    this.cards = [];
    this.selectedCards = [];
    this.isProcessing = false;
    this.matchedCount = 0;

    // Set up event listeners for card management
    eventBus.on("cardManager:createCards", this.createCards, this);
    eventBus.on("cardManager:clearCards", this.clearCards, this);
    eventBus.on("cardManager:matchSuccess", this.handleMatchSuccess, this);
    eventBus.on("cardManager:matchFailure", this.handleMatchFailure, this);

    scene.add.existing(this);
  }

  /**
   * Create a new set of cards based on level and theme configuration
   * @param {Object} param0 - Configuration parameters
   * @param {Object} param0.levelConfig - Level configuration containing pairs and columns
   * @param {Object} param0.themeConfig - Theme configuration containing card textures
   */
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

  /**
   * Create pairs of cards with matching IDs
   * @param {number} pairs - Number of card pairs to create
   * @param {Array} textures - Array of card texture names
   * @returns {Array} Shuffled array of card data objects
   */
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

  /**
   * Calculate the layout parameters for card positioning
   * @param {number} pairs - Number of card pairs
   * @param {number} cols - Number of columns in the layout
   * @returns {Object} Layout configuration object
   */
  calculateLayout(pairs, cols) {
    const rows = Math.ceil((pairs * 2) / cols);
    let cardWidth = 135;
    let cardHeight = 180;
    let padding = 20;

    // Adjust card size for larger layouts
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

  /**
   * Create and position card instances based on layout
   * @param {Array} cardData - Array of card data objects
   * @param {Object} layout - Layout configuration object
   */
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

  /**
   * Handle card click events
   * @param {Card} card - The clicked card instance
   */
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

  /**
   * Clear all cards and reset state
   */
  clearCards() {
    this.cards.forEach((card) => card.destroy());
    this.cards = [];
    this.selectedCards = [];
    this.isProcessing = false;
    this.matchedCount = 0;
  }

  /**
   * Reset all cards to face-down position
   */
  resetCards() {
    this.cards.forEach((card) => card.showBack());
    this.selectedCards = [];
    this.isProcessing = false;
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleCards(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  /**
   * Handle unsuccessful card match
   * @param {Object} param0 - Match parameters
   * @param {Card} param0.card1 - First card in the match
   * @param {Card} param0.card2 - Second card in the match
   */
  handleMatchFailure({ card1, card2 }) {
    // Wait for a short delay before flipping cards back
    this.scene.time.delayedCall(1000, () => {
      card1.showBack();
      card2.showBack();
      this.selectedCards = [];
      this.isProcessing = false;
    });
  }

  /**
   * Handle successful card match
   * @param {Object} param0 - Match parameters
   * @param {Card} param0.card1 - First card in the match
   * @param {Card} param0.card2 - Second card in the match
   */
  handleMatchSuccess({ card1, card2 }) {
    // Keep cards face up and remove them from selection
    this.selectedCards = [];
    this.isProcessing = false;

    this.matchedCount += 2;
    if (this.matchedCount === this.cards.length) {
      eventBus.emit("gameManager:allMatched");
    }
  }

  /**
   * Clean up card manager resources
   * Removes event listeners and destroys all cards
   */
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
