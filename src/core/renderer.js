import * as THREE from "three";

const canvas = document.getElementById("gameCanvas");
export const renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
