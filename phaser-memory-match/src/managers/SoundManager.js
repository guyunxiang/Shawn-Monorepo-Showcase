import { eventBus } from "../core/EventBus.js";

export class SoundManager {
  constructor(scene) {
    this.scene = scene;
    this.sounds = {};
    this.isMuted = false;

    this.initSounds();
    
    this.setupEventListeners();
  }

  initSounds() {
    this.sounds.bgMusic = this.scene.sound.add("bgMusic", {
      volume: 0.5,
      loop: true
    });

    this.sounds.flip = this.scene.sound.add("flip");
    this.sounds.match = this.scene.sound.add("match");
    this.sounds.fail = this.scene.sound.add("fail");
    this.sounds.victory = this.scene.sound.add("victory");
  }

  setupEventListeners() {
    eventBus.on("sound:play", this.playSound, this);
    eventBus.on("sound:stop", this.stopSound, this);
    eventBus.on("sound:toggleMute", this.toggleMute, this);
    eventBus.on("sound:playBGM", this.playBGM, this);
    eventBus.on("sound:stopBGM", this.stopBGM, this);
  }

  playSound(soundName) {
    if (this.isMuted) return;
    const sound = this.sounds[soundName];
    if (sound) {
      sound.play();
    }
  }

  stopSound(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.stop();
    }
  }

  playBGM() {
    if (this.isMuted) return;
    this.sounds.bgMusic.play();
  }

  stopBGM() {
    this.sounds.bgMusic.stop();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    Object.values(this.sounds).forEach(sound => {
      sound.setMute(this.isMuted);
    });
    eventBus.emit("sound:muteChanged", this.isMuted);
  }

  destroy() {
    eventBus.off("sound:play", this.playSound, this);
    eventBus.off("sound:stop", this.stopSound, this);
    eventBus.off("sound:toggleMute", this.toggleMute, this);
    eventBus.off("sound:playBGM", this.playBGM, this);
    eventBus.off("sound:stopBGM", this.stopBGM, this);
    
    Object.values(this.sounds).forEach(sound => {
      sound.stop();
    });
  }
}
