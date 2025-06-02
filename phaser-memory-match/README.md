# Memory Match Game

A modern memory matching card game built with Phaser 3, featuring beautiful animations and multiple difficulty levels. This game offers an engaging experience with smooth card flipping animations, score tracking, and a clean user interface.

## 🎮 Features

- Multiple difficulty levels (Easy, Normal, Hard)
- Beautiful card themes and animations
  - Smooth card flip animations with sound effects
  - Interactive card hover effects
  - Victory celebration animations
- Game Statistics
  - Step counter for current game
  - Best score tracking per difficulty level
  - Real-time clock display
- Responsive design that works on various screen sizes
- Clean and intuitive user interface
  - Main menu with difficulty selection
  - Game HUD with score and time
  - Victory panel with replay options

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- Basic understanding of web development (if you want to modify the code)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/guyunxiang/Shawn-Monorepo-Showcase
cd phaser-memory-match
```

2. Open `index.html` in your web browser or use a local server:
```bash
# Using Python
python -m http.server

# Using Node.js
npx serve
```

## 🎯 How to Play

1. Select a difficulty level from the main menu
2. Click on cards to flip them
3. Try to find matching pairs of cards
4. Complete the game by matching all pairs
5. Track your progress with the step counter
6. Try to beat your best score for each difficulty level
7. Enjoy the victory celebration!

## 🛠️ Technical Details

### Core Components

- **Button Component**: Reusable button with text and interactive states
  - Customizable size, texture, and font
  - Hover and click animations
  - Sound effects on interaction

- **Card Component**: Memory card with flip animation
  - Smooth flip animation with sound
  - Interactive states (hover, click)
  - Card matching logic
  - Texture management for front/back sides

- **Game HUD**: Heads-up display showing game information
  - Current step counter
  - Best score tracking with local storage
  - Real-time clock display
  - Level title display

- **Main Menu**: Game entry point
  - Title and subtitle display
  - Interactive demo card
  - Difficulty selection buttons
  - Smooth transition animations

- **Victory Panel**: End game celebration
  - Animated victory image
  - Play again option
  - Return to main menu option

### Technical Stack

- Built with Phaser 3 game framework
- Uses modern JavaScript (ES6+)
- Event-driven architecture using custom EventBus
- Modular code structure with separate managers for:
  - Card management
  - Theme management
  - Game state management
- Responsive design using Phaser's scaling system
- Local storage for persisting best scores

## 📁 Project Structure

```
phaser-memory-match/
├── assets/          # Game assets (images, sounds)
├── src/             # Source code
│   ├── config/      # Game configuration
│   ├── core/        # Core game systems
│   │   ├── EventBus.js    # Event management system
│   │   └── GameManager.js # Game state management
│   ├── gameObjects/ # Game object classes
│   │   ├── Button.js      # Button component
│   │   ├── Card.js        # Card component
│   │   ├── GameHUD.js     # Game interface
│   │   ├── MainMenu.js    # Main menu
│   │   └── VictoryPanel.js # Victory screen
│   ├── managers/    # Game managers
│   ├── scenes/      # Game scenes
│   └── utils/       # Utility functions
├── index.html       # Main HTML file
└── phaser.js        # Phaser framework
```

## 🎨 Customization

You can customize the game by:
- Adding new card themes in the assets folder
- Modifying difficulty levels in the config
- Adjusting game parameters in the configuration files
- Customizing button and card appearances
- Adding new game modes or features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Phaser 3](https://phaser.io/phaser3)
- Inspired by classic memory matching games
- Uses the Playpen Sans Arabic font for beautiful typography
