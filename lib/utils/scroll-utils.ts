export function smoothScrollToElement(elementId: string, duration = 2500) {
  const target = document.getElementById(elementId);
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 40;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let start: number | null = null;

  function step(timestamp: number) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    window.scrollTo(0, startPosition + distance * easeInOutCubic(Math.min(progress / duration, 1)));
    if (progress < duration) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}
