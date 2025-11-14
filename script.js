/**
 * Kalkulator Bunga Tunggal & Bunga Majemuk
 * JavaScript Native - Semantic Structure
 */

// ===================================
// DOM Element References
// ===================================
const elements = {
    // Input elements
    principal: document.getElementById('principal'),
    rate: document.getElementById('rate'),
    time: document.getElementById('time'),
    frequency: document.getElementById('frequency'),
    
    // Button elements
    calculateBtn: document.getElementById('calculateBtn'),
    resetBtn: document.getElementById('resetBtn'),
    simpleTab: document.getElementById('simpleTab'),
    compoundTab: document.getElementById('compoundTab'),
    
    // Display elements
    resultSection: document.getElementById('resultSection'),
    resultPrincipal: document.getElementById('resultPrincipal'),
    resultInterest: document.getElementById('resultInterest'),
    resultTotal: document.getElementById('resultTotal'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    
    // Info elements
    infoBox: document.getElementById('infoBox'),
    infoTitle: document.getElementById('infoTitle'),
    infoText: document.getElementById('infoText'),
    formulaText: document.getElementById('formulaText'),
    
    // Frequency group
    frequencyGroup: document.getElementById('frequencyGroup'),
    
    // Comparison section
    comparisonSection: document.getElementById('comparisonSection'),
    comparisonValue: document.getElementById('comparisonValue'),
    differenceValue: document.getElementById('differenceValue')
};

// ===================================
// State Management
// ===================================
let currentCalculationType = 'simple'; // 'simple' atau 'compound'

// ===================================
// Utility Functions
// ===================================

/**
 * Format angka ke format Rupiah
 * @param {number} number - Angka yang akan diformat
 * @returns {string} - Angka dalam format Rupiah
 */
function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

/**
 * Validasi input form
 * @returns {Object} - Object dengan status validasi dan pesan error
 */
function validateInputs() {
    const principal = parseFloat(elements.principal.value);
    const rate = parseFloat(elements.rate.value);
    const time = parseFloat(elements.time.value);

    // Cek apakah semua field terisi
    if (!elements.principal.value || !elements.rate.value || !elements.time.value) {
        return {
            isValid: false,
            message: 'Semua field harus diisi!'
        };
    }

    // Cek apakah input adalah angka valid
    if (isNaN(principal) || isNaN(rate) || isNaN(time)) {
        return {
            isValid: false,
            message: 'Input harus berupa angka yang valid!'
        };
    }

    // Cek apakah angka positif
    if (principal <= 0 || rate <= 0 || time <= 0) {
        return {
            isValid: false,
            message: 'Semua nilai harus lebih besar dari 0!'
        };
    }

    // Cek batas maksimal yang masuk akal
    if (principal > 999999999999) {
        return {
            isValid: false,
            message: 'Modal terlalu besar! Maksimal 999 Miliar'
        };
    }

    if (rate > 100) {
        return {
            isValid: false,
            message: 'Suku bunga terlalu besar! Maksimal 100%'
        };
    }

    if (time > 100) {
        return {
            isValid: false,
            message: 'Jangka waktu terlalu lama! Maksimal 100 tahun'
        };
    }

    const frequency = parseInt(elements.frequency.value);

    return {
        isValid: true,
        values: { principal, rate, time, frequency }
    };
}

/**
 * Tampilkan pesan error
 * @param {string} message - Pesan error yang akan ditampilkan
 */
function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.classList.remove('hidden');
    elements.resultSection.classList.add('hidden');

    // Auto hide error setelah 5 detik
    setTimeout(() => {
        hideError();
    }, 5000);
}

/**
 * Sembunyikan pesan error
 */
function hideError() {
    elements.errorMessage.classList.add('hidden');
}

// ===================================
// Calculation Functions
// ===================================

/**
 * Hitung bunga tunggal
 * @param {number} principal - Modal awal
 * @param {number} rate - Suku bunga per tahun (dalam persen)
 * @param {number} time - Jangka waktu (dalam tahun)
 * @returns {Object} - Object berisi hasil perhitungan
 */
function calculateSimpleInterest(principal, rate, time) {
    // Rumus Bunga Tunggal: I = P × r × t
    // Dimana:
    // I = Interest (Bunga)
    // P = Principal (Modal Awal)
    // r = Rate (Suku Bunga dalam desimal, misal 5% = 0.05)
    // t = Time (Waktu dalam tahun)

    const rateDecimal = rate / 100;
    const interest = principal * rateDecimal * time;
    const total = principal + interest;

    return {
        principal: principal,
        interest: interest,
        total: total,
        rate: rate,
        time: time,
        type: 'simple'
    };
}

/**
 * Hitung bunga majemuk
 * @param {number} principal - Modal awal
 * @param {number} rate - Suku bunga per tahun (dalam persen)
 * @param {number} time - Jangka waktu (dalam tahun)
 * @param {number} frequency - Frekuensi bunga majemuk per tahun
 * @returns {Object} - Object berisi hasil perhitungan
 */
function calculateCompoundInterest(principal, rate, time, frequency) {
    // Rumus Bunga Majemuk: A = P(1 + r/n)^(nt)
    // Dimana:
    // A = Amount (Total Akhir)
    // P = Principal (Modal Awal)
    // r = Rate (Suku Bunga dalam desimal)
    // n = Frequency (Frekuensi bunga majemuk per tahun)
    // t = Time (Waktu dalam tahun)

    const rateDecimal = rate / 100;
    const total = principal * Math.pow((1 + rateDecimal / frequency), (frequency * time));
    const interest = total - principal;

    return {
        principal: principal,
        interest: interest,
        total: total,
        rate: rate,
        time: time,
        frequency: frequency,
        type: 'compound'
    };
}

/**
 * Tampilkan hasil perhitungan
 * @param {Object} result - Object hasil perhitungan
 */
function displayResult(result) {
    // Update nilai-nilai hasil
    elements.resultPrincipal.textContent = formatRupiah(result.principal);
    elements.resultInterest.textContent = formatRupiah(result.interest);
    elements.resultTotal.textContent = formatRupiah(result.total);

    // Update formula text
    if (result.type === 'simple') {
        elements.formulaText.textContent = 'Bunga = Modal × Suku Bunga × Waktu';
        elements.comparisonSection.classList.add('hidden');
    } else {
        elements.formulaText.textContent = `Total = Modal × (1 + Suku Bunga / Frekuensi)^(Frekuensi × Waktu)`;
        
        // Tampilkan perbandingan dengan bunga tunggal
        const simpleResult = calculateSimpleInterest(result.principal, result.rate, result.time);
        elements.comparisonValue.textContent = formatRupiah(simpleResult.total);
        elements.differenceValue.textContent = formatRupiah(result.total - simpleResult.total);
        elements.comparisonSection.classList.remove('hidden');
    }

    // Tampilkan section hasil
    elements.resultSection.classList.remove('hidden');
    
    // Tambahkan animasi pulse pada hasil
    elements.resultTotal.parentElement.classList.add('result-pulse');
    setTimeout(() => {
        elements.resultTotal.parentElement.classList.remove('result-pulse');
    }, 1000);

    // Scroll ke hasil
    elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Handle perhitungan
 */
function handleCalculate() {
    // Sembunyikan error sebelumnya
    hideError();

    // Validasi input
    const validation = validateInputs();

    if (!validation.isValid) {
        showError(validation.message);
        return;
    }

    let result;

    // Hitung sesuai tipe yang dipilih
    if (currentCalculationType === 'simple') {
        result = calculateSimpleInterest(
            validation.values.principal,
            validation.values.rate,
            validation.values.time
        );
    } else {
        result = calculateCompoundInterest(
            validation.values.principal,
            validation.values.rate,
            validation.values.time,
            validation.values.frequency
        );
    }

    // Tampilkan hasil
    displayResult(result);

    // Log ke console untuk debugging
    console.log('Hasil Perhitungan:', result);
}

/**
 * Handle reset form
 */
function handleReset() {
    // Kosongkan semua input
    elements.principal.value = '';
    elements.rate.value = '';
    elements.time.value = '';
    elements.frequency.value = '12';

    // Sembunyikan hasil dan error
    elements.resultSection.classList.add('hidden');
    hideError();

    // Focus ke input pertama
    elements.principal.focus();

    console.log('Form direset');
}

/**
 * Switch ke bunga tunggal
 */
function switchToSimple() {
    currentCalculationType = 'simple';
    
    // Update tab appearance
    elements.simpleTab.classList.add('active');
    elements.compoundTab.classList.remove('active');
    
    // Hide frequency input
    elements.frequencyGroup.classList.add('hidden');
    
    // Update info box
    elements.infoTitle.textContent = 'Bunga Tunggal:';
    elements.infoText.textContent = 'Bunga dihitung hanya dari modal awal. Cocok untuk investasi jangka pendek atau pinjaman sederhana.';
    
    // Hide result if showing
    elements.resultSection.classList.add('hidden');
    hideError();
    
    console.log('Switched to Simple Interest');
}

/**
 * Switch ke bunga majemuk
 */
function switchToCompound() {
    currentCalculationType = 'compound';
    
    // Update tab appearance
    elements.compoundTab.classList.add('active');
    elements.simpleTab.classList.remove('active');
    
    // Show frequency input
    elements.frequencyGroup.classList.remove('hidden');
    
    // Update info box
    elements.infoTitle.textContent = 'Bunga Majemuk:';
    elements.infoText.textContent = 'Bunga dihitung dari modal + bunga sebelumnya. Cocok untuk investasi jangka panjang dengan pertumbuhan eksponensial.';
    
    // Hide result if showing
    elements.resultSection.classList.add('hidden');
    hideError();
    
    console.log('Switched to Compound Interest');
}

// ===================================
// Event Listeners
// ===================================

/**
 * Inisialisasi event listeners
 */
function initializeEventListeners() {
    // Event untuk tombol Hitung
    elements.calculateBtn.addEventListener('click', handleCalculate);

    // Event untuk tombol Reset
    elements.resetBtn.addEventListener('click', handleReset);

    // Event untuk tab switching
    elements.simpleTab.addEventListener('click', switchToSimple);
    elements.compoundTab.addEventListener('click', switchToCompound);

    // Event untuk Enter key pada input
    [elements.principal, elements.rate, elements.time].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleCalculate();
            }
        });
    });

    // Event untuk input change (hide error saat user mulai mengetik)
    [elements.principal, elements.rate, elements.time].forEach(input => {
        input.addEventListener('input', () => {
            if (!elements.errorMessage.classList.contains('hidden')) {
                hideError();
            }
        });
    });

    console.log('Event listeners initialized');
}

// ===================================
// Initialization
// ===================================

/**
 * Inisialisasi aplikasi saat DOM loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Kalkulator Bunga - Initialized');
    
    // Setup event listeners
    initializeEventListeners();

    // Set default to simple interest
    switchToSimple();

    // Focus ke input pertama
    elements.principal.focus();
});

// ===================================
// Export untuk testing (optional)
// ===================================
// Jika menggunakan module system, uncomment baris berikut:
// export { calculateSimpleInterest, calculateCompoundInterest, formatRupiah, validateInputs };