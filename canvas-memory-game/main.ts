import Canvas from './src/Canvas';
import Renderer from './src/Render';
import StartScreen from './src/home/StartScreen';
import GameManager from './src/GameManager';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = new Canvas();
  canvas.resize();
  const renderer = new Renderer(canvas.getContext());

  const startScreen = new StartScreen(canvas.getElement(), renderer, (difficulty) => {
    new GameManager(difficulty);
  });
});
