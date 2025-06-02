/**
 * ThemeManager - Manages game themes and their associated assets
 * Handles theme switching and provides access to theme-specific resources
 */
export class ThemeManager {
  constructor() {
    // Define available themes and their assets
    this.themes = {
      animals: {
        name: "animals",
        path: "assets/animals/",
        cards: [
          "bear.png",
          "calf.png",
          "crocodile.png",
          "duckling.png",
          "elephant.png",
          "giraffe.png",
          "kitty.png",
          "lion.png",
          "owl.png",
          "puppy.png",
          "raccoon.png",
          "squirrel.png",
        ],
      },
    };

    // Set default theme
    this.currentTheme = "animals";
  }

  /**
   * Get the currently active theme configuration
   * @returns {Object} The current theme object containing name, path and cards
   */
  getCurrentTheme() {
    return this.themes[this.currentTheme];
  }

  /**
   * Switch to a different theme
   * @param {string} themeName - The name of the theme to switch to
   * @returns {boolean} True if theme switch was successful, false if theme doesn't exist
   */
  setTheme(themeName) {
    if (this.themes[themeName]) {
      this.currentTheme = themeName;
      return true;
    }
    return false;
  }

  /**
   * Get list of all available themes
   * @returns {string[]} Array of theme names
   */
  getThemeList() {
    return Object.keys(this.themes);
  }
}
