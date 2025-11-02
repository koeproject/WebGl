import * as THREE from "three";

//State |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩

// convert angle (θ, φ) to Bloch (x, y, z)
// x = sinθ cosφ, z = cosθ, y = sinθ sinφ
export function fromAngle(theta, phi) {
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);
  return [x, y, z];
}

// point to angle (x, y, z) to (θ, φ)
// θ = arccos(Z), φ = atan2(y, x)
export function toAngle([x, y, z]) {
  const theta = Math.acos(Math.max(-1, Math.min(1, z)));
  const phi = Math.atan2(y, x);
  return [theta, phi];
}

//rotate axis x/y/z
function rotateAxis([x, y, z], axis, alpha) {
  if (axis === "x") {
    const y1 = Math.cos(alpha) * y - Math.sin(alpha) * z;
    const z1 = Math.sin(alpha) * y + Math.cos(alpha) * z;
    return [x, y1, z1];
  }
  if (axis === "y") {
    const x1 = Math.cos(alpha) * x + Math.sin(alpha) * z;
    const z1 = -(Math.sin(alpha) * x) + Math.cos(alpha) * z;
    return [x1, y, z1];
  }
  if (axis === "z") {
    const x1 = Math.cos(alpha) * x - Math.sin(alpha) * y;
    const y1 = Math.sin(alpha) * x + Math.cos(alpha) * y;
    return [x1, y1, z];
  }
  return [x, y, z];
}

export function applyGate(v, gate, opt = {}) {
  const a = opt.toAngle;
  switch (gate) {
    case "X":
      return rotateAxis(v, "x", Math.PI);
    case "Y":
      return rotateAxis(v, "y", Math.PI);
    case "Z":
      return rotateAxis(v, "z", Math.PI);
    case "H": {
      const v1 = rotateAxis(v, "z", Math.PI);
      return rotateAxis(v1, "y", Math.PI / 2);
    }
    default:
      return v;
  }
}
