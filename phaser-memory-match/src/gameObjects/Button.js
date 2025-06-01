export class Button extends Phaser.GameObjects.Container {
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

    this.bg = scene.add
      .nineslice(0, 0, texture, 0, width, height, 10, 10, 10, 10)
      .setOrigin(0.5, 0.5);

    this.textObj = scene.add
      .text(0, -2, text, {
        fontFamily: "Playpen Sans Arabic",
        fontSize: `${fontSize}px`,
        fontStyle: "bold",
        color: "#6e3d2d",
        resolution: window.devicePixelRatio,
      })
      .setOrigin(0.5, 0.5);

    this.add([this.bg, this.textObj]);
    this.setSize(width, height);
    this.setInteractive({ useHandCursor: true });

    this.on("pointerdown", () => this.bg.setTexture(texturePressed));
    this.on("pointerup", () => {
      this.bg.setTexture(texture);
      onClick();
    });
    this.on("pointerout", () => this.bg.setTexture(texture));

    scene.add.existing(this);
  }
}
