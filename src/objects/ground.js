import { Box } from "./box.js";
import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();
export const roadTexture = textureLoader.load("/road.jpg");
roadTexture.wrapS = THREE.RepeatWrapping;
roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(1, 4);

export const ground = new Box({
  width: 20,
  height: 1,
  depth: 800,
  color: 0xffffff,
  position: { x: 0, y: -2, z: -100 },
});
ground.material.map = roadTexture;
ground.position.z += 0.01;
ground.receiveShadow = true;



const wallTexture = textureLoader.load("/plasterWall.png"); 
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1, 20);

export const leftWall = new Box({
  width: 1,
  height: 6,
  depth: 800,
  position: { x: -5.5, y: 1, z: -100 },
});
leftWall.material.map = wallTexture;
leftWall.material.color.set(0xffffff);
leftWall.receiveShadow = true;

export const rightWall = new Box({
  width: 1,
  height: 6,
  depth: 800,
  position: { x: 5.5, y: 1, z: -100 },
});
rightWall.material.map = wallTexture;
rightWall.material.color.set(0xffffff);
rightWall.receiveShadow = true;



const halfGround = ground.width / 2;
leftWall.position.x = -halfGround - leftWall.width / 2;
leftWall.position.y = 1;
leftWall.position.z = -100;

rightWall.position.x = halfGround + rightWall.width / 2;
rightWall.position.y = 1;
rightWall.position.z = -100;
