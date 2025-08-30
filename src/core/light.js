import * as THREE from "three";

export const light = new THREE.AmbientLight("white", 5);
light.position.set(0, 1, 1);

export const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
