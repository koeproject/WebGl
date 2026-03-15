import { BlochSphere } from "../scene/BlochSphere.js";

const canvas = document.getElementById("bloch");
const scene = new BlochSphere(canvas, {
  background: 0xf8fafc, // soft white
  shellColor: 0xcbd5e1, // sphere wireframe (อ่อน)
  gridColor: 0xd1d5db, // grid lines
  equator: 0x60a5fa, // equator line
  arrowColor: 0x2563eb, // state arrow
});

// start at |0⟩ = (0,0,1)
scene.setBlochVector([0, 0, 1]);

function loop() {
  scene.resize(); // keep aspect correct if CSS/layout changes
  scene.render();
  requestAnimationFrame(loop);
}
loop();

const keyMap = new Map([
  ["x", "X"],
  ["y", "Y"],
  ["z", "Z"],
  ["h", "H"],
]);

window.addEventListener("keydown", (e) => {
  const g = keyMap.get(e.key.toLowerCase());
  if (!g) return;
  e.preventDefault();
  scene.applyGateAndUpdate(applyGate, g);
});
