
// ==========================================
// 1. Global State & Data
// ==========================================
let state = {
    theta: Math.PI / 2, // 90 degrees
    phi: 0,
    stateBlend: 0.5     // 0 = |0⟩, 1 = |1⟩
};

// เก็บชุดข้อมูล HTML สำหรับเปลี่ยนหน้าตา Visualization
const vizData = {
    bloch: `
    <div class="rounded-2xl p-8 flex items-center justify-center mb-8 bg-[#f8fbff] border-[1.5px] border-[#e8eef6] w-full max-w-[420px] aspect-square">
      <svg id="bloch-sphere" class="bloch-sphere max-w-[380px]" viewBox="0 0 300 300" width="100%" height="100%" fill="none">
        <circle cx="150" cy="150" r="100" fill="none" stroke="#bfdbfe" stroke-width="2" />
        <line x1="150" y1="50" x2="150" y2="250" stroke="#e0e7ff" stroke-width="1" stroke-dasharray="4 4" />
        <line x1="50" y1="150" x2="250" y2="150" stroke="#e0e7ff" stroke-width="1" stroke-dasharray="4 4" />
        <line x1="118" y1="82" x2="182" y2="218" stroke="#e0e7ff" stroke-width="1" stroke-dasharray="4 4" />
        <line id="bloch-vector" x1="150" y1="150" x2="200" y2="120" stroke="#3b82f6" stroke-width="3" class="animate-pulse-glow" />
        <circle id="bloch-tip" cx="200" cy="120" r="6" fill="#3b82f6" class="animate-pulse-glow" />
        <circle cx="150" cy="150" r="3" fill="#3b82f6" />
        <text x="150" y="35" text-anchor="middle" fill="#3b82f6" font-size="13" font-family="Space Mono" font-weight="700">|0⟩</text>
        <text x="150" y="275" text-anchor="middle" fill="#3b82f6" font-size="13" font-family="Space Mono" font-weight="700">|1⟩</text>
        <text x="25" y="157" text-anchor="middle" fill="#3b82f6" font-size="12" font-family="Space Mono" font-weight="700">-X</text>
        <text x="275" y="157" text-anchor="middle" fill="#3b82f6" font-size="12" font-family="Space Mono" font-weight="700">+X</text>
      </svg>
    </div>
    <div class="rounded-2xl p-6 w-full max-w-sm bg-[#f8fbff] border-[1.5px] border-[#e8eef6]">
      <h3 class="text-sm font-semibold mb-4 text-[#0f172a]">Probability Amplitudes</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="rounded-lg p-4 bg-white border-[1.5px] border-[#e8eef6]">
          <p class="text-xs mb-2 font-mono text-[#94a3b8]">|0⟩</p>
          <p id="prob-0-display" class="text-lg font-bold font-mono text-[#3b82f6]">0.707</p>
          <p id="prob-0-percent" class="text-xs mt-1 font-mono text-[#60a5fa]">50.0%</p>
        </div>
        <div class="rounded-lg p-4 bg-white border-[1.5px] border-[#e8eef6]">
          <p class="text-xs mb-2 font-mono text-[#94a3b8]">|1⟩</p>
          <p id="prob-1-display" class="text-lg font-bold font-mono text-[#60a5fa]">0.707</p>
          <p id="prob-1-percent" class="text-xs mt-1 font-mono text-[#93c5fd]">50.0%</p>
        </div>
      </div>
    </div>
  `,
    phase: `
    <div class="rounded-2xl p-8 flex items-center justify-center mb-8 bg-[#f8fbff] border-[1.5px] border-[#e8eef6] w-full max-w-[420px] aspect-square">
      <svg id="phase-sphere" class="bloch-sphere max-w-[380px]" viewBox="0 0 300 300" width="100%" height="100%" fill="none">
        <circle cx="150" cy="150" r="100" fill="none" stroke="#bfdbfe" stroke-width="2" />
        <circle cx="150" cy="150" r="75" fill="none" stroke="#e0e7ff" stroke-width="1" stroke-dasharray="4 4" />
        <circle cx="150" cy="150" r="50" fill="none" stroke="#e0e7ff" stroke-width="1" stroke-dasharray="4 4" />
        <circle cx="150" cy="150" r="25" fill="none" stroke="#e0e7ff" stroke-width="1" stroke-dasharray="4 4" />
        <line x1="150" y1="50" x2="150" y2="250" stroke="#e0e7ff" stroke-width="1" stroke-dasharray="4 4" />
        <line x1="50" y1="150" x2="250" y2="150" stroke="#e0e7ff" stroke-width="1" stroke-dasharray="4 4" />
        <line x1="86" y1="86" x2="214" y2="214" stroke="#e0e7ff" stroke-width="1" stroke-dasharray="4 4" />
        <line x1="214" y1="86" x2="86" y2="214" stroke="#e0e7ff" stroke-width="1" stroke-dasharray="4 4" />
        <line id="phase-vector" x1="150" y1="150" x2="200" y2="120" stroke="#3b82f6" stroke-width="3" class="animate-pulse-glow" />
        <circle id="phase-tip" cx="200" cy="120" r="6" fill="#3b82f6" class="animate-pulse-glow" />
        <circle cx="150" cy="150" r="3" fill="#3b82f6" />
        <text x="150" y="35" text-anchor="middle" fill="#3b82f6" font-size="13" font-family="Space Mono" font-weight="700">0</text>
        <text x="150" y="275" text-anchor="middle" fill="#3b82f6" font-size="13" font-family="Space Mono" font-weight="700">π</text>
        <text x="25" y="157" text-anchor="middle" fill="#3b82f6" font-size="12" font-family="Space Mono" font-weight="700">3π/2</text>
        <text x="275" y="157" text-anchor="middle" fill="#3b82f6" font-size="12" font-family="Space Mono" font-weight="700">π/2</text>
      </svg>
    </div>
    <div class="rounded-2xl p-6 w-full max-w-sm bg-[#f8fbff] border-[1.5px] border-[#e8eef6]">
      <h3 class="text-sm font-semibold mb-4 text-[#0f172a]">Phase Information</h3>
      <div class="space-y-3">
        <div class="flex justify-between items-center"><span class="text-xs text-[#64748b]">Current Phase (φ)</span> <span id="phase-display" class="text-sm font-bold font-mono text-[#3b82f6]">0.00 rad</span></div>
        <div class="flex justify-between items-center"><span class="text-xs text-[#64748b]">Phase Angle</span> <span id="phase-angle-display" class="text-sm font-bold font-mono text-[#3b82f6]">0°</span></div>
      </div>
    </div>
  `,
    state: `
    <div class="rounded-2xl p-8 bg-[#f8fbff] border-[1.5px] border-[#e8eef6] w-full max-w-[500px]">
      <h3 class="text-sm font-semibold mb-6 text-[#0f172a]">State Vector Representation</h3>
      <div class="space-y-4">
        <div>
          <p class="text-xs font-mono mb-2 text-[#64748b]">|ψ⟩ = α|0⟩ + β|1⟩</p>
          <div class="rounded-lg p-4 bg-white border-[1.5px] border-[#e8eef6] font-mono">
            <div class="flex items-center gap-2 mb-2"><span class="text-[#3b82f6] font-bold">α =</span> <span id="alpha-display" class="text-[#0f172a]">0.707</span></div>
            <div class="flex items-center gap-2"><span class="text-[#60a5fa] font-bold">β =</span> <span id="beta-display" class="text-[#0f172a]">0.707</span></div>
          </div>
        </div>
        <div>
          <p class="text-xs font-semibold mb-3 text-[#0f172a]">Amplitude Magnitude</p>
          <div class="space-y-2">
            <div>
              <div class="flex justify-between items-center mb-1"><span class="text-xs text-[#64748b]">|α|</span> <span class="text-xs font-bold text-[#3b82f6]" id="alpha-mag">0.707</span></div>
              <div class="w-full rounded-full h-2 bg-[#e0e7ff] overflow-hidden">
                <div id="alpha-bar" class="h-full rounded-full bg-[#3b82f6]" style="width: 70.7%;"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1"><span class="text-xs text-[#64748b]">|β|</span> <span class="text-xs font-bold text-[#60a5fa]" id="beta-mag">0.707</span></div>
              <div class="w-full rounded-full h-2 bg-[#e0e7ff] overflow-hidden">
                <div id="beta-bar" class="h-full rounded-full bg-[#60a5fa]" style="width: 70.7%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};


// ==========================================
// 2. Navigation & Injection Logic (SPA)
// ==========================================
function loadVisualization(type) {
    // 1. นำ HTML มาเสียบใน Workspace
    document.getElementById('dynamic-viz-workspace').innerHTML = vizData[type];

    // 2. อัปเดตสถานะปุ่มเมนูด้านซ้าย
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        if (btn.dataset.viz === type) {
            btn.style.color = '#3b82f6';
            btn.style.background = '#eff6ff';
        } else {
            btn.style.color = '#64748b';
            btn.style.background = 'transparent';
        }
    });

    // 3. สั่งวาดกราฟิกให้ตรงกับค่า State ปัจจุบัน (สำคัญมาก)
    updateAllViz();

    // 4. (ถ้ามี) โหลด icon ใหม่เผื่อใน HTML ที่ดึงมามี tag lucide
    if (typeof lucide !== 'undefined') lucide.createIcons();
}


// ==========================================
// 3. Math & Update Functions
// ==========================================
// Helper function เพื่อความปลอดภัย ป้องกัน Error ถ้ายัดโค้ดมาแล้วหา Element ไม่เจอ
function safeSet(id, prop, value, isAttr = false) {
    const el = document.getElementById(id);
    if (!el) return;
    if (isAttr) el.setAttribute(prop, value);
    else el[prop] = value;
}

function updateBlochSphere() {
    const theta = state.theta;
    const phi = state.phi;

    const r = 100;
    const x = r * Math.sin(theta) * Math.cos(phi);
    const z = r * Math.cos(theta);
    const svgX = 150 + x;
    const svgY = 150 - z;

    safeSet('bloch-vector', 'x2', svgX, true);
    safeSet('bloch-vector', 'y2', svgY, true);
    safeSet('bloch-tip', 'cx', svgX, true);
    safeSet('bloch-tip', 'cy', svgY, true);

    const prob0 = Math.pow(Math.cos(theta / 2), 2);
    const prob1 = Math.pow(Math.sin(theta / 2), 2);

    safeSet('prob-0-display', 'textContent', prob0.toFixed(3));
    safeSet('prob-1-display', 'textContent', prob1.toFixed(3));
    safeSet('prob-0-percent', 'textContent', (prob0 * 100).toFixed(1) + '%');
    safeSet('prob-1-percent', 'textContent', (prob1 * 100).toFixed(1) + '%');
}

function updatePhaseViz() {
    const r = 100;
    const x = r * Math.cos(state.phi);
    const y = r * Math.sin(state.phi);
    const svgX = 150 + x;
    const svgY = 150 - y;

    safeSet('phase-vector', 'x2', svgX, true);
    safeSet('phase-vector', 'y2', svgY, true);
    safeSet('phase-tip', 'cx', svgX, true);
    safeSet('phase-tip', 'cy', svgY, true);

    safeSet('phase-display', 'textContent', state.phi.toFixed(2) + ' rad');
    safeSet('phase-angle-display', 'textContent', ((state.phi * 180) / Math.PI).toFixed(1) + '°');
}

function updateStateViz() {
    const theta = state.theta;
    const alpha = Math.cos(theta / 2);
    const beta = Math.sin(theta / 2);

    safeSet('alpha-display', 'textContent', alpha.toFixed(3));
    safeSet('beta-display', 'textContent', beta.toFixed(3));
    safeSet('alpha-mag', 'textContent', Math.abs(alpha).toFixed(3));
    safeSet('beta-mag', 'textContent', Math.abs(beta).toFixed(3));

    const alphaBar = document.getElementById('alpha-bar');
    const betaBar = document.getElementById('beta-bar');
    if (alphaBar) alphaBar.style.width = (Math.abs(alpha) * 100) + '%';
    if (betaBar) betaBar.style.width = (Math.abs(beta) * 100) + '%';
}

function updateSliders() {
    const thetaDeg = Math.round((state.theta * 180) / Math.PI);
    const phiDeg = Math.round((state.phi * 180) / Math.PI) % 360;
    const positivePhi = phiDeg >= 0 ? phiDeg : phiDeg + 360;
    const statePercent = Math.round((thetaDeg / 180) * 100);

    safeSet('theta-slider', 'value', thetaDeg);
    safeSet('theta-value', 'textContent', thetaDeg);
    safeSet('phi-slider', 'value', positivePhi);
    safeSet('phi-value', 'textContent', positivePhi);
    safeSet('state-slider', 'value', statePercent);
    safeSet('state-indicator', 'textContent', statePercent + '%');
}

function updateAllViz() {
    updateBlochSphere();
    updatePhaseViz();
    updateStateViz();
}

// ==========================================
// 4. Event Listeners
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Input Sliders
    document.getElementById('theta-slider').addEventListener('input', (e) => {
        state.theta = (parseFloat(e.target.value) * Math.PI) / 180;
        document.getElementById('theta-value').textContent = e.target.value;
        updateAllViz();
    });

    document.getElementById('phi-slider').addEventListener('input', (e) => {
        state.phi = (parseFloat(e.target.value) * Math.PI) / 180;
        document.getElementById('phi-value').textContent = e.target.value;
        updateAllViz();
    });

    document.getElementById('state-slider').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        state.theta = (val / 100) * Math.PI;
        document.getElementById('state-indicator').textContent = val + '%';
        document.getElementById('theta-slider').value = val;
        document.getElementById('theta-value').textContent = Math.round((val / 100) * 180);
        updateAllViz();
    });

    // Quantum Gates
    document.getElementById('gate-x').addEventListener('click', () => {
        state.theta = Math.PI - state.theta;
        state.phi = state.phi + Math.PI;
        updateSliders(); updateAllViz();
    });
    document.getElementById('gate-y').addEventListener('click', () => {
        state.theta = Math.PI - state.theta;
        updateSliders(); updateAllViz();
    });
    document.getElementById('gate-z').addEventListener('click', () => {
        state.phi = state.phi + Math.PI;
        updateSliders(); updateAllViz();
    });
    document.getElementById('gate-h').addEventListener('click', () => {
        state.theta = Math.PI / 2;
        state.phi = state.phi + Math.PI / 4;
        updateSliders(); updateAllViz();
    });

    document.getElementById('reset-btn').addEventListener('click', () => {
        state.theta = Math.PI / 2;
        state.phi = 0;
        updateSliders(); updateAllViz();
    });

    // Initialize First View
    loadVisualization('bloch');
});