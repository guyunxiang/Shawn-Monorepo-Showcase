import Card from "../components/Card";

/**
 * animate a card flip effect
 */
export function animateCardFlip(
  card: Card,
  onHalfFlip: () => void,
  onDone?: () => void,
  onFrame?: () => void // 💡 added frame draw callback
): void {
  card.startAnimation();
  let progress = 0;
  let direction = -1;

  const animate = () => {
    progress += 0.1;
    card.setScaleX(Math.cos(progress));

    if (progress >= Math.PI / 2 && direction === -1) {
      onHalfFlip();
      direction = 1;
    }

    if (progress >= Math.PI) {
      card.setScaleX(1);
      card.stopAnimation();
      if (onDone) onDone();
      return;
    }

    if (onFrame) onFrame(); // 💡 trigger redraw
    requestAnimationFrame(animate);
  };

  animate();
}
