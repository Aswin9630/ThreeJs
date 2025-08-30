import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadAnimatedRobot(scene, onLoaded) {
  const loader = new GLTFLoader();
  loader.load('/runBoy.glb', (gltf) => {
    const model = gltf.scene;

    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    model.rotation.y = Math.PI;

    model.traverse((child) => {
      if (child.isMesh) child.castShadow = true;
    });

    const mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();

    scene.add(model);
    onLoaded({ model, mixer });
  });
}
