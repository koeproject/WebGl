import * as THREE from "three";

export function makeEquator({ color = 0x60a5fa } = {}) {
  const c = new THREE.EllipseCurve(0, 0, 1.001, 1.001, 0, 2 * Math.PI);
  const pts = c.getPoints(240).map((p) => new THREE.Vector3(p.x, 0, p.y));
  const geom = new THREE.BufferGeometry().setFromPoints(pts);
  return new THREE.LineLoop(geom, new THREE.LineBasicMaterial({ color }));
}

export function makeGrid({
  latStep = 30,
  longStep = 15,
  color = 0x7f8c8d,
  opacity = 0.55,
} = {}) {
  const g = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });

  // latitude (ไม่รวมขั้ว)
  for (let lat = -90 + latStep; lat <= 90 - latStep; lat += latStep) {
    const r = Math.cos(THREE.MathUtils.degToRad(lat));
    const y = Math.sin(THREE.MathUtils.degToRad(lat));
    const curve = new THREE.EllipseCurve(0, 0, r, r, 0, 2 * Math.PI);
    const pts = curve.getPoints(200).map((p) => new THREE.Vector3(p.x, 0, p.y));
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const loop = new THREE.LineLoop(geom, mat);
    loop.position.y = y;
    g.add(loop);
  }

  // longitude
  for (let lon = 0; lon < 180; lon += longStep) {
    const pts = [];
    for (let t = -180; t <= 180; t++) {
      const th = THREE.MathUtils.degToRad(t - 90);
      const y = Math.sin(th);
      const r = Math.cos(th);
      const x = r * Math.cos(THREE.MathUtils.degToRad(lon));
      const z = r * Math.sin(THREE.MathUtils.degToRad(lon));
      pts.push(new THREE.Vector3(x, y, z));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    g.add(new THREE.Line(geom, mat));
  }
  return g;
}
