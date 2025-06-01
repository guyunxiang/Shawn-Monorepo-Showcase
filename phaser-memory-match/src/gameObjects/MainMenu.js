import { Button } from "./Button.js";
import { Card } from "./Card.js";

export class MainMenu extends Phaser.GameObjects.Container {
  constructor(scene, config) {
    super(scene, 0, -720);
    this.config = config;

    this.createTitle();
    this.createCenterBlock();
    this.createCard();
    this.createButtons();

    scene.add.existing(this);
  }

  animationIn() {
    this.scene.tweens.add({
      targets: this,
      y: 0,
      duration: 1000,
      ease: "Power2",
    });
  }

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

  // Title and Subtitle
  createTitle() {
    const { centerX, height } = this.scene.cameras.main;
    const title = this.scene.add
      .image(centerX, height * 0.125, "title")
      .setOrigin(0.5, 0.5);
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

  // Center Block
  createCenterBlock() {
    const { centerX, centerY } = this.scene.cameras.main;
    const image = this.scene.add
      .image(centerX, centerY, "bgImage-center")
      .setOrigin(0.5, 0.5);
    this.add(image);
  }

  createCard() {
    let frontIndex = 0;
    const currentTheme = this.scene.themeManager.getCurrentTheme();
    const getNextFrontTexture = () => {
      const textures = currentTheme.cards;
      const card = textures[frontIndex % textures.length];
      const texture = `card-${card.replace(".png", "")}`;
      frontIndex++;
      return texture;
    };
    const { centerX, centerY } = this.scene.cameras.main;
    const currentFrontTexture = getNextFrontTexture();
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

  createButtons() {
    const gap = 100;
    const k = 0.81;
    const { centerX, height } = this.scene.cameras.main;
    const y = height * k;
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
    const buttons = [];
    buttonConfigs.forEach(({ x, text, width, level }, idx) => {
      buttons[idx] = new Button(this.scene, x, y, text, {
        width: width,
        height: 80,
        onClick: () => {
          this.scene.level = level;
          this.scene.sound.play("flip");
          this.scene.animationOut();
        },
      });
    });
    this.add(buttons);
  }
}
