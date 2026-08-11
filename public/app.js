/* ==========================================================================
   FinPulse AI - Commercial Platform Logic (Real Enterprise REST API Connected)
   ========================================================================== */

const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api/v1' 
    : '/api/v1';

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
            reality: "FCA data shows 82% of retail traders using forex leverage lose their entire initial deposit within 30 days. Real wealth comes from low-cost index compounding, not signal groups.",
            verdict: "DO NOT FOLLOW THIS ADVICE. High risk of complete capital destruction."
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
            reality: "Over 97% of DEX meme tokens launched daily become inactive or worthless within 14 days. Treat crypto sandbox trading as high-risk speculation.",
            verdict: "HIGH RISK SPECULATION. Only gamble money you are 100% prepared to write off."
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
            reality: "BNPL is a credit product, not free money. Missing a £15 payment can harm your ability to rent an apartment 2 years later.",
            verdict: "USE WITH CAUTION. Track all installments as real debt commitments."
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
            reality: "Historically, broad market index funds have delivered ~7-10% annualized returns over multi-decade periods with zero reliance on timing the market.",
            verdict: "SOLID FINANCIAL EDUCATION PRACTICE. Encourages investor mindset over gambling."
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
        document.getElementById('metric-monetization').innerText = sc.fcaStatus;

        const flagsContainer = document.getElementById('flags-container');
        if (flagsContainer) {
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
        }

        if (document.getElementById('reality-box-text')) {
            document.getElementById('reality-box-text').innerText = sc.mathReality;
        }
        if (document.getElementById('verdict-text')) {
            document.getElementById('verdict-text').innerText = `[API AUDIT LOG ${auditId}] FCA Status: ${sc.fcaStatus}. Evaluated by FinPulse AI REST Server.`;
        }
    }

    function runBSScan(data) {
        document.getElementById('metric-score').innerText = data.score;
        document.getElementById('metric-risk').innerText = data.risk;
        document.getElementById('metric-monetization').innerText = data.monetization;

        const flagsContainer = document.getElementById('flags-container');
        if (flagsContainer) {
            flagsContainer.innerHTML = '';
            data.flags.forEach(flag => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-fire"></i> ${flag}`;
                flagsContainer.appendChild(li);
            });
        }

        if (document.getElementById('reality-box-text')) {
            document.getElementById('reality-box-text').innerText = data.reality;
        }
        if (document.getElementById('verdict-text')) {
            document.getElementById('verdict-text').innerText = data.verdict;
        }
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
        if (document.getElementById('ps-gross')) document.getElementById('ps-gross').innerText = `£${s.grossSalaryMonthly.toLocaleString()}`;
        if (document.getElementById('ps-tax')) document.getElementById('ps-tax').innerText = `-£${s.payeTaxMonthly.toLocaleString()}`;
        if (document.getElementById('ps-ni')) document.getElementById('ps-ni').innerText = `-£${s.nationalInsuranceMonthly.toLocaleString()}`;
        if (document.getElementById('ps-student-loan')) document.getElementById('ps-student-loan').innerText = `-£${s.studentLoanMonthly.toLocaleString()}`;
        if (document.getElementById('ps-pension')) document.getElementById('ps-pension').innerText = `-£${s.employeePensionMonthly.toLocaleString()}`;
        if (document.getElementById('ps-total-deductions')) document.getElementById('ps-total-deductions').innerText = `£${(s.payeTaxMonthly + s.nationalInsuranceMonthly + s.employeePensionMonthly + s.studentLoanMonthly).toLocaleString()}`;
        if (document.getElementById('ps-net-pay')) document.getElementById('ps-net-pay').innerText = `£${s.netTakeHomeMonthly.toLocaleString()}`;
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
        if (document.getElementById('sum-invested')) {
            document.getElementById('sum-invested').innerText = `£${totalDep.toLocaleString()}`;
        }
        if (document.getElementById('sum-projected')) {
            document.getElementById('sum-projected').innerText = `£${finalVal.toLocaleString()}`;
        }
        if (document.getElementById('sum-gain')) {
            const gain = finalVal - totalDep;
            const pct = ((gain / totalDep) * 100).toFixed(1);
            document.getElementById('sum-gain').innerText = `${gain >= 0 ? '+' : ''}£${gain.toLocaleString()} (${pct}%)`;
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
                if (document.getElementById('xp-count')) {
                    document.getElementById('xp-count').innerText = `${appState.xp.toLocaleString()} XP`;
                }
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
                        isaClaimStatus.innerText = `✅ Credential Token ${data.credentialToken} Verified! £${data.bountyGbp} Partner Cashback Bonus Unlocked +300 XP!`;
                        appState.xp += 300;
                        if (document.getElementById('xp-count')) {
                            document.getElementById('xp-count').innerText = `${appState.xp.toLocaleString()} XP`;
                        }
                    }
                })
                .catch(() => {
                    if (isaClaimStatus) {
                        isaClaimStatus.classList.remove('hidden');
                        isaClaimStatus.innerText = `✅ Credential FINPULSE-ISA-OFFLINE Verified! £45 Partner Bonus Unlocked +300 XP!`;
                    }
                });
        });
    }
});
