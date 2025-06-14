import { eventBus } from "../core/EventBus.js";

/**
 * Card - A memory card component with flip animation and interactive states
 * Extends Phaser.GameObjects.Container to manage card elements as a group
 */
export class Card extends Phaser.GameObjects.Container {
  /**
   * Create a new card instance
   * @param {Phaser.Scene} scene - The scene to add the card to
   * @param {number} x - The x coordinate of the card
   * @param {number} y - The y coordinate of the card
   * @param {Object} config - Card configuration options
   * @param {number} [config.width=135] - Width of the card
   * @param {number} [config.height=180] - Height of the card
   * @param {string} [config.backTexture="card-back"] - Texture key for card back
   * @param {string} [config.frontTexture="card-front"] - Texture key for card front
   * @param {number} [config.flipDuration=300] - Duration of flip animation in ms
   * @param {string} [config.flipSound="flip"] - Sound key to play on flip
   * @param {boolean} [config.isFlipped=false] - Initial flip state
   * @param {Function} [config.onClick=()=>{}] - Callback when card is clicked
   * @param {Function} [config.onFlipComplete=()=>{}] - Callback when flip completes
   * @param {boolean} [config.interactive=true] - Whether card is interactive
   * @param {Object} [config.cardData=null] - Data associated with the card
   */
  constructor(scene, x, y, config = {}) {
    super(scene, x, y);
    this.scene = scene;

    const {
      width = 135,
      height = 180,
      backTexture = "card-back",
      frontTexture = "card-front",
      flipDuration = 300,
      flipSound = "flip",
      isFlipped = false,
      onClick = () => {},
      onFlipComplete = () => {},
      interactive = true,
      // Card data
      cardData = null,
    } = config;

    this.config = {
      width,
      height,
      backTexture,
      frontTexture,
      flipDuration,
      flipSound,
      interactive,
      onClick,
      onFlipComplete,
    };

    // Card state
    this.isFlipped = isFlipped;
    this.isFlipping = false;
    this.cardData = cardData;

    this.createCard();
    this.setupInteraction();

    scene.add.existing(this);
  }

  /**
   * Create card visual elements
   * Creates and positions the front and back sides of the card
   */
  createCard() {
    const { width, height, backTexture, frontTexture } = this.config;

    // Create back side (shown by default)
    this.backSide = this.scene.add
      .image(0, 0, backTexture)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(width, height);

    // Create front side (initially hidden)
    this.frontSide = this.scene.add
      .image(0, 0, frontTexture)
      .setOrigin(0.5, 0.5)
      .setDisplaySize(width * 0.8, height * 0.8)
      .setVisible(false);

    // Add to container
    this.add([this.backSide, this.frontSide]);
    this.setSize(width, height);

    // If initial state is flipped, show front side
    if (this.isFlipped) {
      this.showFront(false);
    }
  }

  /**
   * Set up card interaction events
   * Handles click and hover effects
   */
  setupInteraction() {
    if (!this.config.interactive) return;

    this.setInteractive({ useHandCursor: true });

    this.on("pointerdown", () => {
      if (!this.isFlipping) {
        this.config.onClick(this);
      }
    });

    // Hover effect
    this.on("pointerover", () => {
      if (!this.isFlipping) {
        this.scene.tweens.add({
          targets: this,
          scaleX: 1.05,
          scaleY: 1.05,
          duration: 100,
          ease: "Power1",
        });
      }
    });

    this.on("pointerout", () => {
      if (!this.isFlipping) {
        this.scene.tweens.add({
          targets: this,
          scaleX: 1,
          scaleY: 1,
          duration: 100,
          ease: "Power1",
        });
      }
    });
  }

  /**
   * Flip the card to a specific state
   * @param {boolean} [toFront=null] - Target flip state (null to toggle)
   * @returns {Promise} Resolves when flip animation completes
   */
  flip(toFront = null) {
    if (this.isFlipping) return Promise.resolve();

    // Force flip if texture update is pending
    const hasPendingTexture = this._nextFrontTexture || this._nextBackTexture;

    const targetState = toFront !== null ? toFront : !this.isFlipped;

    // Only skip if no pending texture and already in target state
    if (!hasPendingTexture && this.isFlipped === targetState) {
      return Promise.resolve();
    }

    return this.performFlip(targetState);
  }

  /**
   * Execute the flip animation
   * @param {boolean} toFront - Whether to flip to front or back
   * @returns {Promise} Resolves when animation completes
   */
  performFlip(toFront) {
    return new Promise((resolve) => {
      this.isFlipping = true;
      const { flipDuration } = this.config;

      // Play flip sound
      eventBus.emit("sound:play", "flip");

      // First phase: compress to 0
      this.scene.tweens.add({
        targets: this,
        scaleX: 0,
        duration: flipDuration / 2,
        ease: "Power2.easeIn",
        onComplete: () => {
          // Texture switch (after scaleX = 0)
          if (this._nextFrontTexture) {
            this.setFrontTexture(this._nextFrontTexture);
            this._nextFrontTexture = null;
          }
          if (this._nextBackTexture) {
            this.setBackTexture(this._nextBackTexture);
            this._nextBackTexture = null;
          }

          if (toFront) {
            this.showFront(false);
          } else {
            this.showBack(false);
          }

          // Restore animation
          this.scene.tweens.add({
            targets: this,
            scaleX: 1,
            duration: flipDuration / 2,
            ease: "Power2.easeOut",
            onComplete: () => {
              this.isFlipped = toFront;
              this.isFlipping = false;
              this.config.onFlipComplete(this, toFront);
              resolve();
            },
          });
        },
      });
    });
  }

  /**
   * Prepare textures for next flip
   * @param {string} frontTexture - New front texture key
   * @param {string} [backTexture=null] - New back texture key
   */
  prepareNextTexture(frontTexture, backTexture = null) {
    this._nextFrontTexture = frontTexture;
    this._nextBackTexture = backTexture;
  }

  /**
   * Show the front side of the card
   * @param {boolean} [animated=true] - Whether to animate the flip
   * @returns {Promise} Resolves when flip completes
   */
  showFront(animated = true) {
    if (animated) {
      return this.flip(true);
    } else {
      this.backSide.setVisible(false);
      this.frontSide.setVisible(true);
      this.isFlipped = true;
      return Promise.resolve();
    }
  }

  /**
   * Show the back side of the card
   * @param {boolean} [animated=true] - Whether to animate the flip
   * @returns {Promise} Resolves when flip completes
   */
  showBack(animated = true) {
    if (animated) {
      return this.flip(false);
    } else {
      this.backSide.setVisible(true);
      this.frontSide.setVisible(false);
      this.isFlipped = false;
      return Promise.resolve();
    }
  }

  /**
   * Update the front texture of the card
   * @param {string} texture - New texture key
   */
  setFrontTexture(texture) {
    this.frontSide.setTexture(texture);
    this.frontSide.setDisplaySize(
      this.config.width * 0.8,
      this.config.height * 0.8
    );
    this.config.frontTexture = texture;
  }

  /**
   * Update the back texture of the card
   * @param {string} texture - New texture key
   */
  setBackTexture(texture) {
    this.backSide.setTexture(texture);
    this.backSide.setDisplaySize(this.config.width, this.config.height);
    this.config.backTexture = texture;
  }

  /**
   * Set the card's associated data
   * @param {Object} data - Data to associate with the card
   */
  setCardData(data) {
    this.cardData = data;
  }

  /**
   * Get the card's associated data
   * @returns {Object} The card's data
   */
  getCardData() {
    return this.cardData;
  }

  /**
   * Enable or disable card interaction
   * @param {boolean} enabled - Whether the card should be interactive
   */
  setInteractive(enabled) {
    this.config.interactive = enabled;
    if (enabled) {
      super.setInteractive({ useHandCursor: true });
    } else {
      this.removeInteractive();
    }
  }

  /**
   * Check if this card matches another card
   * @param {Card} otherCard - The card to compare with
   * @returns {boolean} True if cards match
   */
  matches(otherCard) {
    if (!this.cardData || !otherCard.cardData) return false;
    return this.cardData.id === otherCard.cardData.id;
  }

  /**
   * Reset the card to its initial state
   */
  reset() {
    this.showBack(false);
    this.setScale(1);
    this.isFlipping = false;
  }

  /**
   * Clean up card resources
   */
  destroy() {
    eventBus.removeGroup("card");
    // Stop all animations
    this.scene.tweens.killTweensOf(this);
    super.destroy();
  }
}
