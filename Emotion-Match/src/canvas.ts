export const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
export const ctx = canvas.getContext('2d')!;

// set canvas size to match window size
export function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 100
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  }
}

// listen for window resize
window.addEventListener('resize', debounce(resizeCanvas));