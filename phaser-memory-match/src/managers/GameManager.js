import { eventBus } from "../core/EventBus.js";

/**
 * GameManager - Manages core game logic and state
 * Handles card matching, scoring, and game progression
 */
export class GameManager {
  /**
   * Initialize the game manager
   * @param {Phaser.Scene} scene - The scene instance to manage
   */
  constructor(scene) {
    this.scene = scene;
    this.score = 0;
    this.moves = 0;

    // Set up event listeners for game events
    eventBus.on("gameManager:cardSelected", this.handleCardSelection, this);
    eventBus.on("gameManager:allMatched", this.handleAllMatched, this);
    eventBus.on("gameManager:playAgain", this.handlePlayAgain, this);
  }

  /**
   * Handle card selection event
   * @param {Object} param0 - Event parameters
   * @param {Array} param0.selectedCards - Array of currently selected cards
   */
  handleCardSelection({ selectedCards }) {
    if (selectedCards.length === 2) {
      this.moves++;
      this.checkMatch(selectedCards);
    }
  }

  /**
   * Check if two selected cards match
   * @param {Array} selectedCards - Array containing two selected cards
   */
  checkMatch(selectedCards) {
    const [card1, card2] = selectedCards;
    // Update score
    eventBus.emit("hud:updateScore", 1);
    // Check if cards match
    if (card1.cardData.id === card2.cardData.id) {
      eventBus.emit("sound:play", "match");
      eventBus.emit("cardManager:matchSuccess", { card1, card2 });
    } else {
      eventBus.emit("sound:play", "fail");
      eventBus.emit("cardManager:matchFailure", { card1, card2 });
    }
  }

  /**
   * Handle play again event
   * Resets the game state and creates new cards
   */
  handlePlayAgain() {
    eventBus.emit("hud:clearScore");
    eventBus.emit("gameScene:createCards");
  }

  /**
   * Handle all cards matched event
   * Shows victory screen and plays victory sound
   */
  handleAllMatched() {
    eventBus.emit("hud:updateBestScore");
    // Clear cards and show victory screen after delay
    this.scene.time.delayedCall(800, () => {
      eventBus.emit("cardManager:clearCards");
      eventBus.emit("gameScene:createVictory");
    });
    // Play victory sound after delay
    this.scene.time.delayedCall(1000, () => {
      eventBus.emit("sound:play", "victory");
    });
  }

  /**
   * Clean up game manager resources
   * Removes event listeners
   */
  destroy() {
    eventBus.removeGroup("gameManager");
  }
}
