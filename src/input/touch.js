import { Keys } from './keyboard.js';

let touchX = null;

export function setupTouchControls() {
  window.addEventListener("touchstart", (event) => {
    touchX = event.touches[0].clientX;
  });

  window.addEventListener("touchmove", (event) => {
    if (touchX === null) return;

    const currentX = event.touches[0].clientX;
    const deltaX = currentX - touchX;

    const threshold = 5; 

    if (deltaX > threshold) {
      Keys.right.pressed = true;
      Keys.left.pressed = false;
    } else if (deltaX < -threshold) {
      Keys.left.pressed = true;
      Keys.right.pressed = false;
    } else {
      Keys.left.pressed = false;
      Keys.right.pressed = false;
    }
  });

  window.addEventListener("touchend", () => {
    Keys.left.pressed = false;
    Keys.right.pressed = false;
    touchX = null;
  });
}
