import Canvas from './src/canvas/Canvas';
import Renderer from './src/components/Render';
import StartScreen from './src/scenes/StartScreen';
import GameManager from './src/managers/GameManager';
import SoundManager from './src/managers/SoundManager';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = new Canvas();
  canvas.resize();

  const renderer = new Renderer(canvas.getContext());

  // BGM
  const soundManager = new SoundManager();
  soundManager.enableAutoBGM(canvas.getElement());

  const startScreen = new StartScreen(canvas.getElement(), renderer, (difficulty) => {
    new GameManager(difficulty);
  }, 'animals');
});
