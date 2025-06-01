# Memory Match Game

A modern memory matching card game built with Phaser 3, featuring beautiful animations and multiple difficulty levels.

## 🎮 Features

- Multiple difficulty levels (Easy, Medium, Hard)
- Beautiful card themes and animations
- Smooth transitions and effects
- Responsive design that works on various screen sizes
- Victory celebration with sound effects
- Clean and intuitive user interface

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
5. Enjoy the victory celebration!

## 🛠️ Technical Details

- Built with Phaser 3 game framework
- Uses modern JavaScript (ES6+)
- Modular code structure with separate managers for:
  - Card management
  - Theme management
  - Game state management
- Responsive design using Phaser's scaling system

## 📁 Project Structure

```
phaser-memory-match/
├── assets/          # Game assets (images, sounds)
├── src/             # Source code
│   ├── config/      # Game configuration
│   ├── gameObjects/ # Game object classes
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

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Phaser 3](https://phaser.io/phaser3)
- Inspired by classic memory matching games
