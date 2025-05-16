import Canvas from './src/canvas/Canvas';
import Renderer from './src/components/Render';
import StartScreen from './src/scenes/StartScreen';
import GameManager from './src/managers/GameManager';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = new Canvas();
  canvas.resize();
  const renderer = new Renderer(canvas.getContext());

  const startScreen = new StartScreen(canvas.getElement(), renderer, (difficulty) => {
    new GameManager(difficulty);
  });
});
