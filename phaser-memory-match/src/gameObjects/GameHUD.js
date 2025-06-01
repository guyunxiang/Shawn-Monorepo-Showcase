import { capitalizeFirstLetter } from "../utils/string.js";
import { Button } from "./Button.js";

export class GameHUD extends Phaser.GameObjects.Container {
  constructor(scene, config) {
    super(scene, 0, -100);
    this.config = config || {
      level: "easy",
      onBack: () => {},
    };

    this.scoreValue = 0;
    this.bestScoreValue = Infinity;

    this._loadLocalBestScore();

    this._createBackBtn();
    this._createCurrentStep();
    this._createCurrentTitle();
    this._createBestStep();
    this._createClock();

    scene.add.existing(this);
  }

  animationIn() {
    this.scene.tweens.add({
      targets: this,
      y: 0,
      duration: 1000,
      ease: "Power2",
    });
  }

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
          this.scene.sound.play("flip");
          this.config?.onBack();
        },
      }
    );
    this.add(button);
  }

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

  _createBestStep() {
    const { centerX, width, height } = this.scene.cameras.main;
    const ky = 0.065;
    const kx = 0.15;
    console.log(this.bestScoreValue);
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

  _updateClockText() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    this.clock.setText(`${hours}:${minutes}:${seconds}`);
  }

  _startClockTimer() {
    this.clockEvent = this.scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this._updateClockText(),
    });
  }

  _setScoreText() {
    this.scoreTextObj.setText(`Step Count: ${this.scoreValue}`);
  }

  updateScore(value) {
    this.scoreValue += value;
    this._setScoreText();
  }

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

  updateMode(mode) {
    this.modeText.setText(`Mode: ${mode}`);
  }

  clearCurrentScore() {
    this.scoreValue = 0;
    this._setScoreText();
  }

  destroy() {
    if (this.clockEvent) {
      this.clockEvent.remove(false);
    }
    super.destroy();
  }
}
