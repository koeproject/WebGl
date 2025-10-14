import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { degToRad } from "three/src/math/MathUtils.js";
import WorkgroupInfoNode from "three/src/nodes/gpgpu/WorkgroupInfoNode.js";

class BlockSphere {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //scene + camera
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0f17);
    this.camera = new THREE.PerspectiveCamera();
    this.camera.position.set(2.2, 1.6, 2.2);
    this.scene.add(this.camera);

    //control with mouse
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    //light
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(2, 2, 1);
    this.scene.add(dir);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    //blank sphere
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0x0b1730,
        emissive: 0x0b1730,
        transparent: true,
        opacity: 0.12,
      })
    );

    this.group.add(shell)
    this.group.add(this.makeGrid())
    this.group.add(this.makeEquator())
    this.group.add(new THREE.AxesHelper(1.3))
    window.addEventListener('resize', () => this.resize())
    this.resize()
  }

  makeGrid(){
    const g = new THREE.Group()
    const mat = new THREE.LineBasicMaterial({color: 0x32538a, transparent: true, opacity: 0.55})

    //latitudde 
    for(let lat=-60;lat<=60;lat+=30){
        const r = Math.cos(THREE.MathUtils.degToRad(lat))
        const y = Math.sin(THREE.MathUtils.degToRad(lat))
        const curve = new THREE.EllipseCurve(0,0,r,r,0,2*Math.PI)
        const pts = curve.getPoints(200).map(p=>new THREE.Vector3(p.x,0,p.y))
        const geom = new THREE.BufferGeometry().setFromPoints(pts)
        loop.position.y = y
        g.add(loop)
    }

    //longtitude
    for(let long=0;long<180;long+=15){
        const pts=[]
        for(let t=0;t<=180;1++){
            const th = THREE.MathUtils.degToRad(t-90)
            const y = Math.sin(th)
            const r = Math.cos(th)
            const x = r * Math.cos(THREE.MathUtils.degToRad(long))
            const z = r* Math.sin(THREE.MathUtils,degToRad(long))
            pts.push(new THREE.Vector3(x,y,z))
        }
        const geom = new THREE.BufferGeometry().setFromPoints(pts)
        g.add(new THREE.Line(geom,mat))
    }
  }

  //make equator function 
  makeEquator(){
    const c = new THREE.EllipseCurve(0,0,1.001,1.001,0,2*Math.PI)
    const pts = c.getPoints(240).map(p => new THREE.Vector3(p.x,0,p.y))
    const geom = new THREE.BufferGeometry().setFromPoints(pts)
    return new THREE.LineLoop(geom, new THREE.LineBasicMaterial({ color: 0x60a5fa }))
  }

  //confgiure resize
  resize(){
    const c = this.renderer.domElement;
    const w = c.clientWidth, h = c.clientHeight || 1
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w/Math.max(1,h)
    this.camera.updateProjectionMatrix()
  }

  render(){
    this.controls.update()
    this.renderer.render(this.scene,this.camera)
  }

}
export { BlockSphere };

