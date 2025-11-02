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

// create sprite text from canvas
function makeTextSprite(
  text,
  {
    font = "10px Inter, system-ui, sans-serif",
    color = "#e5e7eb",
    padding = 6,
    scale = 0.18,
  } = {}
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = font;

  const w = Math.ceil(ctx.measureText(text).width + padding * 2);
  const h = Math.ceil(parseInt(font, 10) + padding * 2);
  canvas.width = w * 2;
  canvas.height = h * 2;

  const ctx2 = canvas.getContext("2d");
  ctx2.font = font;
  ctx2.scale(2, 2);
  ctx2.fillStyle = color;
  ctx2.textBaseline = "middle";
  ctx2.fillText(text, padding, h / 2);

  const tex = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true })
  );
  sprite.scale.set(scale * (w / h), scale, 1);
  sprite.material.depthTest = false;

  return sprite;
}

export function makeAxisLabels({ radius = 1.1, color = "#334155" } = {}) {
  const g = new THREE.Group();
  const add = (t, x, y, z) => {
    const s = makeTextSprite(t, { color });
    s.position.set(x, y, z);
    g.add(s);
  };
  // Z
  add("|0⟩", 0, +radius, 0);
  add("|1⟩", 0, -radius, 0);
  // X
  add("|+⟩", +radius, 0, 0);
  add("|−⟩", -radius, 0, 0);
  // Y
  add("|i⟩", 0, 0, +radius);
  add("|−i⟩", 0, 0, -radius);
  return g;
}

export class StateLine {
  constructor({
    length = 1.0,
    xColor = 0x93c5fd,
    yColor = 0xfda4af,
    zColor = 0xbbf7d0,
  } = {}) {
    this.group = new THREE.Group();
    this.makeLines(length, xColor, yColor, zColor);
  }

  makeLines(length, xColor, yColor, zColor) {
    const makeMat = (color) =>
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.95,
        depthTest: false,
      });

    const makeLine = (a, b, mat) => {
      const geom = new THREE.BufferGeometry().setFromPoints([a, b]);
      return new THREE.Line(geom, mat);
    };

    const matX = makeMat(xColor);
    const matY = makeMat(yColor);
    const matZ = makeMat(zColor);

    const refX = makeLine(
      new THREE.Vector3(+length, 0, 0),
      new THREE.Vector3(-length, 0, 0),
      matX
    );

    const refY = makeLine(
      new THREE.Vector3(0, 0, +length),
      new THREE.Vector3(0, 0, -length),
      matY
    );

    const refZ = makeLine(
      new THREE.Vector3(0, +length, 0),
      new THREE.Vector3(0, -length, 0),
      matZ
    );

    this.group.add(refX, refY, refZ);
  }

  getObject3D() {
    return this.group;
  }
}
