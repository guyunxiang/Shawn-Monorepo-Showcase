import { Button } from "./Button.js";
import { eventBus } from "../core/EventBus.js";

export class VictoryPanel extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0);

    scene.add.existing(this);
    this._createVictoryPanel();
    this._createButtons();
  }

  _createVictoryPanel() {
    const { centerX, centerY } = this.scene.cameras.main;
    this.victoryImage = this.scene.add
      .image(centerX, -200, "victory")
      .setOrigin(0.5, 0.5)
      .setScale(0.8);
    this.scene.tweens.add({
      targets: this.victoryImage,
      y: centerY,
      duration: 800,
      ease: "Bounce.easeOut",
      delay: 200,
    });
    this.add(this.victoryImage);
  }

  _createButtons() {
    const gap = 80;
    const k = 0.85;
    const { centerX, height } = this.scene.cameras.main;
    const y = height * k;
    const buttonConfigs = [
      {
        text: "Play Again",
        x: centerX - gap,
        width: 160,
        onClick: () => {
          eventBus.emit("gameManager:playAgain");
        }
      },
      {
        text: "Main Menu",
        x: centerX + gap,
        width: 160,
        onClick: () => {
          eventBus.emit("gameScene:exitGame");
        }
      },
    ];
    const buttons = [];
    buttonConfigs.forEach(({ x, text, width, onClick }, idx) => {
      buttons[idx] = new Button(this.scene, x, y, text, {
        width: width,
        height: 80,
        onClick: () => {
          this.scene.sound.play("flip");
          onClick();
          this.destroy();
        },
      });
    });
    this.add(buttons);
  }
}
