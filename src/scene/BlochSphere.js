import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { makeGrid, makeEquator } from "./GridFactory.js";

export class BlochSphere {
  constructor(canvas, opts = {}) {
    // renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // scene & camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(opts.background ?? 0x1a1a1a);
    this.camera = new THREE.PerspectiveCamera(45, 2, 0.01, 100);
    this.camera.position.set(2.2, 1.6, 2.2);
    this.scene.add(this.camera);

    // controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    // lights
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(2, 2, 1);
    this.scene.add(dir);

    // root
    this.root = new THREE.Group();
    this.scene.add(this.root);

    // translucent shell
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({
        color: opts.shellColor ?? 0x2c3e50,
        emissive: opts.shellColor ?? 0x2c3e50,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
      })
    );

    this.root.add(shell);
    this.root.add(
      makeGrid({ color: opts.gridColor ?? 0x7f8c8d, opacity: 0.55 })
    );
    this.root.add(makeEquator({ color: opts.equator ?? 0x60a5fa }));

    //reference line
    // this.root.add(new THREE.AxesHelper(1.0));
    this.addStateLine({
      length: 1.05,
      xColor: 0x3b82f6, // |+>, |−>
      yColor: 0xf97316, // |i>, |-i
      zColor: 0x84cc16, // |0>, |1>
    });

    //resize
    this.resize();
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

  addStateLine({
    length = 1.05,
    xColor = 0x3b82f6, // |+>, |−>
    yColor = 0xf97316, // |i>, |-i   
    zColor = 0x84cc16, // |0>, |1>
  } = {}) {
    const matX = new THREE.LineBasicMaterial({
      color: xColor,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
    });
    const matY = new THREE.LineBasicMaterial({
      color: yColor,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
    });
    const matZ = new THREE.LineBasicMaterial({
      color: zColor,
      transparent: true,
      opacity: 0.95,
      depthTest: false,
    });

    const makeLine = (a, b, mat) => {
      const geom = new THREE.BufferGeometry().setFromPoints([a, b]);
      return new THREE.Line(geom, mat);
    };

    this.refGroup = new THREE.Group();

    //Bloch Z
    this.refZ = makeLine(
      new THREE.Vector3(0, +length, 0),
      new THREE.Vector3(0, -length, 0),
      matZ
    );

    //Bloch X 
    this.refX = makeLine(
      new THREE.Vector3(+length, 0, 0),
      new THREE.Vector3(-length, 0, 0),
      matX
    );

    //Bloch Y 
    this.refY = makeLine(
      new THREE.Vector3(0, 0, +length),
      new THREE.Vector3(0, 0, -length),
      matY
    );

    this.refGroup.add(this.refX, this.refY, this.refZ);
    this.root.add(this.refGroup);
  }
}
