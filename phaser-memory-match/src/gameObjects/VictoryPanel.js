import { Button } from "./Button.js";
import { eventBus } from "../core/EventBus.js";

/**
 * VictoryPanel - Displays victory screen when player completes the game
 * Shows victory image with animation and provides options to play again or return to main menu
 * Extends Phaser.GameObjects.Container to manage panel elements as a group
 */
export class VictoryPanel extends Phaser.GameObjects.Container {
  /**
   * Create a new victory panel instance
   * @param {Phaser.Scene} scene - The scene to add the panel to
   */
  constructor(scene) {
    super(scene, 0, 0);

    scene.add.existing(this);
    this._createVictoryPanel();
    this._createButtons();
  }

  /**
   * Create and animate the victory image
   * @private
   */
  _createVictoryPanel() {
    const { centerX, centerY } = this.scene.cameras.main;
    // Create victory image with bounce animation
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

  /**
   * Create action buttons for playing again or returning to main menu
   * @private
   */
  _createButtons() {
    const gap = 80;
    const k = 0.85;
    const { centerX, height } = this.scene.cameras.main;
    const y = height * k;
    // Define button configurations
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
    // Create buttons with sound effect
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
