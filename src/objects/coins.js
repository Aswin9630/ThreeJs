import * as THREE from "three";

export class Coin extends THREE.Mesh {
  constructor({ x = 0, y = 0.5, z = 0 }) {
    const geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    super(geometry, material);

    this.position.set(x, y, z);
    this.rotation.x = Math.PI / 2; // rotate to stand upright

    this.boundingBox = new THREE.Box3().setFromObject(this);
  }

  update() {
    this.rotation.z += 0.1; // spin
    this.boundingBox.setFromObject(this);
  }
}
