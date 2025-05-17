type ResizeCallback = () => void;

export default class WindowManager {
  private _resizeCallbacks: Set<ResizeCallback> = new Set();

  constructor() {
    window.addEventListener("resize", this.debounce(this.handleResize));
  }

  debounce<T extends (...args: any[]) => any>(
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

  // register resize callback
  addResizeListener(callback: ResizeCallback): void {
    this._resizeCallbacks.add(callback);
    callback(); // trigger once on registration
  }

  // remove a specific resize listener
  removeResizeListener(callback: ResizeCallback): void {
    this._resizeCallbacks.delete(callback);
  }

  // clean up all
  dispose(): void {
    window.removeEventListener("resize", this.handleResize);
    this._resizeCallbacks.clear();
  }

  private handleResize = (): void => {
    for (const cb of this._resizeCallbacks) {
      cb();
    }
  };
}
