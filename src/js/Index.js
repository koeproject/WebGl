/* =========================================
   UI Interactions
========================================= */

// จัดการการเปิด/ปิด Mobile Menu เมื่อกดปุ่ม Hamburger
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileToggleBtn && mobileMenu) {
        mobileToggleBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Initialize Lucide Icons (แปลงแท็ก <i data-lucide="..."> เป็น SVG)
    lucide.createIcons();
});

/* =========================================
   SDK Configuration (ส่วนตั้งค่าระบบภายนอก)
========================================= */

// ค่า Default Configuration สำหรับข้อมูลและสไตล์เบื้องต้น
const defaultConfig = {
    background_color: '#ffffff',
    surface_color: '#f8fbff',
    text_color: '#0f172a',
    primary_action_color: '#3b82f6',
    secondary_action_color: '#64748b',
    font_family: 'Google Sans',
    font_size: 16,
    headline: 'Learn Quantum Computing',
    subheadline: 'เรียนรู้ควอนตัมคอมพิวเตอร์ด้วยวิธีที่เข้าใจง่าย ผ่าน simulator และ visualization แบบ interactive',
    btn_learn: 'Start Learning',
    btn_sim: 'Try Simulator',
    feature1_title: 'Interactive Visualization',
    feature2_title: 'Quantum Circuit Simulator',
    feature3_title: 'Algorithm Walkthroughs',
    footer_text: '© 2025 QuantumLearn — เรียนรู้ควอนตัมคอมพิวเตอร์อย่างเข้าใจ'
};

/**
 * ฟังก์ชันนี้จะถูกเรียกเมื่อมีการแก้ไขค่า Config จากระบบภายนอก
 * ใช้สำหรับอัปเดตสไตล์และข้อความบนหน้าเว็บตามค่าใหม่
 */
async function onConfigChange(config) {
    const c = { ...defaultConfig, ...config };
    const font = c.font_family || defaultConfig.font_family;
    const base = c.font_size || defaultConfig.font_size;
    const stack = `${font}, 'Google Sans', sans-serif`;

    // ตัวอย่าง: คุณสามารถดึง Element บนหน้ามาเปลี่ยนสีตาม c.primary_action_color 
    // หรือเปลี่ยนข้อความตาม c.headline ได้ที่นี่ (ถ้าต้องการให้ SDK อัปเดต UI สดๆ)
    // โค้ดส่วนนี้จะถูกกำหนดตาม requirement ของตัว SDK ที่คุณใช้
}

/**
 * Map คอนฟิกเพื่อบอกให้ SDK ทราบว่าค่าไหนสามารถแก้ไข (Edit) ได้บ้าง
 * เช่น สี ฟอนต์ หรือขนาดตัวอักษร
 */
function mapToCapabilities(config) {
    const c = { ...defaultConfig, ...config };

    // Helper function สำหรับสร้าง Color Capability
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

/**
 * Map ข้อมูล Text เพื่อส่งให้ระบบ Panel Editor ภายนอกนำไปแสดงผล
 */
function mapToEditPanelValues(config) {
    const c = { ...defaultConfig, ...config };
    return new Map([
        ['headline', c.headline],
        ['subheadline', c.subheadline],
        ['btn_learn', c.btn_learn],
        ['btn_sim', c.btn_sim],
        ['feature1_title', c.feature1_title],
        ['feature2_title', c.feature2_title],
        ['feature3_title', c.feature3_title],
        ['footer_text', c.footer_text]
    ]);
}

// Initialize Element SDK (ตรวจสอบก่อนว่ามี Object SDK โหลดมาหรือยัง)
if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange,
        mapToCapabilities,
        mapToEditPanelValues
    });
}