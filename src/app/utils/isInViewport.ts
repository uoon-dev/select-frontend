const aboveTheTop = (elementRect: ClientRect) => elementRect.top + elementRect.height <= 0;
const belowTheFold = (elementRect: ClientRect) => elementRect.top >= window.innerHeight;
const leftOfBegin = (elementRect: ClientRect) => elementRect.left + elementRect.width <= 0;
const rightOfFold = (elementRect: ClientRect) => elementRect.left >= window.innerWidth;

export function isInViewport(element: HTMLElement) {
  const elementRect = element.getBoundingClientRect();
  return !(
    aboveTheTop(elementRect) ||
    belowTheFold(elementRect) ||
    leftOfBegin(elementRect) ||
    rightOfFold(elementRect)
  );
}
