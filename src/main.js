import * as THREE from "three";
import "./style.css";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const canvas = document.getElementById("gameCanvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);


const control = new OrbitControls(camera, renderer.domElement);

class Box extends THREE.Mesh {
  constructor({
    width,
    height,
    depth,
    color = 0x00ff00,
    velocity = {
      x: 0,
      y: 0,
      z: 0,
    },
    position = { x: 0, y: 0, z: 0 },
  }) {
    super(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshPhongMaterial({ color })
    );
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.position.set(position.x, position.y, position.z);
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.velocity = velocity;
    this.gravity = -0.005;
  }
  update(ground) {
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;

    this.position.x += this.velocity.x;
    this.position.z += this.velocity.z;
    this.applyGravity();
  }
  applyGravity() {
    this.velocity.y += this.gravity;
    if (this.bottom + this.velocity.y <= ground.top) {
      this.velocity.y *= 0.8;
      this.velocity.y = -this.velocity.y;
    } else {
      this.position.y += this.velocity.y;
    }
  }
}

const cube = new Box({
  width: 1,
  height: 1,
  depth: 1,
  velocity: {
    x: 0,
    y: -0.01,
    z: 0,
  },
});
cube.castShadow = true;
scene.add(cube);

const textureLoader = new THREE.TextureLoader();
const roadTexture = textureLoader.load("/road.jpg");
roadTexture.wrapS = THREE.RepeatWrapping;
roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(1, 40);

const ground = new Box({
  width: 10,
  height: 0.5,
  depth: 200, // long track
  color: 0x0000ff,
  position: { x: 0, y: -2, z: -100 },
});
ground.material.map = roadTexture;
ground.material.needsUpdate = true;
ground.position.z += 0.01;
ground.receiveShadow = true;
scene.add(ground);

const Keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
};

window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyA":
      Keys.a.pressed = true;
      break;
    case "KeyD":
      Keys.d.pressed = true;
      break;
    case "KeyW":
      Keys.w.pressed = true;
      break;
    case "KeyS":
      Keys.s.pressed = true;
      break;
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyA":
      Keys.a.pressed = false;
      break;
    case "KeyD":
      Keys.d.pressed = false;
      break;
    case "KeyW":
      Keys.w.pressed = false;
      break;
    case "KeyS":
      Keys.s.pressed = false;
      break;
  }
});

const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;
light.position.y = 3;
light.position.z = 2;
scene.add(light);

camera.position.z = 5;

function animate() {
  cube.velocity.z = -0.01;
  renderer.render(scene, camera);
  cube.update(ground);
  camera.position.z = cube.position.z + 5;
  camera.position.x = cube.position.x;
  camera.position.y = cube.position.y + 2;
  camera.lookAt(cube.position);

  cube.velocity.x = 0;
  if (Keys.a.pressed) cube.velocity.x = -0.01;
  else if (Keys.d.pressed) cube.velocity.x = 0.01;
  if (Keys.w.pressed) cube.velocity.z = -0.01;
  else if (Keys.s.pressed) cube.velocity.z = 0.01;
}
renderer.setAnimationLoop(animate);
