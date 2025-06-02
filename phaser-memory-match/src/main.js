// Import required game scenes
import { Preloader } from "./scenes/Preloader.js";
import { MainScene } from "./scenes/MainScene.js";
import { GameScene } from "./scenes/GameScene.js";

// Main game configuration object
const config = {
  type: Phaser.AUTO,  // Automatically choose the best renderer (WebGL or Canvas)
  title: "Memory Match Game",
  description: "Memory Match Game by @guyunxiang",
  parent: "game-container",  // HTML element ID where the game will be mounted
  width: 1280,  // Game width in pixels
  height: 720,  // Game height in pixels
  backgroundColor: "#fbe2c2",  // Background color of the game
  pixelArt: false,  // Set to true if using pixel art assets
  scene: [Preloader, MainScene, GameScene],  // Array of scenes to be loaded
  scale: {
    mode: Phaser.Scale.FIT,  // Scale the game to fit the parent container
    autoCenter: Phaser.Scale.CENTER_BOTH,  // Center the game both horizontally and vertically
  }
};

// Initialize the Phaser game with the configuration
new Phaser.Game(config);
