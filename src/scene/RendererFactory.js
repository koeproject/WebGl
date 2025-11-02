import * as THREE from "three";

export function createSceneAndCamera(opts = {}) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(opts.background ?? 0x1a1a1a);

  const camera = new THREE.PerspectiveCamera(45, 2, 0.01, 100);
  camera.position.set(2.2, 1.6, 2.2);
  scene.add(camera);

  // lighting
  scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.9));
  const dir = new THREE.DirectionalLight(0xffffff, 0.7);
  dir.position.set(2, 2, 1);
  scene.add(dir);

  return { scene, camera };
}

export function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  return renderer;
}
