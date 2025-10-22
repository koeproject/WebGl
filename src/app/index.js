import {BlochSphere} from "../scene/BlochSphere.js";

const canvas = document.getElementById("bloch");
const scene = new BlochSphere(canvas, {
  background: 0x0b1020, // background color
  shellColor: 0x2c3e50,  // translucent sphere color
  gridColor:  0x7f8c8d,  // grid lines
  equator:    0x60a5fa   // equator line
});

function loop() {
  scene.resize();  // keep aspect correct if CSS/layout changes
  scene.render();
  requestAnimationFrame(loop);
}
loop();

window.addEventListener("resize", () => scene.resize());
