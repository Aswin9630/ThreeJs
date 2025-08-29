import * as THREE from "three";

export const light = new THREE.AmbientLight("white", 5);
light.castShadow = true;
light.position.set(0, 1, 1);
