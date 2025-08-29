import { Box } from "./box.js";
import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();
export const roadTexture = textureLoader.load("/road.jpg");
roadTexture.wrapS = THREE.RepeatWrapping;
roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(1, 4);

export const ground = new Box({
  width: 10,
  height: 1,
  depth: 800,
  color: 0xffffff,
  position: { x: 0, y: -2, z: -100 },
});
ground.material.map = roadTexture;
ground.position.z += 0.01;
ground.receiveShadow = true;
