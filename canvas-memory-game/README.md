## 🎮 Project Overview: Memory Match Game (HTML5 Canvas + TypeScript)

### 📌 Summary

This project is a browser-based **Memory Match Game** built with **HTML5 Canvas**, **TypeScript**, and a modular architecture. It features interactive gameplay, audio-visual feedback, and support for themes and difficulty levels. The game is ideal for showcasing HTML5 Canvas rendering, animation effects, and object-oriented design principles.

---

### 🧱 Project Structure

* `index.html`: entry point of the game UI
* `main.ts`: game bootstrapper
* `src/`

  * `managers/`: logic controllers (e.g., `GameManager`, `UIManager`)
  * `components/`: reusable visual elements (e.g., `Card`, `Button`)
  * `canvas/`: canvas abstraction layer
  * `scenes/`: screen flow controllers (e.g., `StartScreen`)
  * `audio/`: background music and sound effect manager
  * `utils/`: animation and theme utilities
  * `types/`: shared TypeScript types

---

### 🔧 Key Features

* **Canvas Rendering**: All graphics are rendered using HTML5 Canvas, abstracted in `Canvas.ts`.
* **Object-Oriented Design**: Each game part is encapsulated in modular classes.
* **Scene Management**: Navigation between screens like `StartScreen` and `GameScene` is managed through callbacks and transition animations.
* **Theme Support**: Themes are dynamically loaded to change card styles.
* **Multiple Difficulty Levels**: Card pairs and layout adapt based on selected difficulty.
* **Sound Integration**: `BGMController.ts` manages background music and sound effects.
* **Animations**: Smooth card flipping and transitions using requestAnimationFrame-based utilities.

---

### 📂 File Highlights

#### `GameManager.ts`

* Central controller for gameplay logic
* Manages game state, canvas rendering, and UI updates

#### `StartScreen.ts`

* Handles user input for theme and difficulty selection
* Supports animated transitions to enter the game

#### `Card.ts`

* Represents each card as a drawable and flippable object
* Contains logic for card matching and visual states

#### `animations.ts`

* Provides utilities like easing, transition effects for smoother UI

#### `BGMController.ts`

* Controls background music and effects with toggling capabilities

---

### 🚀 How to Run

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the project:

   ```bash
   pnpm dev
   ```

---

### 📈 Potential Enhancements

* Add scoring system and leaderboard using backend
* Enable mobile/touch support for tablets and phones
* Implement multiplayer or timed challenge modes
* Add custom card pack import/export functionality
