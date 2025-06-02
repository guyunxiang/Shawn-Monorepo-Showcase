import { eventBus } from "../core/EventBus.js";

/**
 * Button - A reusable button component with text and interactive states
 * Extends Phaser.GameObjects.Container to manage button elements as a group
 */
export class Button extends Phaser.GameObjects.Container {
  /**
   * Create a new button instance
   * @param {Phaser.Scene} scene - The scene to add the button to
   * @param {number} x - The x coordinate of the button
   * @param {number} y - The y coordinate of the button
   * @param {string} text - The text to display on the button
   * @param {Object} config - Button configuration options
   * @param {number} [config.width=250] - Width of the button
   * @param {number} [config.height=100] - Height of the button
   * @param {string} [config.texture="button_bg"] - Texture key for normal state
   * @param {string} [config.texturePressed="button_bg_pressed"] - Texture key for pressed state
   * @param {number} [config.fontSize=16] - Font size of the button text
   * @param {Function} [config.onClick=()=>{}] - Callback function when button is clicked
   */
  constructor(scene, x, y, text, config = {}) {
    super(scene, x, y);
    this.scene = scene;
    this.text = text;
    const {
      width = 250,
      height = 100,
      texture = "button_bg",
      texturePressed = "button_bg_pressed",
      fontSize = 16,
      onClick = () => {},
    } = config;

    // Create button background using nine-slice scaling
    this.bg = scene.add
      .nineslice(0, 0, texture, 0, width, height, 10, 10, 10, 10)
      .setOrigin(0.5, 0.5);

    // Create button text with custom font settings
    this.textObj = scene.add
      .text(0, -2, text, {
        fontFamily: "Playpen Sans Arabic",
        fontSize: `${fontSize}px`,
        fontStyle: "bold",
        color: "#6e3d2d",
        resolution: window.devicePixelRatio,
      })
      .setOrigin(0.5, 0.5);

    // Add elements to container and set up interactivity
    this.add([this.bg, this.textObj]);
    this.setSize(width, height);
    this.setInteractive({ useHandCursor: true });

    // Set up button interaction events
    this.on("pointerdown", () => this.bg.setTexture(texturePressed));
    this.on("pointerup", () => {
      this.bg.setTexture(texture);
      eventBus.emit("sound:play", "flip");
      onClick();
    });
    this.on("pointerout", () => this.bg.setTexture(texture));

    scene.add.existing(this);
  }

  /**
   * Clean up button resources
   * Removes event listeners and destroys the button
   */
  destroy() {
    eventBus.removeGroup("button");
    super.destroy();
  }
}
