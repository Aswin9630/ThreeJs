import * as THREE from "three";
import { Box } from "./box.js";

export class Robot extends THREE.Group {
  constructor() {
    super();

    this.velocity = { x: 0, y: -0.01, z: 0 };
    this.gravity = -0.009;

    const body = new Box({ width: 0.8, height: 1.2, depth: 1, color: 0x5555ff });
    const head = new Box({
      width: 0.4,
      height: 0.3,
      depth: 0.6,
      color: 0xddddff,
      position: { x: 0, y: 1.2, z: 0 },
    });

      const legHeight = 9.2;
    const leftLeg = new Box({
      width: 0.3,
      height: legHeight,
      depth: 0.3,
      color: "yellow",
      position: { x: -0.3, y: -legHeight / 2 - 0.75, z: 0 },
    });
    const rightLeg = new Box({
      width: 0.3,
      height: legHeight,
      depth: 0.3,
      color: "yellow",
      position: { x: 0.3, y: -legHeight / 2 - 0.75, z: 0 },
    });

    this.add(body, head, leftLeg, rightLeg);
    this.position.set(0, 0, 0);
    this.castShadow = true;
  }

  update(ground) {
    this.velocity.y += this.gravity;
    if (this.position.y + this.velocity.y <= ground.top + 1) {
      this.velocity.y *= -0.8;
    } else {
      this.position.y += this.velocity.y;
    }

    this.position.x += this.velocity.x;
    this.position.z += this.velocity.z;
  }
}
