import { Box } from "./box.js";

export const cube = new Box({
  width: 1,
  height: 1,
  depth: 1,
  velocity: { x: 0, y: -0.01, z: 0 },
});
cube.castShadow = true;
