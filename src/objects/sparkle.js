import * as THREE from "three";

export function createSparkleEffect(position) {
  const geometry = new THREE.SphereGeometry(0.1, 8, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const sparkle = new THREE.Mesh(geometry, material);
  sparkle.position.copy(position);

  let lifetime = 0.5;
  sparkle.update = (delta) => {
    lifetime -= delta;
    sparkle.scale.multiplyScalar(1.1);
    if (lifetime <= 0) sparkle.dead = true;
  };

  return sparkle;
}
