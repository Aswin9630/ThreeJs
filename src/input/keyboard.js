export const Keys = {
  left: { pressed: false },
  right: { pressed: false },
};

export function setupKeyboardListeners() {
  window.addEventListener("keydown", (event) => {
    if (event.code === "KeyA" || event.code === "ArrowLeft")
      Keys.left.pressed = true;
    if (event.code === "KeyD" || event.code === "ArrowRight")
      Keys.right.pressed = true;
  });

  window.addEventListener("keyup", (event) => {
    if (event.code === "KeyA" || event.code === "ArrowLeft")
      Keys.left.pressed = false;
    if (event.code === "KeyD" || event.code === "ArrowRight")
      Keys.right.pressed = false;
  });
}
