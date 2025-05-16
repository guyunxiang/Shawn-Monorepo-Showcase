class Canvas {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;

  constructor(onResize?: () => void) {
    this._canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this._ctx = this._canvas.getContext('2d')!;

    window.addEventListener('resize', this.debounce(() => {
      this.resize();
      onResize?.();
    }));
  }

  resize(): void {
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
  }

  getContext(): CanvasRenderingContext2D {
    return this._ctx;
  }

  getElement(): HTMLCanvasElement {
    return this._canvas;
  }

  getWidth(): number {
    return this._canvas.width;
  }

  getHeight(): number {
    return this._canvas.height;
  }

  private debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay = 100
  ): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout>;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  }
}

export default Canvas;
