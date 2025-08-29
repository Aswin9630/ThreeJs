import * as THREE from "three";

export const light = new THREE.AmbientLight(0xffffff, 3);
light.castShadow = true;
light.position.set(0, 1, 1);
