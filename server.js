const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./db');
const ocrParser = require('./ocrParser');

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

// Middleware
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(express.json({ limit: '32kb' }));
app.use('/api/', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-7', legacyHeaders: false }));

const publicFiles = new Set(['app.js', 'style.css', 'sw.js', 'manifest.json', 'animated_architecture.svg', 'pure_readme_transparent_architecture.svg']);
const requireAdmin = (req, res, next) => {
    const expected = process.env.ADMIN_API_TOKEN;
    const supplied = req.get('authorization');
    if (!expected || supplied !== `Bearer ${expected}`) return res.status(404).json({ error: 'Not found' });
    return next();
};
const numberInRange = (value, min, max) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : null;
};

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: "ONLINE",
        service: "FinPulse AI educational demo API",
        version: "1.1.0",
        mode: "educational-demo",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

// Social Video OCR & Transcript Audit Endpoint
app.post('/api/v1/scan/ocr', (req, res) => {
    const { videoUrl, imageBase64, rawCaption, platform } = req.body;
    const ocrResult = ocrParser.parseSocialVideoText({ videoUrl, imageBase64, rawCaption });
    
    if (!ocrResult.extractedText) return res.status(400).json({ error: 'rawCaption is required; image/video OCR is not enabled.' });
    const textToScan = ocrResult.extractedText.toLowerCase();
    const fcaMatch = db.checkFcaWarning(textToScan);
    
    let scamScore = 30;
    let riskLevel = "GREEN";
    let flags = [];
    
    ocrResult.detectedKeywords.forEach(k => {
        flags.push(`OCR Detected Keyword: ${k.keyword} (${k.severity} severity)`);
        scamScore += k.severity === "HIGH" ? 35 : 20;
    });

    if (fcaMatch) {
        scamScore = 98;
        flags.push(`MATCHED UK FCA WARNING LIST: ${fcaMatch.name}`);
    }

    scamScore = Math.min(100, Math.max(0, scamScore));
    if (scamScore >= 70) riskLevel = "RED";
    else if (scamScore >= 40) riskLevel = "AMBER";

    const auditLog = db.saveAuditLog({
        event: "OCR_VIDEO_AUDIT",
        platform: platform || "TikTok",
        scamScore,
        riskLevel,
        ocrConfidence: ocrResult.confidenceScore
    });

    return res.json({
        success: true,
        auditId: auditLog.id,
        ocrExtractedText: ocrResult.extractedText,
        confidenceScore: ocrResult.confidenceScore,
        source: ocrResult.source,
        notice: ocrResult.notice,
        scorecard: {
            scamScore,
            riskLevel,
            flags,
            fcaStatus: fcaMatch ? "WARNING_UNAUTHORISED_FIRM" : "NOT_CHECKED_USE_OFFICIAL_FCA_WARNING_LIST",
            fcaWarningListUrl: "https://www.fca.org.uk/consumers/warning-list-unauthorised-firms"
        }
    });
});

// 1. AI FINFLUENCER AUDIT API
app.post('/api/v1/scan', (req, res) => {
    const { platform, claimUrl, claimText } = req.body;
    const textToScan = (claimText || claimUrl || "").toLowerCase();
    if (textToScan.trim().length < 3 || textToScan.length > 5000) return res.status(400).json({ error: 'Provide claim text between 3 and 5,000 characters.' });

    // Check FCA Warning Database
    const fcaMatch = db.checkFcaWarning(textToScan);

    let scamScore = 20;
    let riskLevel = "GREEN";
    let flags = [];
    let mathReality = "No high-risk leverage or extreme yield claims detected in this transcript.";

    // Rule-Based AI Scorer & NLP Classifier
    if (textToScan.includes("50x") || textToScan.includes("leverage") || textToScan.includes("forex")) {
        scamScore += 45;
        flags.push("High Leverage (50x+) Forex Trading Scheme");
        mathReality = "50x leverage means a tiny 2% market swing against your trade wipes out 100% of your account balance.";
    }

    if (textToScan.includes("guaranteed") || textToScan.includes("1000x") || textToScan.includes("moonshot") || textToScan.includes("presale")) {
        scamScore += 30;
        flags.push("Unrealistic Guaranteed Return / Meme Coin Presale");
        mathReality = "No legitimate financial asset can guarantee fixed high returns. 98% of social presale meme coins lose all liquidity within 30 days.";
    }

    if (textToScan.includes("klarna") || textToScan.includes("stack") || textToScan.includes("clearpay") || textToScan.includes("bnpl")) {
        scamScore += 25;
        flags.push("BNPL Stacking & Debt Accumulation Risk");
        mathReality = "Stacking multiple Buy-Now-Pay-Later accounts triggers missed payment fees and damages your credit score for up to 6 years.";
    }

    if (fcaMatch) {
        scamScore = Math.max(scamScore, 95);
        flags.push(`MATCHED UK FCA WARNING LIST: ${fcaMatch.name} (${fcaMatch.category})`);
    }

    scamScore = Math.min(100, Math.max(0, scamScore));

    if (scamScore >= 70) {
        riskLevel = "RED";
    } else if (scamScore >= 40) {
        riskLevel = "AMBER";
    }

    // Record Anonymized FCA Compliance Audit Log
    const auditLog = db.saveAuditLog({
        event: "FINFLUENCER_AUDIT",
        platform: platform || "Multi-Platform",
        scamScore,
        riskLevel,
        flagsCount: flags.length,
        fcaMatch: fcaMatch ? fcaMatch.name : null
    });

    return res.json({
        success: true,
        auditId: auditLog.id,
        timestamp: auditLog.timestamp,
        scorecard: {
            scamScore,
            riskLevel,
            flags,
            mathReality,
            fcaStatus: fcaMatch ? "WARNING_UNAUTHORISED_FIRM" : "NOT_CHECKED_USE_OFFICIAL_FCA_WARNING_LIST",
            fcaWarningListUrl: "https://www.fca.org.uk/consumers/warning-list-unauthorised-firms",
            fcaDetails: fcaMatch || null
        }
    });
});

// 2. SIMPLIFIED UK PAYSLIP EDUCATION API
app.post('/api/v1/payslip/decode', (req, res) => {
    const grossSalary = numberInRange(req.body.grossSalary, 0, 1_000_000);
    const taxCode = req.body.taxCode || "1257L";
    const studentLoanPlan = req.body.studentLoanPlan || "plan2";
    const pensionRate = numberInRange(req.body.pensionRate, 0, 100);
    if (grossSalary === null || pensionRate === null) return res.status(400).json({ error: 'grossSalary must be 0-1,000,000 and pensionRate must be 0-100.' });

    // UK 2026/2027 HMRC Tax Computation Engine Rules
    let personalAllowance = 12570;
    if (taxCode.toUpperCase() === "BR") personalAllowance = 0;
    if (taxCode.toUpperCase() === "0T") personalAllowance = 0;

    const taxableIncome = Math.max(0, grossSalary - personalAllowance);

    // PAYE Income Tax (20% Basic, 40% Higher above £50,270)
    let annualTax = 0;
    if (taxableIncome <= 37700) {
        annualTax = taxableIncome * 0.20;
    } else {
        annualTax = (37700 * 0.20) + ((taxableIncome - 37700) * 0.40);
    }

    // Class 1 National Insurance (8% between £12,570 and £50,270; 2% above)
    let annualNi = 0;
    const niThreshold = 12570;
    if (grossSalary > niThreshold) {
        const niEligible = grossSalary - niThreshold;
        if (niEligible <= 37700) {
            annualNi = niEligible * 0.08;
        } else {
            annualNi = (37700 * 0.08) + ((niEligible - 37700) * 0.02);
        }
    }

    // Student Loan Repayment (Plan 2: 9% above £27,295)
    let annualStudentLoan = 0;
    if (studentLoanPlan === "plan2" && grossSalary > 27295) {
        annualStudentLoan = (grossSalary - 27295) * 0.09;
    } else if (studentLoanPlan === "plan5" && grossSalary > 25000) {
        annualStudentLoan = (grossSalary - 25000) * 0.09;
    }

    // Pension Employee & Employer Match (3% minimum statutory match)
    const annualEmployeePension = grossSalary * (pensionRate / 100);
    const annualEmployerMatch = grossSalary * (Math.min(pensionRate, 5) / 100);

    const annualNetPay = grossSalary - annualTax - annualNi - annualStudentLoan - annualEmployeePension;
    const monthlyNetPay = annualNetPay / 12;

    // Log Audit Event
    db.saveAuditLog({
        event: "PAYSLIP_DECODE",
        grossSalary,
        taxCode,
        monthlyNetPay: Math.round(monthlyNetPay),
        employerPensionMatchGbp: Math.round(annualEmployerMatch)
    });

    return res.json({
        success: true,
        summary: {
            grossSalaryAnnual: grossSalary,
            grossSalaryMonthly: Math.round(grossSalary / 12),
            personalAllowance,
            payeTaxMonthly: Math.round(annualTax / 12),
            nationalInsuranceMonthly: Math.round(annualNi / 12),
            studentLoanMonthly: Math.round(annualStudentLoan / 12),
            employeePensionMonthly: Math.round(annualEmployeePension / 12),
            freeEmployerPensionMatchMonthly: Math.round(annualEmployerMatch / 12),
            netTakeHomeMonthly: Math.round(monthlyNetPay),
            netTakeHomeAnnual: Math.round(annualNetPay)
        },
        assumptions: 'Simplified England, Wales and Northern Ireland educational estimate. Verify current HMRC rules before making decisions.'
    });
});

// 3. INVESTOR VS GAMBLER ANNUITY & CRASH SIMULATOR API
app.post('/api/v1/sandbox/simulate', (req, res) => {
    const monthlyContribution = numberInRange(req.body.monthlyContribution, 0, 100_000);
    const strategy = req.body.strategy || "global-etf"; // 'global-etf' | 'meme-crypto' | 'forex-leverage'
    const simulateCrash = req.body.simulateCrash === true;
    if (monthlyContribution === null || !['global-etf', 'meme-crypto', 'forex-leverage'].includes(strategy)) return res.status(400).json({ error: 'Invalid contribution or strategy.' });

    const years = 5;
    const trajectory = [];
    let balance = 0;
    let totalDeposited = 0;

    // Strategy Parameters
    let annualReturn = 0.08; // 8% global index ETF
    let volatility = 0.05;

    if (strategy === "meme-crypto") {
        annualReturn = 0.45;
        volatility = 0.60;
    } else if (strategy === "forex-leverage") {
        annualReturn = -0.30; // 90% loss trajectory over time
        volatility = 0.80;
    }

    for (let yr = 1; yr <= years; yr++) {
        totalDeposited += monthlyContribution * 12;
        let yrReturn = annualReturn;

        if (simulateCrash && yr === 3) {
            // Apply historical market drawdown shock
            yrReturn = strategy === "global-etf" ? -0.22 : -0.85;
        }

        balance = (balance + monthlyContribution * 12) * (1 + yrReturn);
        if (balance < 0) balance = 0;

        trajectory.push({
            year: yr,
            totalDeposited: Math.round(totalDeposited),
            projectedValue: Math.round(balance),
            marketCrashShockApplied: simulateCrash && yr === 3
        });
    }

    db.saveAuditLog({
        event: "INVESTOR_SANDBOX",
        strategy,
        monthlyContribution,
        finalValue: Math.round(balance),
        totalDeposited
    });

    return res.json({
        success: true,
        strategy,
        simulateCrash,
        monthlyContribution,
        years,
        finalValue: Math.round(balance),
        totalDeposited: Math.round(totalDeposited),
        netGainLoss: Math.round(balance - totalDeposited),
        trajectory
    });
});

// 4. B2B FCA CONSUMER DUTY COMPLIANCE TELEMETRY API
app.get('/api/v1/b2b/telemetry', requireAdmin, (req, res) => {
    const metrics = db.getB2bMetrics();
    const recentLogs = db.getAuditLogs(15);

    return res.json({
        success: true,
        fcaComplianceFramework: "FG22/5 Consumer Duty Audit Engine",
        metrics: {
            ...metrics,
            totalAuditLogsStored: recentLogs.length,
            systemStatus: "DEMO_NOT_COMPLIANCE_EVIDENCE"
        },
        recentAuditLogs: recentLogs
    });
});

// B2B FCA Consumer Duty Telemetry CSV / JSON Audit Exporter Endpoint
app.get('/api/v1/b2b/export', requireAdmin, (req, res) => {
    const format = (req.query.format || 'json').toLowerCase();
    const logs = db.getAuditLogs(100);

    if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="FCA_Consumer_Duty_Audit_Telemetry_FinPulse.csv"');
        
        let csv = 'Audit_ID,Timestamp,Event_Type,Platform,Scam_Risk_Score,Risk_Level,Gross_Salary,Tax_Code\n';
        logs.forEach(l => {
            csv += `"${l.id}","${l.timestamp}","${l.event || ''}","${l.platform || ''}","${l.scamScore || ''}","${l.riskLevel || ''}","${l.grossSalary || ''}","${l.taxCode || ''}"\n`;
        });
        return res.send(csv);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="FCA_Consumer_Duty_Audit_Telemetry_FinPulse.json"');
    return res.json({
        exportTimestamp: new Date().toISOString(),
        evidenceType: "DEMO_EDUCATIONAL_EVENTS_NOT_COMPLIANCE_EVIDENCE",
        totalExportedLogs: logs.length,
        auditLogs: logs
    });
});

// Partner ISA Lead Referral Bounty Endpoint
app.post('/api/v1/isa/referral', (req, res) => {
    const credentialToken = `FINPULSE-DEMO-${Date.now()}`;
    const bountyGbp = 0;

    db.saveAuditLog({
        event: "ISA_PARTNER_REFERRAL",
        credentialToken,
        bountyGbp,
        evidenceType: "DEMO_LEARNING_COMPLETION"
    });

    return res.json({
        success: true,
        credentialToken,
        bountyGbp,
        message: "Demo credential generated. This is not an offer, regulated referral, or proof of financial capability."
    });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/:file', (req, res, next) => publicFiles.has(req.params.file) ? res.sendFile(path.join(__dirname, req.params.file)) : next());
app.use('/public', express.static(path.join(__dirname, 'public'), { dotfiles: 'deny', index: false }));
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((error, req, res, next) => {
    console.error(error.message);
    if (res.headersSent) return next(error);
    if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
    return res.status(502).json({ error: 'Upstream service unavailable' });
});

// Export App for Vercel / Serverless Functions
module.exports = app;

// Start Server if run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`===================================================`);
        console.log(`⚡ FinPulse AI Enterprise REST API Engine ONLINE`);
        console.log(`🌐 Server running at: http://localhost:${PORT}`);
        console.log(`🛡️ FCA Consumer Duty Telemetry Vault Active`);
        console.log(`===================================================`);
    });
}
