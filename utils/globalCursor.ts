class GlobalCursor {
  private styleElement: HTMLStyleElement | null = null;

  set(cursor: string) {
    if (this.styleElement) return;
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = `* {cursor: ${cursor} !important}`;
    document.documentElement.prepend(this.styleElement);
  }

  reset() {
    this.styleElement?.remove();
    this.styleElement = null;
  }
}

export const globalCursor = new GlobalCursor();
