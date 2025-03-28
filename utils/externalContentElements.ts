class ExternalContentElements {
  private styleElement: HTMLStyleElement | null = null;

  disable() {
    if (this.styleElement) return;
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = `embed, object, iframe {pointer-events: none !important}`;
    document.documentElement.prepend(this.styleElement);
  }

  reset() {
    this.styleElement?.remove();
    this.styleElement = null;
  }
}

export const externalContentElements = new ExternalContentElements();
