/* ==========================================================================
   FinPulse AI - Commercial Platform Logic (Real Enterprise REST API Connected)
   ========================================================================== */

const API_BASE_URL = '/api/v1';

document.addEventListener('DOMContentLoaded', () => {

    // --- State Management ---
    const appState = {
        xp: 1450,
        streak: 5,
        currentTab: 'bs-detector',
        currentStrategy: 'balanced',
        isCrashSimulated: false,
        salary: 28000,
        pensionPct: 5,
        monthlyDeposit: 150,
        apiOnline: false
    };

    // Check API Health Status
    fetch(`${API_BASE_URL}/health`)
        .then(res => res.json())
        .then(data => {
            if (data.status === "ONLINE") {
                appState.apiOnline = true;
                console.log("⚡ Connected to FinPulse AI Enterprise REST API Engine:", data);
            }
        })
        .catch(() => {});

    // --- 3D WebGL Floating Particle Shield Engine ---
    function init3DHeroCanvas() {
        const canvas = document.getElementById('hero-3d-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create 3D Rotating Shield Sphere Grid
        const geometry = new THREE.IcosahedronGeometry(14, 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const shieldSphere = new THREE.Mesh(geometry, material);
        scene.add(shieldSphere);

        // Floating Glowing Particles
        const particleCount = 120;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 80;
            positions[i + 1] = (Math.random() - 0.5) * 80;
            positions[i + 2] = (Math.random() - 0.5) * 50;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0xa855f7,
            size: 1.2,
            transparent: true,
            opacity: 0.7
        });
        const particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);

        // Mouse Parallax Physics
        let mouseX = 0, mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
            mouseY = (e.clientY - window.innerHeight / 2) * 0.0005;
        });

        // Animation Loop
        function animate3D() {
            requestAnimationFrame(animate3D);
            shieldSphere.rotation.x += 0.002 + mouseY;
            shieldSphere.rotation.y += 0.003 + mouseX;
            particleSystem.rotation.y -= 0.001;
            renderer.render(scene, camera);
        }

        animate3D();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    init3DHeroCanvas();

    // --- 3D Glass Card Interactive Mouse Tilt Physics ---
    const tiltCards = document.querySelectorAll('.glass-card, .quest-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const tiltX = (y / rect.height) * -10;
            const tiltY = (x / rect.width) * 10;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // --- 1. Tab Navigation ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            btn.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            if (targetTab === 'investment-sandbox') {
                renderGrowthChart();
            } else if (targetTab === 'b2b-dashboard') {
                loadB2bTelemetry();
            }
        });
    });

    // --- 2. TikTok / Finfluencer BS Scanner (REST API Connected) ---
    const presetData = {
        forex: {
            text: "Bro, just put £500 into this new forex signals group with 100x leverage! Made £5,000 yesterday while sleeping. DM me for the private VIP link 💸🚀",
            score: "96%",
            risk: "Extreme Leverage (100x)",
            monetization: "Affiliate Broker Commission",
            flags: [
                "100x leverage multiplies losses so a 1% dip wipes out 100% of your money instantly.",
                "The creator earns money from broker affiliate links when you lose your deposit.",
                "Unregulated offshore broker — no FCA protection or FSCS guarantee."
            ],
            reality: "Leverage magnifies losses as well as gains. At 100x leverage, a move of roughly 1% against a position could put the full amount at risk, before fees and platform rules.",
            verdict: "EDUCATIONAL CHECK: Verify the firm, evidence, costs and downside independently before deciding."
        },
        crypto: {
            text: "This new low-cap meme token is launching on DEX today! Guaranteed 100x gains before liquidity lock. Buy now or cry later! 💎🙌",
            score: "91%",
            risk: "Rug-Pull / Liquidity Drain",
            monetization: "Creator Token Allocation Dump",
            flags: [
                "Unverified smart contract code — risk of honeypot where selling is disabled.",
                "High creator token concentration: developers can dump holdings and drain liquidity pool.",
                "Fake hype generated by paid bot accounts on X and Telegram."
            ],
            reality: "A token promotion does not demonstrate liquidity, contract safety, ownership concentration or the ability to sell. Those facts require independent verification.",
            verdict: "EDUCATIONAL CHECK: Missing evidence is not proof of safety or fraud. Pause and verify independently."
        },
        bnpl: {
            text: "Why pay £120 for clothes today when you can split it into 4 easy interest-free payments? It's basically free money and doesn't affect anything! 🛍️✨",
            score: "65%",
            risk: "Debt Stacking & Credit Damage",
            monetization: "Merchant Fees + Late Payment Penalties",
            flags: [
                "BNPL services encourage impulsive 'micro-debt' stacking across multiple apps.",
                "Missing payments triggers missed payment markers reported to UK Credit Reference Agencies.",
                "Can severely impact your future mortgage or tenancy application suitability."
            ],
            reality: "BNPL is a credit commitment, not free money. Several small instalments can overlap and reduce next month's available cash.",
            verdict: "EDUCATIONAL CHECK: Add every instalment to next month's committed spending before deciding."
        },
        index: {
            text: "Invest £150 a month into a low-cost, broadly diversified Global Index ETF (like S&P 500 or FTSE All-World) and let compound growth build long-term wealth over 10+ years.",
            score: "12%",
            risk: "Normal Market Volatility",
            monetization: "Low ETF Management Fee (0.07%)",
            flags: [
                "Short-term price fluctuations will occur during market dips.",
                "Requires long-term patience (5-10+ year time horizon)."
            ],
            reality: "Diversification can spread company-specific risk, but investment values can still fall and past performance does not guarantee future returns.",
            verdict: "EDUCATIONAL CHECK: Fees, time horizon, diversification and downside still require consideration."
        }
    };

    const platformChips = document.querySelectorAll('.platform-chip');
    const presetChips = document.querySelectorAll('.preset-chip');
    const claimInput = document.getElementById('claim-input');
    const scanBtn = document.getElementById('scan-btn');

    platformChips.forEach(chip => {
        chip.addEventListener('click', () => {
            platformChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    presetChips.forEach(chip => {
        chip.addEventListener('click', () => {
            presetChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const key = chip.getAttribute('data-preset');
            if (presetData[key]) {
                claimInput.value = presetData[key].text;
                triggerApiScan(claimInput.value, presetData[key]);
            }
        });
    });

    // Set initial preset
    if (claimInput) claimInput.value = presetData.forex.text;

    if (scanBtn) {
        scanBtn.addEventListener('click', () => {
            const text = claimInput.value;
            let matched = presetData.forex;
            if (text.toLowerCase().includes('index') || text.toLowerCase().includes('etf')) matched = presetData.index;
            else if (text.toLowerCase().includes('bnpl') || text.toLowerCase().includes('klarna')) matched = presetData.bnpl;
            else if (text.toLowerCase().includes('crypto') || text.toLowerCase().includes('token')) matched = presetData.crypto;
            
            triggerApiScan(text, matched);
        });
    }

    function triggerApiScan(claimText, fallbackData) {
        // Send request to real Express Backend API
        fetch(`${API_BASE_URL}/scan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                platform: getActivePlatform(),
                claimText
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.scorecard) {
                renderApiScorecard(data.scorecard, data.auditId);
            } else {
                runBSScan(fallbackData);
            }
        })
        .catch(() => {
            runBSScan(fallbackData);
        });
    }

    function getActivePlatform() {
        const active = document.querySelector('.platform-chip.active');
        return active ? active.getAttribute('data-platform') : 'tiktok';
    }

    function renderApiScorecard(sc, auditId) {
        document.getElementById('metric-score').innerText = `${sc.scamScore}%`;
        document.getElementById('metric-risk').innerText = `${sc.riskLevel} RISK`;
        document.getElementById('metric-monetization').innerText = sc.fcaStatus === 'WARNING_UNAUTHORISED_FIRM'
            ? 'Warning-list pattern match'
            : 'Use official FCA checks';

        const riskBadge = document.getElementById('risk-badge');
        riskBadge.className = `risk-badge ${sc.riskLevel === 'RED' ? 'risk-high' : sc.riskLevel === 'AMBER' ? 'risk-medium' : 'risk-low'}`;
        riskBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${sc.riskLevel === 'GREEN' ? 'NO COMMON HIGH-RISK PHRASE DETECTED' : `${sc.riskLevel} CLAIM-RISK INDICATORS`}`;

        const flagsContainer = document.getElementById('flags-container');
        flagsContainer.innerHTML = '';

        if (sc.flags && sc.flags.length > 0) {
            sc.flags.forEach(flag => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-fire"></i> ${flag}`;
                flagsContainer.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-circle-check text-green"></i> No high-risk leverage flags detected.`;
            flagsContainer.appendChild(li);
        }

        document.getElementById('reality-box-text').innerText = sc.mathReality;
        document.getElementById('verdict-text').innerText = `Pattern check ${auditId}: ${sc.fcaStatus}. This is not a scam determination or financial advice.`;
    }

    function runBSScan(data) {
        document.getElementById('metric-score').innerText = data.score;
        document.getElementById('metric-risk').innerText = data.risk;
        document.getElementById('metric-monetization').innerText = data.monetization;

        const flagsContainer = document.getElementById('flags-container');
        flagsContainer.innerHTML = '';
        data.flags.forEach(flag => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-fire"></i> ${flag}`;
            flagsContainer.appendChild(li);
        });

        document.getElementById('reality-box-text').innerText = data.reality;
        document.getElementById('verdict-text').innerText = data.verdict;
    }

    // --- Guided claim-to-Decision-Receipt demo ---
    const rehearseBtn = document.getElementById('rehearse-btn');
    const receiptBtn = document.getElementById('receipt-btn');
    const rehearsalResults = document.getElementById('rehearsal-results');
    const decisionReceipt = document.getElementById('decision-receipt');
    const decisionError = document.getElementById('decision-error');
    let activeRehearsal = null;
    let selectedComprehensionOption = null;

    if (rehearseBtn) {
        rehearseBtn.addEventListener('click', async () => {
            const amount = Number(document.getElementById('decision-amount').value);
            const reason = document.getElementById('decision-reason').value.trim();
            decisionError.classList.add('hidden');
            rehearseBtn.disabled = true;
            rehearseBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Rehearsing downside...';

            try {
                const response = await fetch(`${API_BASE_URL}/rehearsal`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ claimText: claimInput.value, amount, reason })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Unable to run the rehearsal.');

                activeRehearsal = { ...data, amount };
                selectedComprehensionOption = null;
                renderRehearsal(data);
            } catch (error) {
                decisionError.textContent = error.message;
                decisionError.classList.remove('hidden');
            } finally {
                rehearseBtn.disabled = false;
                rehearseBtn.innerHTML = '<i class="fa-solid fa-shield-heart"></i> Rehearse Maya\'s Decision';
            }
        });
    }

    function renderRehearsal(data) {
        const missingList = document.getElementById('missing-context-list');
        missingList.innerHTML = '';
        data.missingContext.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            missingList.appendChild(li);
        });
        document.getElementById('downside-scenario').textContent = data.downsideScenario;
        document.getElementById('comprehension-question').textContent = data.comprehension.question;

        const options = document.getElementById('comprehension-options');
        options.innerHTML = '';
        data.comprehension.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'receipt-option';
            button.textContent = option;
            button.addEventListener('click', () => {
                options.querySelectorAll('.receipt-option').forEach(item => item.classList.remove('selected'));
                button.classList.add('selected');
                selectedComprehensionOption = index;
                receiptBtn.disabled = false;
            });
            options.appendChild(button);
        });

        receiptBtn.disabled = true;
        rehearsalResults.classList.remove('hidden');
        decisionReceipt.classList.add('hidden');
        document.querySelectorAll('.flow-step').forEach((step, index) => step.classList.toggle('active', index < 3));
        rehearsalResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (receiptBtn) {
        receiptBtn.addEventListener('click', async () => {
            if (!activeRehearsal || selectedComprehensionOption === null) return;
            receiptBtn.disabled = true;
            try {
                const response = await fetch(`${API_BASE_URL}/decision-receipt`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        rehearsalId: activeRehearsal.rehearsalId,
                        amount: activeRehearsal.amount,
                        selectedOption: selectedComprehensionOption
                    })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Unable to create the receipt.');
                renderDecisionReceipt(data);
            } catch (error) {
                decisionError.textContent = error.message;
                decisionError.classList.remove('hidden');
                receiptBtn.disabled = false;
            }
        });
    }

    function renderDecisionReceipt(data) {
        document.getElementById('receipt-id').textContent = data.receiptId;
        document.getElementById('receipt-created').textContent = new Date(data.createdAt).toLocaleString('en-GB');
        document.getElementById('receipt-amount').textContent = `£${activeRehearsal.amount.toLocaleString('en-GB')}`;
        document.getElementById('receipt-next-step').textContent = data.nextStep;
        document.getElementById('receipt-privacy').textContent = data.privacy;
        const status = document.getElementById('receipt-status');
        status.textContent = data.learningStatus === 'CORE_RISK_UNDERSTOOD' ? 'Core risk understood' : 'Review recommended';
        status.className = `receipt-status ${data.learningStatus === 'CORE_RISK_UNDERSTOOD' ? 'understood' : 'review'}`;
        decisionReceipt.classList.remove('hidden');
        document.querySelectorAll('.flow-step').forEach(step => step.classList.add('active'));
        decisionReceipt.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // --- 3. UK Payslip Decoder Engine (HMRC API Connected) ---
    const salarySlider = document.getElementById('salary-slider');
    const salaryDisplay = document.getElementById('salary-display');
    const taxCodeSelect = document.getElementById('tax-code-select');
    const studentLoanSelect = document.getElementById('student-loan-select');
    const pensionSlider = document.getElementById('pension-slider');
    const pensionDisplay = document.getElementById('pension-display');

    if (salarySlider) {
        salarySlider.addEventListener('input', () => {
            appState.salary = parseFloat(salarySlider.value);
            salaryDisplay.innerText = `£${appState.salary.toLocaleString()} / year`;
            updatePayslip();
        });
    }

    if (pensionSlider) {
        pensionSlider.addEventListener('input', () => {
            appState.pensionPct = parseFloat(pensionSlider.value);
            pensionDisplay.innerText = `${appState.pensionPct}%`;
            updatePayslip();
        });
    }

    if (taxCodeSelect) taxCodeSelect.addEventListener('change', updatePayslip);
    if (studentLoanSelect) studentLoanSelect.addEventListener('change', updatePayslip);

    function updatePayslip() {
        const grossSalary = appState.salary;
        const taxCode = taxCodeSelect ? taxCodeSelect.value : '1257L';
        const studentLoanPlan = studentLoanSelect ? studentLoanSelect.value : 'plan2';
        const pensionRate = appState.pensionPct;

        // Fetch calculation from Express API
        fetch(`${API_BASE_URL}/payslip/decode`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ grossSalary, taxCode, studentLoanPlan, pensionRate })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.summary) {
                renderPayslipResults(data.summary);
            } else {
                updatePayslipFallback();
            }
        })
        .catch(() => updatePayslipFallback());
    }

    function renderPayslipResults(s) {
        document.getElementById('ps-gross').innerText = `£${s.grossSalaryMonthly.toLocaleString()}`;
        document.getElementById('ps-tax').innerText = `-£${s.payeTaxMonthly.toLocaleString()}`;
        document.getElementById('ps-ni').innerText = `-£${s.nationalInsuranceMonthly.toLocaleString()}`;
        document.getElementById('ps-student-loan').innerText = `-£${s.studentLoanMonthly.toLocaleString()}`;
        document.getElementById('ps-pension').innerText = `-£${s.employeePensionMonthly.toLocaleString()}`;
        document.getElementById('ps-net-pay').innerText = `£${s.netTakeHomeMonthly.toLocaleString()}`;
        document.getElementById('ps-total-deductions').innerText = `£${(s.payeTaxMonthly + s.nationalInsuranceMonthly + s.studentLoanMonthly + s.employeePensionMonthly).toLocaleString()}`;
        document.getElementById('ps-pension-label').innerText = `Employee Pension (${appState.pensionPct}%)`;
        document.getElementById('ps-tax-code').innerText = taxCodeSelect ? taxCodeSelect.value : '1257L';
        const payslipTip = document.getElementById('payslip-tip');
        if (payslipTip) payslipTip.textContent = `Illustrative employer contribution: £${s.freeEmployerPensionMatchMonthly.toLocaleString()}/month. Check your scheme rules before deciding.`;
        
        if (document.getElementById('annual-net-summary')) {
            document.getElementById('annual-net-summary').innerText = `Annual Net Take-Home Pay: £${s.netTakeHomeAnnual.toLocaleString()}`;
        }
    }

    function updatePayslipFallback() {
        const gross = appState.salary;
        const taxFree = 12570;
        const taxable = Math.max(0, gross - taxFree);
        const taxAnnual = taxable * 0.20;
        const niAnnual = Math.max(0, gross - 12570) * 0.08;
        const pensionAnnual = gross * (appState.pensionPct / 100);
        const matchAnnual = gross * (Math.min(appState.pensionPct, 5) / 100);
        const netAnnual = gross - taxAnnual - niAnnual - pensionAnnual;

        renderPayslipResults({
            grossSalaryMonthly: Math.round(gross / 12),
            payeTaxMonthly: Math.round(taxAnnual / 12),
            nationalInsuranceMonthly: Math.round(niAnnual / 12),
            studentLoanMonthly: 0,
            employeePensionMonthly: Math.round(pensionAnnual / 12),
            freeEmployerPensionMatchMonthly: Math.round(matchAnnual / 12),
            netTakeHomeMonthly: Math.round(netAnnual / 12),
            netTakeHomeAnnual: Math.round(netAnnual)
        });
    }

    // --- 4. Investor vs Gambler Growth Simulator (API Connected) ---
    const depositSlider = document.getElementById('deposit-slider');
    const depositDisplay = document.getElementById('deposit-display');
    const strategyCards = document.querySelectorAll('.strategy-card');
    const simulateCrashBtn = document.getElementById('simulate-crash-btn');

    if (depositSlider) {
        depositSlider.addEventListener('input', () => {
            appState.monthlyDeposit = parseFloat(depositSlider.value);
            depositDisplay.innerText = `£${appState.monthlyDeposit} / month`;
            renderGrowthChart();
        });
    }

    strategyCards.forEach(card => {
        card.addEventListener('click', () => {
            strategyCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            appState.currentStrategy = card.getAttribute('data-strategy');
            appState.isCrashSimulated = false;
            renderGrowthChart();
        });
    });

    if (simulateCrashBtn) {
        simulateCrashBtn.addEventListener('click', () => {
            appState.isCrashSimulated = true;
            renderGrowthChart();
        });
    }

    function renderGrowthChart() {
        const canvas = document.getElementById('growthCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Fetch simulation vector from backend API
        fetch(`${API_BASE_URL}/sandbox/simulate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                monthlyContribution: appState.monthlyDeposit,
                strategy: appState.currentStrategy === 'balanced' ? 'global-etf' : 'meme-crypto',
                simulateCrash: appState.isCrashSimulated
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success && data.trajectory) {
                drawCanvasTrajectory(ctx, width, height, data.trajectory, data.finalValue, data.totalDeposited);
            } else {
                drawCanvasFallback(ctx, width, height);
            }
        })
        .catch(() => drawCanvasFallback(ctx, width, height));
    }

    function drawCanvasTrajectory(ctx, width, height, trajectory, finalVal, totalDep) {
        ctx.clearRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 5; i++) {
            const y = (height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        const points = trajectory.map((t, idx) => {
            const x = (width / (trajectory.length - 1)) * idx;
            const maxVal = Math.max(...trajectory.map(p => p.projectedValue), totalDep * 1.5, 1000);
            const y = height - (t.projectedValue / maxVal) * (height - 40) - 20;
            return { x, y, val: t.projectedValue, year: t.year };
        });

        // Draw Line
        ctx.beginPath();
        ctx.strokeStyle = appState.isCrashSimulated ? '#ef4444' : '#10b981';
        ctx.lineWidth = 3.5;
        points.forEach((p, idx) => {
            if (idx === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Draw Fill Gradient
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, appState.isCrashSimulated ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // Summary Text
        if (document.getElementById('sim-5yr-val')) {
            document.getElementById('sim-5yr-val').innerText = `£${finalVal.toLocaleString()}`;
        }
        if (document.getElementById('sim-5yr-deposited')) {
            document.getElementById('sim-5yr-deposited').innerText = `£${totalDep.toLocaleString()}`;
        }
    }

    function drawCanvasFallback(ctx, width, height) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px system-ui';
        ctx.fillText('Interactive 5-Year Compound Annuity Simulator', 20, 40);
    }

    // --- 5. B2B Telemetry Loader ---
    function loadB2bTelemetry() {
        return; // Protected partner API is not called from the public demo.
        fetch(`${API_BASE_URL}/b2b/telemetry`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.metrics) {
                    console.log("🛡️ FCA Consumer Duty Telemetry Loaded:", data.metrics);
                }
            })
            .catch(() => {});
    }

    // --- 6. Gamified Quests & Quiz Modal ---
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const quizModal = document.getElementById('quiz-modal');
    const closeQuizBtn = document.getElementById('close-quiz-btn');
    const quizOptBtns = document.querySelectorAll('.quiz-opt-btn');
    const quizFeedback = document.getElementById('quiz-feedback');

    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', () => {
            quizModal.classList.remove('hidden');
            quizFeedback.classList.add('hidden');
        });
    }

    if (closeQuizBtn) {
        closeQuizBtn.addEventListener('click', () => {
            quizModal.classList.add('hidden');
        });
    }

    quizOptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const isCorrect = btn.getAttribute('data-correct') === 'true';
            quizFeedback.classList.remove('hidden');
            if (isCorrect) {
                appState.xp += 150;
                document.getElementById('xp-count').innerText = `${appState.xp.toLocaleString()} XP`;
            }
        });
    });

    // Preset Stage Demo Buttons Listener
    const presetBtns = document.querySelectorAll('.preset-btn');
    const presetsMap = {
        forex: "https://www.tiktok.com/@crypto_king_99/video/7391209381 - 'Quit your 9-5! 50x leverage forex signals group guarantees £5,000/week with zero risk. DM me for access link.'",
        crypto: "https://www.instagram.com/reel/C8x9910aB - '1000x Moonshot Presale Meme Coin! Put in £100 today, guaranteed to hit £100,000 when listed on DEX tomorrow!'",
        bnpl: "https://twitter.com/bnpl_hacks/status/17892019 - 'How to buy a £1,200 iPhone for free: Stack 4 Klarna accounts with Clearpay and delay payments for 12 months with no credit check!'"
    };

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-preset');
            if (presetsMap[key] && claimInput) {
                claimInput.value = presetsMap[key];
                triggerApiScan(claimInput.value, presetData.forex);
            }
        });
    });

    // Bank ROI Slider Calculator Listener
    const bankUsersSlider = document.getElementById('bank-users-slider');
    const bankUsersVal = document.getElementById('bank-users-val');
    const roiFineSavings = document.getElementById('roi-fine-savings');
    const roiSaasFee = document.getElementById('roi-saas-fee');
    const roiMultiple = document.getElementById('roi-multiple');

    if (bankUsersSlider) {
        bankUsersSlider.addEventListener('input', () => {
            const users = parseInt(bankUsersSlider.value);
            if (bankUsersVal) bankUsersVal.innerText = `${users.toLocaleString()} Users`;

            const savings = Math.round(users * 14.2);
            const saasFee = Math.round(25000 + (users * 0.5));
            const roiMult = (savings / saasFee).toFixed(1);

            if (roiFineSavings) roiFineSavings.innerText = `£${savings.toLocaleString()}`;
            if (roiSaasFee) roiSaasFee.innerText = `£${saasFee.toLocaleString()}/yr`;
            if (roiMultiple) roiMultiple.innerText = `${roiMult}x ROI`;
        });
    }

    // Initial Calculation Runs
    updatePayslip();
    renderGrowthChart();

    // --- 7. Tenancy & ISA Referral Quests Handlers ---
    const startTenancyBtn = document.getElementById('start-tenancy-btn');
    const startIsaBtn = document.getElementById('start-isa-btn');
    const isaModal = document.getElementById('isa-modal');
    const closeIsaModalBtn = document.getElementById('close-isa-modal-btn');
    const claimIsaBountyBtn = document.getElementById('claim-isa-bounty-btn');
    const isaClaimStatus = document.getElementById('isa-claim-status');

    if (startTenancyBtn) {
        startTenancyBtn.addEventListener('click', () => {
            alert("🏠 UK Tenancy Deposit Rule: Landlords MUST register your deposit in a government-backed scheme (TDS, DPS, or MyDeposits) within 30 days. If they don't, you can claim up to 3x your deposit back! +200 XP Earned!");
            appState.xp += 200;
            if (document.getElementById('xp-count')) {
                document.getElementById('xp-count').innerText = `${appState.xp.toLocaleString()} XP`;
            }
        });
    }

    if (startIsaBtn) {
        startIsaBtn.addEventListener('click', () => {
            if (isaModal) isaModal.classList.remove('hidden');
        });
    }

    if (closeIsaModalBtn) {
        closeIsaModalBtn.addEventListener('click', () => {
            if (isaModal) isaModal.classList.add('hidden');
        });
    }

    if (claimIsaBountyBtn) {
        claimIsaBountyBtn.addEventListener('click', () => {
            fetch(`${API_BASE_URL}/isa/referral`, { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                    if (data.success && isaClaimStatus) {
                        isaClaimStatus.classList.remove('hidden');
                        isaClaimStatus.innerText = `✅ Demo learning token ${data.credentialToken} created. No financial product or cashback has been offered. +300 XP!`;
                        appState.xp += 300;
                        if (document.getElementById('xp-count')) {
                            document.getElementById('xp-count').innerText = `${appState.xp.toLocaleString()} XP`;
                        }
                    }
                })
                .catch(() => {
                    if (isaClaimStatus) {
                        isaClaimStatus.classList.remove('hidden');
                        isaClaimStatus.innerText = `✅ Offline demo lesson completed. No financial product or cashback has been offered. +300 XP!`;
                    }
                });
        });
    }
});
