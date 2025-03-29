class GlobalStyles {
  private styleElement: HTMLStyleElement | null = null;

  private addStyle(value: string) {
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      document.documentElement.prepend(this.styleElement);
    }
    this.styleElement.textContent += value;
  }

  setCursor(cursor: string) {
    this.addStyle(`*{cursor:${cursor}!important}`);
  }

  disableExternalContentElements() {
    this.addStyle(`embed,object,iframe{pointer-events:none!important}`);
  }

  reset() {
    this.styleElement?.remove();
    this.styleElement = null;
  }
}

export const globalStyles = new GlobalStyles();
