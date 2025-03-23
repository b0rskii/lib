export const setStyles = (
  element: HTMLElement,
  properties: string[],
  styles?: Partial<CSSStyleDeclaration>,
) => {
  properties.forEach((property) => {
    // @ts-ignore
    element.style[property] = styles ? styles[property] : '';
  });
};
