import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  makeGrid,
  makeEquator,
  makeAxisLabels,
  StateLine,
} from "./GridFactory.js";
import { createSceneAndCamera, createRenderer } from "./RendererFactory.js";

export class BlochSphere {
  constructor(canvas, opts = {}) {
    this.renderer = createRenderer(canvas);
    const { scene, camera } = createSceneAndCamera(opts);
    this.scene = scene;
    this.camera = camera;

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // root
    this.root = new THREE.Group();
    this.scene.add(this.root);

    // translucent shell
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({
        color: opts.shellColor ?? 0xcbd5e1,
        emissive: opts.shellColor ?? 0xcbd5e1,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      })
    );

    this.root.add(shell);
    this.root.add(
      makeGrid({ color: opts.gridColor ?? 0xd1d5db, opacity: 0.55 })
    );
    this.root.add(makeEquator({ color: opts.equator ?? 0x60a5fa }));
    this.root.add(makeAxisLabels({ radius: 1.1, color: "#334155" }));

    // arrow vector in bloch
    this.arrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      1.0,
      opts.arrowColor ?? 0x2563eb,
      0.12,
      0.08
    );
    this.root.add(this.arrow);

    // add state lines
    const stateLine = new StateLine();
    this.root.add(stateLine.getObject3D());

    // state in Bloch
    this.bloch = [0, 0, 1];

    this.resize();
  }
  setBlochVector([x, y, z]) {
    const L = Math.hypot(x, y, z) || 1;
    const vx = x / L,
      vy = y / L,
      vz = z / L;
    this._bloch = [vx, vy, vz];

    // set |0> on top 
    const dir = new THREE.Vector3(vx, vz,vy);
    this.arrow.setDirection(dir.normalize());
    this.arrow.setLength(1.05, 0.12, 0.08);
  }
  // current state bloch vector  
  getBlochVector() {
    return this._bloch.slice();
  }

  applyGateAndUpdate(applyGateFn, gate, opt = {}) {
    const next = applyGateFn(this.getBlochVector(), gate, opt);
    this.setBlochVector(next);
  }

  resize() {
    const c = this.renderer.domElement;
    const w = c.clientWidth || 1;
    const h = c.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(1, h);
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
