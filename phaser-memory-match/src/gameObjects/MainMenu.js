import { Button } from "./Button.js";
import { Card } from "./Card.js";
import { eventBus } from "../core/EventBus.js";

/**
 * MainMenu - Main menu interface for the game
 * Displays title, demo card, and difficulty selection buttons
 * Extends Phaser.GameObjects.Container to manage menu elements as a group
 */
export class MainMenu extends Phaser.GameObjects.Container {
  /**
   * Create a new main menu instance
   * @param {Phaser.Scene} scene - The scene to add the menu to
   * @param {Object} config - Menu configuration
   */
  constructor(scene, config) {
    super(scene, 0, -720);
    this.config = config;

    // Create menu elements
    this.createTitle();
    this.createCenterBlock();
    this.createCard();
    this.createButtons();

    scene.add.existing(this);
  }

  /**
   * Animate menu into view
   */
  animationIn() {
    this.scene.tweens.add({
      targets: this,
      y: 0,
      duration: 1000,
      ease: "Power2",
    });
  }

  /**
   * Animate menu out of view
   */
  animationOut() {
    this.scene.tweens.add({
      targets: this,
      y: -720,
      duration: 1000,
      ease: "Power2",
      onComplete: () => {
        this.config?.onComplete();
      },
    });
  }

  /**
   * Create title and subtitle text
   * @private
   */
  createTitle() {
    const { centerX, height } = this.scene.cameras.main;
    // Create title image
    const title = this.scene.add
      .image(centerX, height * 0.125, "title")
      .setOrigin(0.5, 0.5);
    // Create subtitle text
    const subTitle = this.scene.add
      .text(centerX, height * 0.225, "A Cozy Game for Sharp Minds", {
        fontFamily: "Playpen Sans Arabic",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#2e5c3f",
        resolution: window.devicePixelRatio,
      })
      .setOrigin(0.5, 0.5);
    this.add([title, subTitle]);
  }

  /**
   * Create center background block
   * @private
   */
  createCenterBlock() {
    const { centerX, centerY } = this.scene.cameras.main;
    const image = this.scene.add
      .image(centerX, centerY, "bgImage-center")
      .setOrigin(0.5, 0.5);
    this.add(image);
  }

  /**
   * Create demo card that cycles through theme cards
   * @private
   */
  createCard() {
    let frontIndex = 0;
    const currentTheme = this.scene.themeManager.getCurrentTheme();
    // Function to get next card texture in sequence
    const getNextFrontTexture = () => {
      const textures = currentTheme.cards;
      const card = textures[frontIndex % textures.length];
      const texture = `card-${card.replace(".png", "")}`;
      frontIndex++;
      return texture;
    };

    const { centerX, centerY } = this.scene.cameras.main;
    const currentFrontTexture = getNextFrontTexture();
    // Create interactive demo card
    this.card = new Card(this.scene, centerX, centerY, {
      frontTexture: currentFrontTexture,
      backTexture: "card-back",
      interactive: true,
      onClick: (card) => {
        const newFront = getNextFrontTexture();
        card.prepareNextTexture(newFront);
        card.flip(true);
      },
    });
    this.add(this.card);
  }

  /**
   * Create difficulty selection buttons
   * @private
   */
  createButtons() {
    const gap = 100;
    const k = 0.81;
    const { centerX, height } = this.scene.cameras.main;
    const y = height * k;
    // Define button configurations
    const buttonConfigs = [
      {
        text: "Easy",
        x: centerX - gap,
        width: 100,
        level: "easy",
      },
      {
        text: "Normal",
        x: centerX,
        width: 120,
        level: "normal",
      },
      {
        text: "Hard",
        x: centerX + gap,
        width: 100,
        level: "hard",
      },
    ];
    // Create buttons
    const buttons = [];
    buttonConfigs.forEach(({ x, text, width, level }, idx) => {
      buttons[idx] = new Button(this.scene, x, y, text, {
        width: width,
        height: 80,
        onClick: () => {
          eventBus.emit("mainScene:startGame", { level });
        },
      });
    });
    this.add(buttons);
  }
}
