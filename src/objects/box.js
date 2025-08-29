import * as THREE from "three";

export class Box extends THREE.Mesh {
  constructor({ width, height, depth, color = 0x0000ff, velocity = { x: 0, y: 0, z: 0 }, position = { x: 0, y: 0, z: 0 } }) {
    super(new THREE.BoxGeometry(width, height, depth), new THREE.MeshPhongMaterial({ color }));
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.position.set(position.x, position.y, position.z);
    this.velocity = velocity;
    this.gravity = -0.009;
    this.updateSides();
  }

  updateSides() {
    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;
    this.bottom = this.position.y - this.height / 2;
    this.top = this.position.y + this.height / 2;
    this.front = this.position.z + this.depth / 2;
    this.back = this.position.z - this.depth / 2;
  }

  applyGravity(ground) {
    this.velocity.y += this.gravity;
    if (this.bottom + this.velocity.y <= ground.top) {
      this.velocity.y *= -0.8;
    } else {
      this.position.y += this.velocity.y;
    }
  }

  update(ground) {
    this.updateSides();
    this.position.x += this.velocity.x;
    this.position.z += this.velocity.z;
    this.applyGravity(ground);
  }
}
