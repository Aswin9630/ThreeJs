import { Keys } from './keyboard.js';

let startX = 0;

export function setupTouchControls() {
  window.addEventListener("touchstart", (event) => {
    startX = event.touches[0].clientX;
  });

  window.addEventListener("touchend", (event) => {
    const endX = event.changedTouches[0].clientX;
    const deltaX = endX - startX;

    // Swipe threshold
    if (Math.abs(deltaX) > 30) {
      if (deltaX > 0) {
        // Swipe right
        Keys.right.pressed = true;
        Keys.left.pressed = false;
      } else {
        // Swipe left
        Keys.left.pressed = true;
        Keys.right.pressed = false;
      }

      // Reset keys after short duration to simulate key press
      setTimeout(() => {
        Keys.left.pressed = false;
        Keys.right.pressed = false;
      }, 100);
    }
  });
}
