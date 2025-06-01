import { ThemeManager } from "../managers/ThemeManager.js";
import { GameHUD } from "../gameObjects/GameHUD.js";
import { CardManager } from "../managers/CardManager.js";
import { GameManager } from '../managers/GameManager.js';
import { VictoryPanel } from "../gameObjects/VictoryPanel.js";
import { cards } from '../config/cards.js';
export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.themeManager = new ThemeManager();
    this.level = "easy";
    this.bgImgLeft = null;
    this.bgImgRight = null;
  }

  init(data) {
    this.level = data.level || "easy";
  }

  preload() {
    this.loadThemeCards();
    this.load.image("victory", "assets/img_win.png");
    this.load.audio("victory", "assets/sounds/victory.mp3");
  }

  create() {
    // initial hud
    this.hud = new GameHUD(this, {
      level: this.level,
      onBack: this.animationOut.bind(this),
    });

    // Initialize managers
    this.cardManager = new CardManager(this, {
      themeManager: this.themeManager,
    });

    this.gameManager = new GameManager(this);

    this.createGameCards();
    this.createBgImage();
    this.animationIn();
  }

  animationIn() {
    const { width } = this.cameras.main;
    this.tweens.add({
      targets: this.bgImgLeft,
      x: 0,
      duration: 1000,
      ease: "Power2",
    });
    this.tweens.add({
      targets: this.bgImgRight,
      x: width,
      duration: 1000,
      ease: "Power2",
    });
    this.hud.animationIn();
  }

  animationOut() {
    const { width } = this.cameras.main;
    this.tweens.add({
      targets: this.bgImgLeft,
      x: -this.bgImgLeft.width,
      duration: 1000,
      ease: "Power2",
    });
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

  // Theme Cards
  loadThemeCards() {
    const currentTheme = this.themeManager.getCurrentTheme();
    currentTheme.cards.forEach((card) => {
      const key = `card-${card.replace(".png", "")}`;
      this.load.image(key, `${currentTheme.path}${card}`);
    });
  }

  // Background Image
  createBgImage() {
    const { width, height } = this.cameras.main;
    this.bgImgLeft = this.add.image(0, height, "leaf-left").setOrigin(0, 1);
    this.bgImgRight = this.add
      .image(width, height, "leaf-right")
      .setOrigin(1, 1);
    this.bgImgLeft.setPosition(0 - this.bgImgLeft.width, height);
    this.bgImgRight.setPosition(width + this.bgImgRight.width, height);
  }

  createGameCards() {
    const levelConfig = cards[this.level];
    const themeConfig = this.themeManager.getCurrentTheme();
    this.cardManager.createCards(levelConfig, themeConfig);
  }

  createVictory() {
    this.victoryPanel = new VictoryPanel(this);
  }
}
