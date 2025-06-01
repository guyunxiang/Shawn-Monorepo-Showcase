export class GameManager {
  constructor(scene) {
    this.scene = scene;
    this.score = 0;
    this.moves = 0;

    // Listen for card selection events
    this.scene.events.on("cardSelected", this.handleCardSelection, this);
    this.scene.events.on("allMatched", this.handleAllMatched, this);
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
    this.scene.hud.updateScore(1);
    // check match
    if (card1.cardData.id === card2.cardData.id) {
      this.scene.sound.play("match");
      this.scene.events.emit("matchSuccess", { card1, card2 });
    } else {
      this.scene.sound.play("fail");
      this.scene.events.emit("matchFailure", { card1, card2 });
    }
  }

  handlePlayAgain() {
    this.scene.hud.clearCurrentScore();
    this.scene.createGameCards();
  }

  handleAllMatched() {
    this.scene.hud.updateBestScore();
    this.scene.time.delayedCall(800, () => {
      this.scene.cardManager.clearCards();
      this.scene.createVictory();
    });
    this.scene.time.delayedCall(1000, () => {
      this.scene.sound.play("victory");
    });
  }

  destroy() {
    this.scene.events.off("cardSelected", this.handleCardSelection, this);
  }
}
