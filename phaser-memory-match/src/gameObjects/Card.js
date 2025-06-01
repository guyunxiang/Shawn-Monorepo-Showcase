export class Card extends Phaser.GameObjects.Container {
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

  // Flip card (main method)
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

  // Execute flip animation
  performFlip(toFront) {
    return new Promise((resolve) => {
      this.isFlipping = true;
      const { flipDuration, flipSound } = this.config;

      // Play flip sound
      if (flipSound && this.scene.sound) {
        this.scene.sound.play(flipSound);
      }

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

  // Delayed texture update during flip
  prepareNextTexture(frontTexture, backTexture = null) {
    this._nextFrontTexture = frontTexture;
    this._nextBackTexture = backTexture;
  }

  // Show front side
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

  // Show back side
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

  // Update front texture
  setFrontTexture(texture) {
    this.frontSide.setTexture(texture);
    this.frontSide.setDisplaySize(
      this.config.width * 0.8,
      this.config.height * 0.8
    );
    this.config.frontTexture = texture;
  }

  // Update back texture
  setBackTexture(texture) {
    this.backSide.setTexture(texture);
    this.backSide.setDisplaySize(this.config.width, this.config.height);
    this.config.backTexture = texture;
  }

  // Set card data
  setCardData(data) {
    this.cardData = data;
  }

  // Get card data
  getCardData() {
    return this.cardData;
  }

  // Enable/disable interaction
  setInteractive(enabled) {
    this.config.interactive = enabled;
    if (enabled) {
      super.setInteractive({ useHandCursor: true });
    } else {
      this.removeInteractive();
    }
  }

  // Match check (for memory game)
  matches(otherCard) {
    if (!this.cardData || !otherCard.cardData) return false;
    return this.cardData.id === otherCard.cardData.id;
  }

  // Reset card state
  reset() {
    this.showBack(false);
    this.setScale(1);
    this.isFlipping = false;
  }

  // Clean up when destroyed
  destroy() {
    // Stop all animations
    this.scene.tweens.killTweensOf(this);
    super.destroy();
  }
}
