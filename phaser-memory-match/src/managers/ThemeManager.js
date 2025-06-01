export class ThemeManager {
  constructor() {
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

    this.currentTheme = "animals";
  }

  // Get Current Theme
  getCurrentTheme() {
    return this.themes[this.currentTheme];
  }

  // Set Theme
  setTheme(themeName) {
    if (this.themes[themeName]) {
      this.currentTheme = themeName;
      return true;
    }
    return false;
  }

  // Get Theme List
  getThemeList() {
    return Object.keys(this.themes);
  }
}
