/**
 * Quantum Learn - Application Logic
 * Handles SDK configuration, DOM updates, and user interactivity.
 */

// --- 1. Configurations ---
const defaultConfig = {
  background_color: '#ffffff',
  surface_color: '#f8fbff',
  text_color: '#0f172a',
  primary_action_color: '#3b82f6',
  secondary_action_color: '#64748b',
  font_family: 'Google Sans',
  font_size: 16,
  lesson_title: 'Understanding Qubits',
  lesson_explain: 'A qubit (quantum bit) is the fundamental unit of quantum information. Unlike classical bits that can only be 0 or 1, a qubit can exist in a superposition of both states simultaneously. This unique property is what gives quantum computers their incredible computational power.',
  next_btn: 'Next Lesson'
};

// --- 2. Element UI Updater ---
// Updates DOM elements when the configuration changes (e.g., via SDK)
async function onConfigChange(config) {
  const c = { ...defaultConfig, ...config };
  const font = c.font_family || defaultConfig.font_family;
  const base = c.font_size || defaultConfig.font_size;
  const stack = `${font}, 'Google Sans', sans-serif`;

  // Update typography and text content
  const titleEl = document.getElementById('lesson-title');
  titleEl.textContent = c.lesson_title;
  titleEl.style.fontFamily = stack;
  titleEl.style.fontSize = `${base * 1.5}px`;
  titleEl.style.color = c.text_color;

  const explainEl = document.getElementById('lesson-explanation');
  explainEl.textContent = c.lesson_explain;
  explainEl.style.fontFamily = stack;
  explainEl.style.fontSize = `${base}px`;
  explainEl.style.color = c.secondary_action_color;

  // Update Call-to-Action button
  const nextBtn = document.getElementById('next-btn');
  nextBtn.querySelector('span').textContent = c.next_btn;
  nextBtn.style.background = c.primary_action_color;
  nextBtn.style.fontFamily = stack;
  nextBtn.style.fontSize = `${base * 0.875}px`;

  // Update Headings
  document.querySelectorAll('h2').forEach(h => {
    h.style.fontFamily = stack;
    h.style.fontSize = `${base * 1.125}px`;
    h.style.color = c.text_color;
  });

  // Update Sidebar and Navigation Fonts
  document.getElementById('sidebar').style.background = c.surface_color;
  document.querySelectorAll('#sidebar button').forEach(btn => {
    btn.style.fontFamily = stack;
    btn.style.fontSize = `${base * 0.875}px`;
  });

  // Update Backgrounds
  document.querySelector('header').style.background = c.background_color;
  document.getElementById('app-wrapper').style.background = c.background_color;

  // Update Text Colors
  document.querySelectorAll('label, .text-xs, .text-sm').forEach(el => {
    // Check computed styles or specific string matches to safely replace muted colors
    if (el.style.color === 'rgb(148, 163, 184)' || el.style.color === '#94a3b8') {
      el.style.color = c.secondary_action_color;
    }
  });

  // Update Slider Accent
  document.getElementById('prob-slider').style.accentColor = c.primary_action_color;
}

// --- 3. SDK Mappings ---
function mapToCapabilities(config) {
  const c = { ...defaultConfig, ...config };

  function colorMutable(key) {
    return {
      get: () => config[key] || defaultConfig[key],
      set: (v) => { config[key] = v; window.elementSdk.setConfig({ [key]: v }); }
    };
  }

  return {
    recolorables: [
      colorMutable('background_color'),
      colorMutable('surface_color'),
      colorMutable('text_color'),
      colorMutable('primary_action_color'),
      colorMutable('secondary_action_color')
    ],
    borderables: [],
    fontEditable: {
      get: () => config.font_family || defaultConfig.font_family,
      set: (v) => { config.font_family = v; window.elementSdk.setConfig({ font_family: v }); }
    },
    fontSizeable: {
      get: () => config.font_size || defaultConfig.font_size,
      set: (v) => { config.font_size = v; window.elementSdk.setConfig({ font_size: v }); }
    }
  };
}

function mapToEditPanelValues(config) {
  const c = { ...defaultConfig, ...config };
  return new Map([
    ['lesson_title', c.lesson_title],
    ['lesson_explain', c.lesson_explain],
    ['next_btn', c.next_btn]
  ]);
}

// Initialize SDK if available
if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    onConfigChange,
    mapToCapabilities,
    mapToEditPanelValues
  });
}

// --- 4. Interactive Functions ---

/**
 * Updates the probability states based on slider input
 * @param {number|string} value - Slider value (0-100)
 */
function updateProbability(value) {
  const prob0 = parseInt(value, 10);
  const prob1 = 100 - prob0;

  document.getElementById('prob-0').textContent = `${prob0}%`;
  document.getElementById('state-0').textContent = `${prob0}%`;
  document.getElementById('state-1').textContent = `${prob1}%`;
}

/**
 * Handles visual state switching for the sidebar navigation
 * @param {HTMLElement} btn - The clicked button element
 */
function switchLesson(btn) {
  // Remove active state from all buttons
  document.querySelectorAll('#sidebar button').forEach(b => {
    b.classList.remove('nav-item-active');
    b.style.background = 'transparent';
    b.style.color = '#64748b'; // Muted text color
  });

  // Apply active state to the clicked button
  btn.classList.add('nav-item-active');
  btn.style.background = '#eff6ff'; // Active background
  btn.style.color = '#3b82f6';      // Active text color
}

//--------------------------------------------------------------------------------------------------------------------------------------
const lessonsData = [
  {
    title: 'Quantum Computing',
    header: 'ควอนตัมคอมพิวติงคืออะไร?',
    explanation: `ควอนตัมคอมพิวติงคือเทคโนโลยีการประมวลผลรูปแบบใหม่ที่อาศัยหลักการทางฟิสิกส์ควอนตัม <br>แทนที่จะเก็บข้อมูลเป็นบิต (0 หรือ 1) แบบคอมพิวเตอร์ทั่วไป ควอนตัมจะใช้หน่วยข้อมูลที่เรียกว่า <b>คิวบิต (Qubit)</b> ซึ่งสามารถเป็นได้ทั้ง 0 และ 1 พร้อมๆ กัน เราเรียกสถานะนี้ว่า <b>"ซูเปอร์โพสิชัน (Superposition)"</b> โดยคิวบิตจะสุ่มเลือกเป็นค่าใดค่าหนึ่งก็ต่อเมื่อเราทำการ <b>"วัด (Measure)"</b> มันเท่านั้น ลองกดปุ่มด้านล่างเพื่อดูผลลัพธ์ได้เลย!`,
    workspaceHTML: `
      <section class="mb-12">
        <h2 class="text-lg font-semibold mb-6 text-color-main">Bloch Sphere Visualization</h2>`
  },
  // Qubit
  {
    title: 'Understanding Qubits',
    explanation: 'A qubit (quantum bit) is the fundamental unit of quantum information. Unlike classical bits that can only be 0 or 1, a qubit can exist in a superposition of both states simultaneously.',
    header: 'What is a Qubit?',
    workspaceHTML: `
      <section class="mb-12">
        <h2 class="text-lg font-semibold mb-6 text-color-main">Bloch Sphere Visualization</h2>
        <div class="rounded-2xl p-8 flex items-center justify-center visual-container">
          <svg class="bloch-sphere" viewBox="0 0 300 300" width="300" height="300" fill="none">
            <circle cx="150" cy="150" r="100" stroke="#bfdbfe" stroke-width="2" />
            <line x1="150" y1="50" x2="150" y2="250" stroke="#e0e7ff" stroke-width="1" stroke-dasharray="4 4" />
            <line x1="150" y1="150" x2="200" y2="120" stroke="#3b82f6" stroke-width="2.5" />
            <circle cx="200" cy="120" r="5" fill="#3b82f6" />
            <text x="150" y="40" text-anchor="middle" fill="#3b82f6" class="sphere-text">|0⟩</text>
            <text x="150" y="270" text-anchor="middle" fill="#3b82f6" class="sphere-text">|1⟩</text>
          </svg>
        </div>
      </section>
      
      <section>
        <h2 class="text-lg font-semibold mb-6 text-color-main">Qubit Probability Slider</h2>
        <div class="rounded-2xl p-8 interactive-container">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-color-main">Probability of |0⟩</label>
            <span id="prob-0" class="text-sm font-semibold prob-text">50%</span>
          </div>
          <input type="range" min="0" max="100" value="50" class="w-full h-2 rounded-lg custom-slider" oninput="updateProbability(this.value)">
          <div class="grid grid-cols-2 gap-4 mt-6">
            <div class="rounded-lg p-4 state-box">
              <p class="text-xs mb-1 text-color-muted">State |0⟩</p>
              <p id="state-0" class="text-lg font-bold prob-text">50%</p>
            </div>
            <div class="rounded-lg p-4 state-box">
              <p class="text-xs mb-1 text-color-muted">State |1⟩</p>
              <p id="state-1" class="text-lg font-bold text-blue-400">50%</p>
            </div>
          </div>
        </div>
      </section>
    `
  },

  // Superposition
  {
    title: 'Quantum Superposition',
    explanation: 'Superposition is the ability of a quantum system to be in multiple states at the same time until it is measured. It is neither purely 0 nor 1 until you look at it!',
    workspaceHTML: `
      <section>
        <h2 class="text-lg font-semibold mb-6 text-color-main">Measurement Simulator</h2>
        <div class="rounded-2xl p-8 interactive-container text-center">
          <div class="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6" style="background: linear-gradient(45deg, #3b82f6, #93c5fd); animation: rotate-3d 3s linear infinite;">
            <span class="text-white font-bold text-2xl font-mono">?</span>
          </div>
          <p class="text-sm text-color-muted mb-6">The qubit is currently in a superposition state of |0⟩ and |1⟩.</p>
          <button onclick="alert('You measured the qubit! The state collapsed to: ' + (Math.random() > 0.5 ? '|1⟩' : '|0⟩'))" class="px-6 py-3 rounded-full text-sm font-semibold btn-primary">
            Measure Qubit
          </button>
        </div>
      </section>
    `
  },

  // Entanglement
  {
    title: 'Quantum Entanglement',
    explanation: 'Entanglement occurs when particles interact such that the quantum state of each particle cannot be described independently. Measuring one instantly determines the state of the other.',
    workspaceHTML: `
      <section>
        <h2 class="text-lg font-semibold mb-6 text-color-main">Entangled Particles</h2>
        <div class="rounded-2xl p-8 interactive-container flex flex-col items-center">
          <div class="flex items-center justify-center gap-12 w-full mb-8">
            <div class="w-20 h-20 rounded-full border-4 border-blue-400 flex items-center justify-center animate-pulse">
              <span class="font-bold text-blue-500">A</span>
            </div>
            <div class="h-1 flex-1 bg-blue-200" style="background-image: repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 10px, transparent 10px, transparent 20px);"></div>
            <div class="w-20 h-20 rounded-full border-4 border-blue-400 flex items-center justify-center animate-pulse">
              <span class="font-bold text-blue-500">B</span>
            </div>
          </div>
          <p class="text-sm text-color-muted text-center">These two qubits are entangled. Their states are linked regardless of distance.</p>
        </div>
      </section>
    `
  },

  // Pauli Gates
  {
    title: 'Pauli Gates',
    explanation: 'Pauli gates are fundamental quantum gates that perform rotations around the X, Y, and Z axes of the Bloch sphere.',
    workspaceHTML: `
      <section>
        <h2 class="text-lg font-semibold mb-6 text-color-main">Pauli Gates</h2>
        <div class="rounded-2xl p-8 interactive-container flex flex-col items-center">
          <div class="flex items-center justify-center gap-12 w-full mb-8">
            <div class="w-20 h-20 rounded-full border-4 border-blue-400 flex items-center justify-center animate-pulse">
              <span class="font-bold text-blue-500">A</span>
            </div>
            <div class="h-1 flex-1 bg-blue-200" style="background-image: repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 10px, transparent 10px, transparent 20px);"></div>
            <div class="w-20 h-20 rounded-full border-4 border-blue-400 flex items-center justify-center animate-pulse">
              <span class="font-bold text-blue-500">B</span>
            </div>
          </div>
          <p class="text-sm text-color-muted text-center">These two qubits are entangled. Their states are linked regardless of distance.</p>
        </div>
      </section>
    `
  },

  // Rotation Gates
  {
    title: 'Rotation Gates',
    explanation: 'Rotation gates are quantum gates that perform rotations around the X, Y, and Z axes of the Bloch sphere.',
    workspaceHTML: `
      <section>
        <h2 class="text-lg font-semibold mb-6 text-color-main">Rotation Gates</h2>
        <div class="rounded-2xl p-8 interactive-container flex flex-col items-center">
          <div class="flex items-center justify-center gap-12 w-full mb-8">
            <div class="w-20 h-20 rounded-full border-4 border-blue-400 flex items-center justify-center animate-pulse">
              <span class="font-bold text-blue-500">A</span>
            </div>
            <div class="h-1 flex-1 bg-blue-200" style="background-image: repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 10px, transparent 10px, transparent 20px);"></div>
            <div class="w-20 h-20 rounded-full border-4 border-blue-400 flex items-center justify-center animate-pulse">
              <span class="font-bold text-blue-500">B</span>
            </div>
          </div>
          <p class="text-sm text-color-muted text-center">These two qubits are entangled. Their states are linked regardless of distance.</p>
        </div>
      </section>
    `
  }

];

let currentLessonIndex = 0;

function loadLesson(index) {
  if (index < 0 || index >= lessonsData.length) return; 
  
  currentLessonIndex = index;
  const lesson = lessonsData[index];

  // 1. เปลี่ยนข้อความหลัก
  document.getElementById('lesson-title').textContent = lesson.title;
  document.getElementById('lesson-explanation').innerHTML = lesson.explanation;
  document.getElementById('lesson-header').textContent = lesson.header;

  // 2. เสียบ (Inject) โค้ด HTML ของกราฟิกใหม่ลงในพื้นที่ว่าง
  document.getElementById('dynamic-workspace').innerHTML = lesson.workspaceHTML;

  // 3. จัดการสถานะเมนูด้านซ้าย
  const navButtons = document.querySelectorAll('#sidebar .nav-btn');
  navButtons.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('nav-item-active');
      btn.style.background = '#eff6ff';
      btn.style.color = '#3b82f6';
    } else {
      btn.classList.remove('nav-item-active');
      btn.style.background = 'transparent';
      btn.style.color = '#64748b';
    }
  });

  // 4. ซ่อน/แสดงปุ่ม Next
  const nextBtn = document.getElementById('next-btn');
  if (index === lessonsData.length - 1) {
    nextBtn.style.display = 'none';
  } else {
    nextBtn.style.display = 'inline-flex';
  }
}

function goToNextLesson() {
  loadLesson(currentLessonIndex + 1);
}

// โหลดบทเรียนแรกเมื่อเปิดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
  loadLesson(0);
});

// --- 5. Initialization ---
// Render Lucide icons on page load
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
});