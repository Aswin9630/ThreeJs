import * as THREE from "three";
import "./style.css";
import { scene } from "./core/scene.js";
import { camera } from "./core/camera.js";
import { renderer } from "./core/renderer.js";
import { light } from "./core/light.js";
import { ground, roadTexture, leftWall, rightWall } from "./objects/ground.js";
import { Robot } from "./objects/robot.js";
import { Keys, setupKeyboardListeners } from "./input/keyboard.js";
import { loadAnimatedRobot } from "./objects/animatedRobot.js";

let robot = new Robot();
scene.add(light, robot, ground, leftWall, rightWall);
setupKeyboardListeners();

let mixer;
loadAnimatedRobot(scene, ({ model, mixer: loadedMixer }) => {
  scene.remove(robot);
  robot = model;
  mixer = loadedMixer;
  robot.velocity = { x: 0, y: 0, z: 0 };
});

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  robot.velocity.z = -0.05;

  roadTexture.offset.y += 0.001;
  leftWall.material.map.offset.y += 0.001;
  rightWall.material.map.offset.y += 0.001;

  camera.position.set(
    robot.position.x,
    robot.position.y + 2,
    robot.position.z + 5
  );
  camera.lookAt(robot.position);

  robot.velocity.x = Keys.left.pressed ? -0.1 : Keys.right.pressed ? 0.1 : 0;
  robot.position.x += robot.velocity.x;
  robot.position.z -= 0.1;

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
