const algorithms = {
    deutsch: {
        name: 'Deutsch Algorithm',
        desc: 'Determine if a function is balanced or constant',
        steps: [
            {
                title: 'Initialize Qubits',
                desc: 'Create two qubits in computational basis states',
                circuit: ['|0⟩', '|1⟩'],
                explanation: 'The Deutsch algorithm starts with two qubits. The first qubit is initialized to |0⟩, and the second is initialized to |1⟩. This state will be used to test the oracle function.',
                amplitudes: null
            },
            {
                title: 'Apply Hadamard Gates',
                desc: 'Create superposition on both qubits',
                circuit: ['H', 'H'],
                explanation: 'Hadamard gates create a superposition of all possible states. After applying H to both qubits, we have an equal superposition: (|0⟩ + |1⟩)/√2 for each qubit. This allows us to query the oracle in superposition.',
                amplitudes: null
            },
            {
                title: 'Apply Oracle Function',
                desc: 'Query the unknown function in superposition',
                circuit: ['H', 'U_f', 'H'],
                explanation: 'The oracle function U_f is applied. This black-box operation encodes whether the function is balanced or constant. The interference pattern created by the oracle will reveal the function property.',
                amplitudes: null
            },
            {
                title: 'Measure Result',
                desc: 'Measure the first qubit to determine function property',
                circuit: ['H', 'U_f', 'H', 'Measure'],
                explanation: 'Measuring the first qubit gives us the answer: 0 if the function is constant, 1 if it\'s balanced. The Deutsch algorithm solves this problem in just one oracle query, exponentially faster than classical algorithms.',
                amplitudes: null
            }
        ]
    },
    grover: {
        name: "Grover's Search Algorithm",
        desc: 'Search unsorted database with quadratic speedup',
        steps: [
            {
                title: 'Initialize Superposition',
                desc: 'Create equal superposition of all database items',
                circuit: ['H', 'H', 'H'],
                explanation: 'Apply Hadamard gates to all qubits to create an equal superposition of all possible states: (|0⟩ + |1⟩ + ... + |n-1⟩)/√n. This represents all possible items in the database with equal probability.',
                amplitudes: [0.25, 0.25, 0.25, 0.25]
            },
            {
                title: 'Apply Oracle',
                desc: 'Mark the target item with a phase flip',
                circuit: ['H', 'Oracle', 'H'],
                explanation: 'The oracle marks the solution by flipping its phase. This is achieved through a controlled phase gate. The marked state now has amplitude -A while unmarked states have amplitude +A, creating interference.',
                amplitudes: [-0.3, 0.2, 0.2, 0.2]
            },
            {
                title: 'Apply Diffusion Operator',
                desc: 'Amplify amplitude of marked solution',
                circuit: ['H', 'Oracle', 'Diffuse', 'H'],
                explanation: 'The diffusion operator inverts amplitudes about the mean. Combined with the oracle, this amplifies the probability of the marked state while suppressing others. Multiple iterations increase the solution\'s amplitude exponentially.',
                amplitudes: [0.05, 0.15, 0.15, 0.65]
            },
            {
                title: 'Measure Solution',
                desc: 'Measure qubits to get the search result',
                circuit: ['H', 'Oracle', 'Diffuse', 'Measure'],
                explanation: 'After √N iterations of the oracle-diffusion cycle, measuring gives the marked solution with high probability. This achieves quadratic speedup: O(√N) instead of classical O(N).',
                amplitudes: [0.02, 0.02, 0.02, 0.94]
            }
        ]
    },
    teleport: {
        name: 'Quantum Teleportation',
        desc: 'Transfer quantum state using entanglement and classical bits',
        steps: [
            {
                title: 'Prepare Bell Pair',
                desc: 'Create entangled pair between Alice and Bob',
                circuit: ['|ψ⟩', 'H', 'CNOT'],
                explanation: 'Alice and Bob share a Bell pair (entangled state). This is prepared by applying Hadamard to one qubit and CNOT to create the maximally entangled state: (|00⟩ + |11⟩)/√2. Alice holds the first qubit, Bob holds the second.',
                amplitudes: null
            },
            {
                title: 'Measure Alice\'s Qubits',
                desc: 'Perform Bell measurement on input + half of pair',
                circuit: ['CNOT', 'Measure', 'Measure'],
                explanation: 'Alice performs a Bell measurement (CNOT followed by Hadamard, then measurement) on her input qubit and her half of the Bell pair. This produces 2 classical bits that encode information about the quantum state.',
                amplitudes: null
            },
            {
                title: 'Send Classical Bits',
                desc: 'Transmit 2 classical bits to Bob',
                circuit: ['c-bit 1', 'c-bit 2', '→→→'],
                explanation: 'The 2 classical measurement results are sent to Bob through a classical channel. These bits determine which recovery operation Bob needs to apply. Without this classical information, teleportation would violate no-communication theorem.',
                amplitudes: null
            },
            {
                title: 'Apply Recovery Operation',
                desc: 'Bob applies Pauli correction based on classical bits',
                circuit: ['Pauli Correction', 'Output |ψ⟩'],
                explanation: 'Based on the 2 classical bits received, Bob applies one of four Pauli operations (I, X, Y, or Z) to his half of the Bell pair. This recovers the original quantum state |ψ⟩. The quantum state has been teleported!',
                amplitudes: null
            }
        ]
    }
};

let currentAlgo = 'deutsch';
let currentStep = 0;

const defaultConfig = {
    page_title: 'Quantum Algorithms',
    next_step_btn: 'Next',
    prev_step_btn: 'Previous',
    reset_algo_btn: 'Reset'
};

function renderStep() {
    const algo = algorithms[currentAlgo];
    const step = algo.steps[currentStep];

    document.getElementById('step-title').textContent = step.title;
    document.getElementById('step-desc').textContent = step.desc;
    document.getElementById('step-explanation').innerHTML = step.explanation.replace(
        /\|([^⟩]+)⟩/g,
        '<span style="font-family: \'Space Mono\', monospace; color: #3b82f6; font-weight: bold;">|$1⟩</span>'
    );

    // Render circuit
    const circuitGates = document.getElementById('circuit-gates');
    circuitGates.innerHTML = '';
    step.circuit.forEach((gate, idx) => {
        const gateEl = document.createElement('div');
        gateEl.className = 'circuit-gate';

        let innerHTML = `<div class="gate-box">${gate}</div>`;
        if (idx < step.circuit.length - 1) {
            innerHTML += `<div class="arrow-separator ml-3"></div>`;
        }
        gateEl.innerHTML = innerHTML;
        circuitGates.appendChild(gateEl);
    });

    // Render amplitudes if available
    const ampDisplay = document.getElementById('amplitude-display');
    if (step.amplitudes) {
        ampDisplay.style.display = 'block';
        const ampContainer = document.getElementById('amplitudes');
        ampContainer.innerHTML = '';
        step.amplitudes.forEach((amp, idx) => {
            const prob = Math.abs(amp) * Math.abs(amp);
            const ampDiv = document.createElement('div');
            ampDiv.innerHTML = `
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs" style="color: #64748b;">State |${idx}⟩</span>
          <span class="text-xs font-bold" style="color: #3b82f6;">${prob.toFixed(2)}</span>
        </div>
        <div class="w-full rounded-full h-2" style="background: #e0e7ff; overflow: hidden;">
          <div class="amplitude-bar" style="background: #3b82f6; width: ${prob * 100}%;"></div>
        </div>
      `;
            ampContainer.appendChild(ampDiv);
        });
    } else {
        ampDisplay.style.display = 'none';
    }

    // Update progress
    const progress = ((currentStep + 1) / algo.steps.length) * 100;
    document.getElementById('progress-text').textContent = `${currentStep + 1}/${algo.steps.length}`;
    document.getElementById('progress-bar').style.width = progress + '%';

    // Update button states
    document.getElementById('prev-step-btn').disabled = currentStep === 0;
    document.getElementById('next-step-btn').disabled = currentStep === algo.steps.length - 1;
}

function switchAlgorithm(algoKey) {
    currentAlgo = algoKey;
    currentStep = 0;

    const algo = algorithms[currentAlgo];
    document.getElementById('algo-name').textContent = algo.name;
    document.getElementById('algo-desc').textContent = algo.desc;

    // Update nav items
    document.querySelectorAll('.algo-item').forEach(btn => {
        if (btn.dataset.algo === algoKey) {
            btn.style.color = '#3b82f6';
            btn.style.background = '#eff6ff';
        } else {
            btn.style.color = '#64748b';
            btn.style.background = 'transparent';
        }
    });

    renderStepsPanel();
    renderStep();
}

function renderStepsPanel() {
    const algo = algorithms[currentAlgo];
    const stepsList = document.getElementById('steps-list');
    stepsList.innerHTML = '';

    algo.steps.forEach((step, idx) => {
        const stepBtn = document.createElement('button');
        stepBtn.className = 'step-item w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all';

        if (idx === currentStep) {
            stepBtn.style.background = '#eff6ff';
            stepBtn.style.color = '#3b82f6';
        } else {
            stepBtn.style.background = 'transparent';
            stepBtn.style.color = '#64748b';
        }

        stepBtn.style.border = 'none';
        stepBtn.style.cursor = 'pointer';
        stepBtn.textContent = `${idx + 1}. ${step.title}`;

        stepBtn.addEventListener('click', () => {
            currentStep = idx;
            renderStepsPanel();
            renderStep();
        });

        stepsList.appendChild(stepBtn);
    });
}

// Event listeners
document.querySelectorAll('.algo-item').forEach(btn => {
    btn.addEventListener('click', () => switchAlgorithm(btn.dataset.algo));
});

document.getElementById('next-step-btn').addEventListener('click', () => {
    if (currentStep < algorithms[currentAlgo].steps.length - 1) {
        currentStep++;
        renderStepsPanel();
        renderStep();
    }
});

document.getElementById('prev-step-btn').addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        renderStepsPanel();
        renderStep();
    }
});

document.getElementById('reset-algo-btn').addEventListener('click', () => {
    currentStep = 0;
    renderStepsPanel();
    renderStep();
});

// Element SDK
async function onConfigChange(config) {
    const c = { ...defaultConfig, ...config };
    document.getElementById('page-title').textContent = c.page_title;
    document.getElementById('next-step-btn').innerHTML = `
    ${c.next_step_btn} <i data-lucide="chevron-right" class="w-3 h-3"></i>
  `;
    document.getElementById('prev-step-btn').innerHTML = `
    <i data-lucide="chevron-left" class="w-3 h-3"></i> ${c.prev_step_btn}
  `;
    document.getElementById('reset-algo-btn').innerHTML = `
    <i data-lucide="rotate-ccw" class="w-4 h-4"></i> ${c.reset_algo_btn}
  `;
    lucide.createIcons();
}

function mapToCapabilities(config) {
    return {
        recolorables: [],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
    };
}

function mapToEditPanelValues(config) {
    const c = { ...defaultConfig, ...config };
    return new Map([
        ['page_title', c.page_title],
        ['next_step_btn', c.next_step_btn],
        ['prev_step_btn', c.prev_step_btn],
        ['reset_algo_btn', c.reset_algo_btn]
    ]);
}

if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities,
        mapToEditPanelValues
    });
}

// Initialize
renderStepsPanel();
renderStep();
lucide.createIcons();