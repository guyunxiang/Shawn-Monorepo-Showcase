import { eventBus } from "../core/EventBus.js";

/**
 * SoundManager - Manages all game audio including background music and sound effects
 * Handles sound playback, muting, and event-based sound control
 */
export class SoundManager {
  /**
   * Initialize the sound manager
   * @param {Phaser.Scene} scene - The scene instance to attach sounds to
   */
  constructor(scene) {
    this.scene = scene;
    this.sounds = {};
    this.isMuted = false;

    this.initSounds();
    
    this.setupEventListeners();
  }

  /**
   * Initialize all game sounds with their configurations
   */
  initSounds() {
    // Initialize background music with loop and volume settings
    this.sounds.bgMusic = this.scene.sound.add("bgMusic", {
      volume: 0.5,
      loop: true
    });

    // Initialize sound effects
    this.sounds.flip = this.scene.sound.add("flip");
    this.sounds.match = this.scene.sound.add("match");
    this.sounds.fail = this.scene.sound.add("fail");
    this.sounds.victory = this.scene.sound.add("victory");
  }

  /**
   * Set up event listeners for sound control
   */
  setupEventListeners() {
    eventBus.on("sound:play", this.playSound, this);
    eventBus.on("sound:stop", this.stopSound, this);
    eventBus.on("sound:toggleMute", this.toggleMute, this);
    eventBus.on("sound:playBGM", this.playBGM, this);
    eventBus.on("sound:stopBGM", this.stopBGM, this);
  }

  /**
   * Play a specific sound effect
   * @param {string} soundName - Name of the sound to play
   */
  playSound(soundName) {
    if (this.isMuted) return;
    const sound = this.sounds[soundName];
    if (sound) {
      sound.play();
    }
  }

  /**
   * Stop a specific sound effect
   * @param {string} soundName - Name of the sound to stop
   */
  stopSound(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.stop();
    }
  }

  /**
   * Play background music
   */
  playBGM() {
    if (this.isMuted) return;
    this.sounds.bgMusic.play();
  }

  /**
   * Stop background music
   */
  stopBGM() {
    this.sounds.bgMusic.stop();
  }

  /**
   * Toggle mute state for all sounds
   * Emits an event when mute state changes
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    Object.values(this.sounds).forEach(sound => {
      sound.setMute(this.isMuted);
    });
    eventBus.emit("sound:muteChanged", this.isMuted);
  }

  /**
   * Clean up sound manager resources
   * Stops all sounds and removes event listeners
   */
  destroy() {
    eventBus.removeGroup("sound");
    
    Object.values(this.sounds).forEach(sound => {
      sound.stop();
    });
  }
}
