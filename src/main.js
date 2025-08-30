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
import { Coin } from "./objects/coins.js";

let robot = new Robot();
setupKeyboardListeners();

let mixer;
loadAnimatedRobot(scene, ({ model, mixer: loadedMixer }) => {
  scene.remove(robot);
  robot = model;
  mixer = loadedMixer;
  robot.velocity = { x: 0, y: 0, z: 0 };
});

scene.add(light, robot, ground, leftWall, rightWall);

const coins = [];
const roadWidth = ground.width;
const coinCount = 20; // spawn 20 coins ahead
for (let i = 0; i < coinCount; i++) {
  const x = (Math.random() - 0.5) * (roadWidth - 1); // within road
  const z = -50 - Math.random() * 700; // ahead of robot
  const coin = new Coin({ x, y: 0.5, z });
  coins.push(coin);
  scene.add(coin);
}

// --- Score ---
let score = 0;
const scoreElement = document.createElement("div");
scoreElement.style.position = "absolute";
scoreElement.style.top = "20px";
scoreElement.style.left = "20px";
scoreElement.style.fontSize = "24px";
scoreElement.style.color = "white";
scoreElement.innerHTML = `Score: ${score}`;
document.body.appendChild(scoreElement);

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  robot.velocity.z = -0.05;

  roadTexture.offset.y += 0.001;
  leftWall.material.map.offset.y += 0.001;
  rightWall.material.map.offset.y += 0.001;

  const halfRoad = roadWidth / 2;
  if (robot.position.x < -halfRoad + 0.5) robot.position.x = -halfRoad + 0.5;
  if (robot.position.x > halfRoad - 0.5) robot.position.x = halfRoad - 0.5;

  
  robot.velocity.x = Keys.left.pressed ? -0.1 : Keys.right.pressed ? 0.1 : 0;
  robot.position.x += robot.velocity.x;
  robot.position.z -= 0.1;


  coins.forEach((coin, index) => {
    coin.update();

    const robotBox = new THREE.Box3().setFromObject(robot);
    if (robotBox.intersectsBox(coin.boundingBox)) {
      scene.remove(coin);
      coins.splice(index, 1);
      score += 10;
      scoreElement.innerHTML = `Score: ${score}`;
    }
  });


  camera.position.set(
    robot.position.x,
    robot.position.y + 3,
    robot.position.z + 5
  );
  camera.lookAt(robot.position);


  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
