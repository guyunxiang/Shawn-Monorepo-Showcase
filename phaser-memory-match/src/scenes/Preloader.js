import { ThemeManager } from "../managers/ThemeManager.js";

/**
 * Preloader Scene - Handles loading of all game assets before starting the game
 * This scene is responsible for loading images, audio, fonts, and theme cards
 */
export class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
    this.themeManager = new ThemeManager();
  }

  /**
   * Main preload function that coordinates loading of all assets
   */
  preload() {
    this.loadImages();
    this.loadAudio();
    this.loadFonts();
    this.loadThemeCards();
  }

  /**
   * Loads all game images including backgrounds, UI elements, and buttons
   */
  loadImages() {
    // Load logo and UI elements
    this.load.image("logo", "assets/logo.png");
    
    // Load background images for Start Scene
    this.load.image("bgImage-left", "assets/start-bg-left.png");
    this.load.image("bgImage-right", "assets/start-bg-right.png");
    this.load.image("title", "assets/title.png");
    this.load.image("bgImage-center", "assets/center-bg.png");
    
    // Load background images for Game Scene
    this.load.image("leaf-left", "assets/game-bg-lb.png");
    this.load.image("leaf-right", "assets/game-bg-rb.png");

    // Load button states
    this.load.image("button_bg", "assets/bgImg_btn_N.png");
    this.load.image("button_bg_pressed", "assets/bgImg_btn_P.png");
  }

  /**
   * Loads all game audio files including background music and sound effects
   */
  loadAudio() {
    this.load.audio("bgMusic", "assets/sounds/bg-music.mp3");
    this.load.audio("flip", "assets/sounds/flip.mp3");
    this.load.audio("match", "assets/sounds/match.mp3");
    this.load.audio("victory", "assets/sounds/victory.mp3");
    this.load.audio("fail", "assets/sounds/fail.mp3");
  }

  /**
   * Loads theme-specific card images based on the current theme
   */
  loadThemeCards() {
    const { cards, path } = this.themeManager.getCurrentTheme();
    this.load.image("card-back", `${path}/card-back.png`);
    cards.forEach((card) => {
      const key = `card-${card.replace(".png", "")}`;
      this.load.image(key, `${path}${card}`);
    });
  }

  /**
   * Loads custom fonts using WebFont loader
   */
  loadFonts() {
    WebFont.load({
      google: {
        families: ["Playpen Sans Arabic:100,800"],
      },
    });
  }

  /**
   * Called when all assets are loaded
   * Transitions to the Main Scene
   */
  create() {
    this.scene.start("MainScene");
    // this.scene.start("GameScene");
  }
}
