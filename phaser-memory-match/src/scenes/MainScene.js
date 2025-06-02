import { ThemeManager } from "../managers/ThemeManager.js";
import { MainMenu } from "../gameObjects/MainMenu.js";
import { eventBus } from "../core/EventBus.js";
import { SoundManager } from "../managers/SoundManager.js";

export class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.themeManager = new ThemeManager();
    this.bgm = null;

    eventBus.on("mainScene:startGame", this.startGame, this);
  }

  create() {
    this.createBgImage();
    this.createBgMusic();

    this.soundManager = new SoundManager(this);
    this.mainmenu = new MainMenu(this);
    this.animationIn();
  }

  startGame({ level }) {
    this.level = level;
    this.animationOut();
  }

  // Background Music
  createBgMusic() {
    if (!this.bgm) {
      this.bgm = this.sound.add("bgMusic", {
        volume: 0.5,
        loop: true,
      });
      this.bgm.play();
    }
  }

  animationIn() {
    this.tweens.add({
      targets: this.bgImgLeft,
      x: 0,
      duration: 1000,
      ease: "Power2",
    });

    this.tweens.add({
      targets: this.bgImgRight,
      x: this.cameras.main.width,
      duration: 1000,
      ease: "Power2",
    });
    this.mainmenu.animationIn();
  }

  animationOut() {
    this.mainmenu.animationOut();
    this.tweens.add({
      targets: this.bgImgLeft,
      x: -this.bgImgLeft.width,
      duration: 600,
      ease: "Power2",
    });
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

  // Background Image
  createBgImage() {
    this.bgImgLeft = this.add
      .image(0, this.cameras.main.centerY, "bgImage-left")
      .setOrigin(0, 0.5);
    this.bgImgRight = this.add
      .image(
        this.cameras.main.width,
        this.cameras.main.centerY,
        "bgImage-right"
      )
      .setOrigin(1, 0.5);
    this.bgImgLeft.setPosition(
      0 - this.bgImgLeft.width,
      this.cameras.main.centerY
    );
    this.bgImgRight.setPosition(
      this.cameras.main.width + this.bgImgRight.width,
      this.cameras.main.centerY
    );
  }

  update() {}
}
