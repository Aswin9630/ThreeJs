export const Keys = {
  a: { pressed: false },
  d: { pressed: false },
};

export function setupKeyboardListeners() {
  window.addEventListener("keydown", (event) => {
    if (event.code === "KeyA") Keys.a.pressed = true;
    if (event.code === "KeyD") Keys.d.pressed = true;
  });

  window.addEventListener("keyup", (event) => {
    if (event.code === "KeyA") Keys.a.pressed = false;
    if (event.code === "KeyD") Keys.d.pressed = false;
  });
}
