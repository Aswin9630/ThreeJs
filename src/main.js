import * as THREE from "three";
import "./style.css";
import { scene } from "./core/scene.js";
import { camera } from "./core/camera.js";
import { renderer } from "./core/renderer.js";
import { light } from "./core/light.js";
import { ground, roadTexture, leftWall, rightWall } from "./objects/ground.js";
import { Robot } from "./objects/robot.js";
import { Keys, setupKeyboardListeners } from "./input/keyboard.js";
import { setupTouchControls } from "./input/touch.js";
import { loadAnimatedRobot } from "./objects/animatedRobot.js";
import { Coin } from "./objects/coins.js";
import { Obstacle } from "./objects/obstacles.js";
import { createSparkleEffect } from "./objects/sparkle.js";
import { playCoinSound } from "./audio/sound.js";
import { boxCollision } from "./utils/collision.js";

setupKeyboardListeners();
setupTouchControls();
scene.add(light, ground, leftWall, rightWall);

let robot = new Robot();
let mixer;
const coins = [];
const obstacles = [];
const sparkles = [];
let score = 0;
let timeLeft = 60;

const clock = new THREE.Clock();
const timerElement = document.createElement("div");
timerElement.style.cssText = "position:absolute;top:20px;left:20px;font-size:24px;color:white;background:rgba(0,0,0,0.6);padding:8px 12px;border-radius:8px;font-family:Arial,sans-serif;z-index:100;";
document.body.appendChild(timerElement);

const scoreElement = document.createElement("div");
scoreElement.style.cssText = "position:absolute;top:20px;right:20px;font-size:24px;color:white;background:rgba(0,0,0,0.6);padding:8px 12px;border-radius:8px;font-family:Arial,sans-serif;z-index:100;";
scoreElement.innerHTML = `Score: ${score}`;
document.body.appendChild(scoreElement);

// Generate coins
const roadWidth = ground.width;
for (let i = 0; i < 20; i++) {
  const x = (Math.random() - 0.5) * (roadWidth - 1);
  const z = -5 - Math.random() * 100;
  const coin = new Coin({ x, y: 0.5, z });
  coins.push(coin);
  scene.add(coin);
}

// Generate obstacles
for (let i = 0; i < 10; i++) {
  const x = (Math.random() - 0.5) * (roadWidth - 2);
  const z = -5 - Math.random() * 800;
  const obs = new Obstacle({ x, y: 0.5, z });
  obstacles.push(obs);
  scene.add(obs);
}

loadAnimatedRobot(scene, ({ model, mixer: loadedMixer }) => {
  scene.remove(robot);
  robot = model;
  mixer = loadedMixer;
  robot.velocity = { x: 0, y: 0, z: 0 };

  renderer.setAnimationLoop(() => animate(robot));
});

function animate(robot) {
  const delta = clock.getDelta();
  timeLeft -= delta;
  if (timeLeft <= 0) {
    alert("Time's up! Final Score: " + score);
    renderer.setAnimationLoop(null);
    return;
  }

  timerElement.innerHTML = `Time: ${Math.floor(timeLeft)}s`;
  if (mixer) mixer.update(delta);

  robot.velocity.z = -0.05;
  robot.velocity.x = Keys.left.pressed ? -0.1 : Keys.right.pressed ? 0.1 : 0;
  robot.position.x += robot.velocity.x;
  robot.position.z -= 0.1;

  const halfRoad = roadWidth / 2;
  robot.position.x = Math.max(-halfRoad + 0.5, Math.min(halfRoad - 0.5, robot.position.x));

  roadTexture.offset.y += 0.001;
  leftWall.material.map.offset.y += 0.001;
  rightWall.material.map.offset.y += 0.001;

  const robotBox = {
    left: robot.position.x - 0.5,
    right: robot.position.x + 0.5,
    top: robot.position.y + 1,
    bottom: robot.position.y - 1,
    front: robot.position.z + 0.5,
    back: robot.position.z - 0.5,
    velocity: robot.velocity,
  };

  // Coin collisions
  for (let i = coins.length - 1; i >= 0; i--) {
    const coin = coins[i];
    coin.update();
    coin.position.z += 0.2;

    const coinBox = {
      left: coin.position.x - 0.35,
      right: coin.position.x + 0.35,
      top: coin.position.y + 0.1,
      bottom: coin.position.y - 0.1,
      front: coin.position.z + 0.1,
      back: coin.position.z - 0.1,
    };

    if (boxCollision({ box1: robotBox, box2: coinBox })) {
      scene.remove(coin);
      coins.splice(i, 1);
      score += 10;
      scoreElement.innerHTML = `Score: ${score}`;
      playCoinSound();

      const sparkle = createSparkleEffect(coin.position.clone());
      sparkles.push(sparkle);
      scene.add(sparkle);
    }
  }

  // Obstacle collisions
  for (let obs of obstacles) {
    obs.update();
    const obsBox = {
      left: obs.position.x - 0.5,
      right: obs.position.x + 0.5,
      top: obs.position.y + 0.5,
      bottom: obs.position.y - 0.5,
      front: obs.position.z + 0.5,
      back: obs.position.z - 0.5,
    };

    if (boxCollision({ box1: robotBox, box2: obsBox })) {
      alert("You hit an obstacle! Final Score: " + score);
      renderer.setAnimationLoop(null);
      return;
    }
  }

  // Sparkle updates
  for (let i = sparkles.length - 1; i >= 0; i--) {
    const sparkle = sparkles[i];
    sparkle.update(delta); // Pass delta time to control lifetime

    if (sparkle.dead) {
      scene.remove(sparkle);
      sparkles.splice(i, 1);
    }
  }

  // Camera follows robot
  camera.position.set(
    robot.position.x,
    robot.position.y + 3,
    robot.position.z + 5
  );
  camera.lookAt(robot.position);

  renderer.render(scene, camera);
}

