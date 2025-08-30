import * as THREE from "three";

export class Obstacle extends THREE.Mesh {
  constructor({ x = 0, y = 0.5, z = 0 }) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    super(geometry, material);
    this.position.set(x, y, z);
    this.boundingBox = new THREE.Box3().setFromObject(this);
  }

  update() {
    this.position.z += 0.2;
    this.boundingBox.setFromObject(this);
  }
}
