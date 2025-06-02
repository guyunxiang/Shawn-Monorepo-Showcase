import { ThemeManager } from "../managers/ThemeManager.js";
import { GameHUD } from "../gameObjects/GameHUD.js";
import { CardManager } from "../managers/CardManager.js";
import { GameManager } from "../managers/GameManager.js";
import { VictoryPanel } from "../gameObjects/VictoryPanel.js";
import { cards } from "../config/cards.js";
import { eventBus } from "../core/EventBus.js";

/**
 * Game Scene - The main gameplay scene
 * Handles the memory card game mechanics, UI, and game state
 */
export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.themeManager = new ThemeManager();
    this.level = "easy";
    this.bgImgLeft = null;
    this.bgImgRight = null;

    // Set up event listeners for game events
    eventBus.on("gameScene:createCards", this.createGameCards, this);
    eventBus.on("gameScene:createVictory", this.createVictory, this);
    eventBus.on("gameScene:exitGame", this.exitGame, this);
  }

  /**
   * Initialize the scene with game level data
   * @param {Object} data - Scene initialization data
   * @param {string} data.level - The difficulty level of the game
   */
  init(data) {
    this.level = data.level || "easy";
  }

  /**
   * Load game assets before scene creation
   */
  preload() {
    this.loadThemeCards();
    this.load.image("victory", "assets/img_win.png");
  }

  /**
   * Create the game scene and initialize all game components
   */
  create() {
    // Initialize game HUD (Heads-Up Display)
    this.hud = new GameHUD(this, {
      level: this.level,
    });

    // Initialize game managers
    this.cardManager = new CardManager(this, {
      themeManager: this.themeManager,
    });

    this.gameManager = new GameManager(this);

    this.createGameCards();
    this.createBgImage();
    this.animationIn();
  }

  /**
   * Animate game elements into view
   */
  animationIn() {
    const { width } = this.cameras.main;
    // Animate left background image
    this.tweens.add({
      targets: this.bgImgLeft,
      x: 0,
      duration: 1000,
      ease: "Power2",
    });
    // Animate right background image
    this.tweens.add({
      targets: this.bgImgRight,
      x: width,
      duration: 1000,
      ease: "Power2",
    });
    this.hud.animationIn();
  }

  /**
   * Animate game elements out of view and clean up
   */
  animationOut() {
    const { width } = this.cameras.main;
    // Animate left background image out
    this.tweens.add({
      targets: this.bgImgLeft,
      x: -this.bgImgLeft.width,
      duration: 1000,
      ease: "Power2",
    });
    // Animate right background image out
    this.tweens.add({
      targets: this.bgImgRight,
      x: width + this.bgImgRight.width,
      duration: 1000,
      ease: "Power2",
    });
    this.cardManager.destroy();
    this.gameManager.destroy();
    this.hud.animateOut(() => {
      this.scene.start("MainScene");
    });
  }

  /**
   * Handle game exit event
   */
  exitGame() {
    this.animationOut();
  }

  /**
   * Load theme-specific card images
   */
  loadThemeCards() {
    const currentTheme = this.themeManager.getCurrentTheme();
    currentTheme.cards.forEach((card) => {
      const key = `card-${card.replace(".png", "")}`;
      this.load.image(key, `${currentTheme.path}${card}`);
    });
  }

  /**
   * Create and position background images
   */
  createBgImage() {
    const { width, height } = this.cameras.main;
    // Create and position left background image
    this.bgImgLeft = this.add.image(0, height, "leaf-left").setOrigin(0, 1);
    // Create and position right background image
    this.bgImgRight = this.add
      .image(width, height, "leaf-right")
      .setOrigin(1, 1);
    // Set initial positions off-screen
    this.bgImgLeft.setPosition(0 - this.bgImgLeft.width, height);
    this.bgImgRight.setPosition(width + this.bgImgRight.width, height);
  }

  /**
   * Create game cards based on current level and theme
   */
  createGameCards() {
    const levelConfig = cards[this.level];
    const themeConfig = this.themeManager.getCurrentTheme();
    eventBus.emit("cardManager:createCards", { levelConfig, themeConfig });
  }

  /**
   * Create victory panel when game is won
   */
  createVictory() {
    this.victoryPanel = new VictoryPanel(this);
  }

  /**
   * Cleanup method called when scene is destroyed
   * Removes event listeners and destroys managers
   */
  destroy() {
    eventBus.removeGroup("gameScene");
    
    if (this.cardManager) {
      this.cardManager.destroy();
    }
    if (this.gameManager) {
      this.gameManager.destroy();
    }
    if (this.hud) {
      this.hud.destroy();
    }

    super.destroy();
  }
}
