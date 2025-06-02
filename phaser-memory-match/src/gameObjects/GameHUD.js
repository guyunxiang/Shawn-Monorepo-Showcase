import { capitalizeFirstLetter } from "../utils/string.js";
import { Button } from "./Button.js";
import { eventBus } from "../core/EventBus.js";

/**
 * GameHUD - Heads-up display for the game scene
 * Shows score, best score, level title, and clock
 * Extends Phaser.GameObjects.Container to manage HUD elements as a group
 */
export class GameHUD extends Phaser.GameObjects.Container {
  /**
   * Create a new game HUD instance
   * @param {Phaser.Scene} scene - The scene to add the HUD to
   * @param {Object} config - HUD configuration
   * @param {string} [config.level="easy"] - Current game level
   * @param {Function} [config.onBack=()=>{}] - Callback when back button is clicked
   */
  constructor(scene, config) {
    super(scene, 0, -100);
    this.config = config || {
      level: "easy",
      onBack: () => {},
    };

    // Initialize score tracking
    this.scoreValue = 0;
    this.bestScoreValue = Infinity;

    this._loadLocalBestScore();

    // Create HUD elements
    this._createBackBtn();
    this._createCurrentStep();
    this._createCurrentTitle();
    this._createBestStep();
    this._createClock();

    scene.add.existing(this);

    // Set up event listeners
    eventBus.on("hud:clearScore", this.clearCurrentScore, this);
    eventBus.on("hud:updateScore", this.updateScore, this);
    eventBus.on("hud:updateBestScore", this.updateBestScore, this);
  }

  /**
   * Animate HUD into view
   */
  animationIn() {
    this.scene.tweens.add({
      targets: this,
      y: 0,
      duration: 1000,
      ease: "Power2",
    });
  }

  /**
   * Animate HUD out of view and clean up
   * @param {Function} onComplete - Callback when animation completes
   */
  animateOut(onComplete) {
    this.scene.tweens.add({
      targets: this,
      y: -100,
      duration: 600,
      ease: "Power2",
      onComplete: () => {
        this.destroy();
        if (onComplete) onComplete();
      },
    });
  }

  /**
   * Load best score from local storage
   * @private
   */
  _loadLocalBestScore() {
    try {
      this.localScoreData = JSON.parse(
        localStorage.getItem("bestScore") || "{}"
      );
      this.localBestScoreValue = this.localScoreData[this.config.level];
      this.bestScoreValue = this.localBestScoreValue || Infinity;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Create back button
   * @private
   */
  _createBackBtn() {
    const { width, height } = this.scene.cameras.main;
    const button = new Button(
      this.scene,
      width * 0.06,
      height * 0.085,
      "Back",
      {
        width: 120,
        height: 80,
        onClick: () => {
          eventBus.emit("gameScene:exitGame");
        },
      }
    );
    this.add(button);
  }

  /**
   * Create current step counter
   * @private
   */
  _createCurrentStep() {
    const { width, height } = this.scene.cameras.main;
    const ky = 0.065;
    const kx = 0.15;
    this.scoreTextObj = this.scene.add.text(
      width * kx,
      height * ky,
      `Step Count: ${this.scoreValue}`,
      {
        fontFamily: "Playpen Sans Arabic",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#79442F",
        resolution: window.devicePixelRatio,
      }
    );
    this.add(this.scoreTextObj);
  }

  /**
   * Create level title display
   * @private
   */
  _createCurrentTitle() {
    const { centerX, height } = this.scene.cameras.main;
    const { level } = this.config;
    const text = this.scene.add
      .image(centerX, height * 0.085, "bgImage-center")
      .setOrigin(0.5, 0.5)
      .setDisplaySize(300, 60);
    const titleText = capitalizeFirstLetter(level || "");
    const title = this.scene.add
      .text(centerX, height * 0.085, titleText, {
        fontFamily: "Playpen Sans Arabic",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#79442F",
        resolution: window.devicePixelRatio,
      })
      .setOrigin(0.5, 0.5);
    this.add([text, title]);
  }

  /**
   * Create best score display
   * @private
   */
  _createBestStep() {
    const { centerX, width, height } = this.scene.cameras.main;
    const ky = 0.065;
    const kx = 0.15;
    this.bestTextObj = this.scene.add.text(
      centerX + width * kx,
      height * ky,
      `Best Count: ${
        this.bestScoreValue === Infinity ? "-" : this.bestScoreValue
      }`,
      {
        fontFamily: "Playpen Sans Arabic",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#79442F",
        resolution: window.devicePixelRatio,
      }
    );
    this.add(this.bestTextObj);
  }

  /**
   * Create clock display
   * @private
   */
  _createClock() {
    const { width, height } = this.scene.cameras.main;
    const ky = 0.085;
    this.clock = this.scene.add
      .text(width - 32, height * ky, "", {
        fontFamily: "Playpen Sans Arabic",
        fontSize: "24px",
        fontStyle: "bold",
        color: "#79442F",
        resolution: window.devicePixelRatio,
      })
      .setOrigin(1, 0.5);
    this._updateClockText();
    this._startClockTimer();
    this.add(this.clock);
  }

  /**
   * Update clock text with current time
   * @private
   */
  _updateClockText() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    this.clock.setText(`${hours}:${minutes}:${seconds}`);
  }

  /**
   * Start clock update timer
   * @private
   */
  _startClockTimer() {
    this.clockEvent = this.scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this._updateClockText(),
    });
  }

  /**
   * Update score text display
   * @private
   */
  _setScoreText() {
    this.scoreTextObj.setText(`Step Count: ${this.scoreValue}`);
  }

  /**
   * Update current score
   * @param {number} value - Score to add
   */
  updateScore(value) {
    this.scoreValue += value;
    this._setScoreText();
  }

  /**
   * Update best score and save to local storage
   */
  updateBestScore() {
    this.bestScoreValue = Math.min(Infinity, this.scoreValue, this.bestScoreValue);
    this.bestTextObj.setText(`Best Count: ${this.bestScoreValue}`);
    localStorage.setItem(
      "bestScore",
      JSON.stringify({
        ...this.localScoreData,
        [this.config.level]: this.bestScoreValue,
      })
    );
  }

  /**
   * Update game mode display
   * @param {string} mode - New game mode
   */
  updateMode(mode) {
    this.modeText.setText(`Mode: ${mode}`);
  }

  /**
   * Reset current score to zero
   */
  clearCurrentScore() {
    this.scoreValue = 0;
    this._setScoreText();
  }

  /**
   * Clean up HUD resources
   * Removes event listeners and timers
   */
  destroy() {
    eventBus.removeGroup("hud");
    if (this.clockEvent) {
      this.clockEvent.remove(false);
    }
    super.destroy();
  }
}
