import "./style.css";
import { scene } from "./core/scene.js";
import { camera } from "./core/camera.js";
import { renderer } from "./core/renderer.js";
import { light } from "./core/light.js";
import { ground, roadTexture } from "./objects/ground.js";
import { Robot } from "./objects/robot.js";
import { Keys, setupKeyboardListeners } from "./input/keyboard.js";

const robot = new Robot();
scene.add(light, robot, ground);
setupKeyboardListeners();

function animate() {
   robot.velocity.z = -0.05;
  robot.update(ground);
  roadTexture.offset.y += 0.001;

  camera.position.set(robot.position.x, robot.position.y + 2, robot.position.z + 5);
  camera.lookAt(robot.position);

  robot.velocity.x = Keys.left.pressed ? -0.1 : Keys.right.pressed ? 0.1 : 0;

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);