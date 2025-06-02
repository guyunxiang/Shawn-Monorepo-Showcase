import { ThemeManager } from "../managers/ThemeManager.js";

export class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
    this.themeManager = new ThemeManager();
  }

  preload() {
    this.loadImages();
    this.loadAudio();
    this.loadFonts();
    this.loadThemeCards();
  }

  // Images
  loadImages() {
    this.load.image("logo", "assets/logo.png");
    // Start Scene BGImages
    this.load.image("bgImage-left", "assets/start-bg-left.png");
    this.load.image("bgImage-right", "assets/start-bg-right.png");
    this.load.image("title", "assets/title.png");
    this.load.image("bgImage-center", "assets/center-bg.png");
    // Game Scene BGImages
    this.load.image("leaf-left", "assets/game-bg-lb.png");
    this.load.image("leaf-right", "assets/game-bg-rb.png");

    // Buttons
    this.load.image("button_bg", "assets/bgImg_btn_N.png");
    this.load.image("button_bg_pressed", "assets/bgImg_btn_P.png");
  }

  // Audio
  loadAudio() {
    this.load.audio("bgMusic", "assets/sounds/bg-music.mp3");
    this.load.audio("flip", "assets/sounds/flip.mp3");
    this.load.audio("match", "assets/sounds/match.mp3");
    this.load.audio("victory", "assets/sounds/victory.mp3");
    this.load.audio("fail", "assets/sounds/fail.mp3");
  }

  // Theme Cards
  loadThemeCards() {
    const { cards, path } = this.themeManager.getCurrentTheme();
    this.load.image("card-back", `${path}/card-back.png`);
    cards.forEach((card) => {
      const key = `card-${card.replace(".png", "")}`;
      this.load.image(key, `${path}${card}`);
    });
  }

  // Fonts
  loadFonts() {
    WebFont.load({
      google: {
        families: ["Playpen Sans Arabic:100,800"],
      },
    });
  }

  create() {
    this.scene.start("MainScene");
    // this.scene.start("GameScene");
  }
}
