import { ThemeManager } from "../managers/ThemeManager.js";
import { MainMenu } from "../gameObjects/MainMenu.js";
import { eventBus } from "../core/EventBus.js";
import { SoundManager } from "../managers/SoundManager.js";

/**
 * Main Scene - The main menu scene of the game
 * Handles the main menu UI, background animations, and scene transitions
 */
export class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.themeManager = new ThemeManager();
    this.bgm = null;
    this.soundManager = null;
    this.mainmenu = null;

    // Listen for game start event
    eventBus.on("mainScene:startGame", this.startGame, this);
  }

  /**
   * Creates the main menu scene with background and UI elements
   */
  create() {
    this.createBgImage();

    // Initialize sound manager if not already created
    if (!this.soundManager) {
      this.soundManager = new SoundManager(this);
      eventBus.emit("sound:playBGM");
    }
    this.mainmenu = new MainMenu(this);
    this.animationIn();
  }

  /**
   * Handles the start game event
   * @param {Object} param0 - Event parameters
   * @param {number} param0.level - The selected difficulty level
   */
  startGame({ level }) {
    this.level = level;
    this.animationOut();
  }

  /**
   * Animates the background images and menu elements into view
   */
  animationIn() {
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
      x: this.cameras.main.width,
      duration: 1000,
      ease: "Power2",
    });
    this.mainmenu.animationIn();
  }

  /**
   * Animates the background images and menu elements out of view
   * Transitions to the game scene when complete
   */
  animationOut() {
    this.mainmenu.animationOut();
    // Animate left background image out
    this.tweens.add({
      targets: this.bgImgLeft,
      x: -this.bgImgLeft.width,
      duration: 600,
      ease: "Power2",
    });
    // Animate right background image out
    this.tweens.add({
      targets: this.bgImgRight,
      x: this.cameras.main.width + this.bgImgRight.width,
      duration: 600,
      ease: "Power2",
      onComplete: () => {
        this.scene.start("GameScene", {
          level: this.level,
        });
      },
    });
  }

  /**
   * Creates and positions the background images
   */
  createBgImage() {
    // Create and position left background image
    this.bgImgLeft = this.add
      .image(0, this.cameras.main.centerY, "bgImage-left")
      .setOrigin(0, 0.5);
    // Create and position right background image
    this.bgImgRight = this.add
      .image(
        this.cameras.main.width,
        this.cameras.main.centerY,
        "bgImage-right"
      )
      .setOrigin(1, 0.5);
    // Set initial positions off-screen
    this.bgImgLeft.setPosition(
      0 - this.bgImgLeft.width,
      this.cameras.main.centerY
    );
    this.bgImgRight.setPosition(
      this.cameras.main.width + this.bgImgRight.width,
      this.cameras.main.centerY
    );
  }

  /**
   * Cleanup method called when scene is destroyed
   * Removes event listeners and destroys managers
   */
  destroy() {
    eventBus.removeGroup("mainScene");
    if (this.soundManager) {
      this.soundManager.destroy();
      this.soundManager = null;
    }
    if (this.mainmenu) {
      this.mainmenu.destroy();
      this.mainmenu = null;
    }
    super.destroy();
  }
}
