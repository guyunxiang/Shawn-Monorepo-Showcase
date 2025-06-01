import { Preloader } from "./scenes/Preloader.js";
import { MainScene } from "./scenes/MainScene.js";
import { GameScene } from "./scenes/GameScene.js";

const config = {
  type: Phaser.AUTO,
  title: "Overlord Rising",
  description: "",
  parent: "game-container",
  width: 1280,
  height: 720,
  backgroundColor: "#fbe2c2",
  pixelArt: false,
  scene: [Preloader, MainScene, GameScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  }
};

new Phaser.Game(config);
