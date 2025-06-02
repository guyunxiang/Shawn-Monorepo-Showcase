import { eventBus } from "../core/EventBus.js";

export class GameManager {
  constructor(scene) {
    this.scene = scene;
    this.score = 0;
    this.moves = 0;

    eventBus.on("gameManager:cardSelected", this.handleCardSelection, this);
    eventBus.on("gameManager:allMatched", this.handleAllMatched, this);
    eventBus.on("gameManager:playAgain", this.handlePlayAgain, this);
  }

  handleCardSelection({ selectedCards }) {
    if (selectedCards.length === 2) {
      this.moves++;
      this.checkMatch(selectedCards);
    }
  }

  checkMatch(selectedCards) {
    const [card1, card2] = selectedCards;
    // updae score
    eventBus.emit("hud:updateScore", 1);
    // check match
    if (card1.cardData.id === card2.cardData.id) {
      eventBus.emit("sound:play", "match");
      eventBus.emit("cardManager:matchSuccess", { card1, card2 });
    } else {
      eventBus.emit("sound:play", "fail");
      eventBus.emit("cardManager:matchFailure", { card1, card2 });
    }
  }

  handlePlayAgain() {
    eventBus.emit("hud:clearScore");
    eventBus.emit("gameScene:createCards");
  }

  handleAllMatched() {
    eventBus.emit("hud:updateBestScore");
    this.scene.time.delayedCall(800, () => {
      eventBus.emit("cardManager:clearCards");
      eventBus.emit("gameScene:createVictory");
    });
    this.scene.time.delayedCall(1000, () => {
      eventBus.emit("sound:play", "victory");
    });
  }

  destroy() {
    eventBus.removeGroup("gameManager");
  }
}
