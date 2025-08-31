import * as THREE from "three";
import "./style.css";
import { scene } from "./core/scene";
import { camera } from "./core/camera";
import { renderer } from "./core/renderer";
import { light } from "./core/light";
import { ground, roadTexture, leftWall, rightWall } from "./objects/ground";
import { Robot } from "./objects/robot";
import { Keys, setupKeyboardListeners } from "./input/keyboard";
import { setupTouchControls } from "./input/touch";
import { loadAnimatedRobot } from "./objects/animatedRobot";
import { Coin } from "./objects/coins";
import { Obstacle } from "./objects/obstacles";
import { createSparkleEffect } from "./objects/sparkle";
import { boxCollision } from "./utils/collision";
import { playBackgroundMusic, stopBackgroundMusic } from "./audio/sound";
import {
  createTimerElement,
  createScoreElement,
  createGameOverOverlay,
  createStartButton,
} from "./utils/ui";

let gameStarted = false;

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
const timerElement = createTimerElement();
const scoreElement = createScoreElement();
const gameOverOverlay = createGameOverOverlay();

const roadWidth = ground.width;
const totalItems = 50;

for (let i = 0; i < totalItems; i++) {
  const x = (Math.random() - 0.5) * (roadWidth - 1);
  const z = -5 - Math.random() * 1300;

  const isCoin = Math.random() < 0.6;

  if (isCoin) {
    const coin = new Coin({ x, y: 0.5, z });
    coins.push(coin);
    scene.add(coin);
  } else {
    const obs = new Obstacle({ x, y: 0.5, z });
    obstacles.push(obs);
    scene.add(obs);
  }
}

loadAnimatedRobot(scene, ({ model, mixer: loadedMixer }) => {
  scene.remove(robot);
  robot = model;
  mixer = loadedMixer;
  robot.velocity = { x: 0, y: 0, z: 0 };

  createStartButton(() => {
    gameStarted = true;
    playBackgroundMusic();
    renderer.setAnimationLoop(() => animate(robot));
  });

  renderer.setAnimationLoop(() => animate(robot));
});

function animate(robot) {
  const delta = clock.getDelta();
  if (!gameStarted) return;
  timeLeft -= delta;
  if (timeLeft <= 0) {
    stopBackgroundMusic();
    endGame("⏱️ Time's up!", true);
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
  robot.position.x = Math.max(
    -halfRoad + 0.5,
    Math.min(halfRoad - 0.5, robot.position.x)
  );

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

      const sparkle = createSparkleEffect(coin.position.clone());
      sparkles.push(sparkle);
      scene.add(sparkle);
    }
  }

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
      endGame("💥 You hit an obstacle!", false);
      renderer.setAnimationLoop(null);
      return;
    }
  }

  for (let i = sparkles.length - 1; i >= 0; i--) {
    const sparkle = sparkles[i];
    sparkle.update(delta);

    if (sparkle.dead) {
      scene.remove(sparkle);
      sparkles.splice(i, 1);
    }
  }

  camera.position.set(
    robot.position.x,
    robot.position.y + 3,
    robot.position.z + 5
  );
  camera.lookAt(robot.position);

  renderer.render(scene, camera);
}

function endGame(message, celebrate = false) {
  renderer.setAnimationLoop(null);
  gameOverOverlay.innerHTML = `
    ${
      celebrate
        ? `<div style="font-size:32px; margin-bottom:10px;">🎉 Congratulations! 🎉</div>`
        : ""
    }
      <div>${message}</div>
    
      <div>Final Score: ${score}</div>
    ${
      celebrate
        ? `<div style="font-size:20px; color:#ffd700;">✨ You did great! ✨</div>`
        : ""
    }
      <button id="restartBtn" style="margin-top:15px;padding:10px 20px;font-size:18px;cursor:pointer">🔁 Play Again</button>
    `;
  gameOverOverlay.style.display = "block";

  document.getElementById("restartBtn").onclick = () => {
    location.reload();
  };
}
