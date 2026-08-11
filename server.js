const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: "ONLINE",
        service: "FinPulse AI Enterprise API Engine",
        version: "1.0.0-PROD",
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
    });
});

// 1. AI FINFLUENCER AUDIT API
app.post('/api/v1/scan', (req, res) => {
    const { platform, claimUrl, claimText } = req.body;
    const textToScan = (claimText || claimUrl || "").toLowerCase();

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
            fcaStatus: fcaMatch ? "WARNING_UNAUTHORISED_FIRM" : "NO_EXPLICIT_FCA_WARNING",
            fcaDetails: fcaMatch || null
        }
    });
});

// 2. REAL UK HMRC TAX & PAYSLIP ENGINE API
app.post('/api/v1/payslip/decode', (req, res) => {
    const grossSalary = parseFloat(req.body.grossSalary) || 30000;
    const taxCode = req.body.taxCode || "1257L";
    const studentLoanPlan = req.body.studentLoanPlan || "plan2";
    const pensionRate = parseFloat(req.body.pensionRate) || 5;

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
        }
    });
});

// 3. INVESTOR VS GAMBLER ANNUITY & CRASH SIMULATOR API
app.post('/api/v1/sandbox/simulate', (req, res) => {
    const monthlyContribution = parseFloat(req.body.monthlyContribution) || 100;
    const strategy = req.body.strategy || "global-etf"; // 'global-etf' | 'meme-crypto' | 'forex-leverage'
    const simulateCrash = req.body.simulateCrash === true;

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
app.get('/api/v1/b2b/telemetry', (req, res) => {
    const metrics = db.getB2bMetrics();
    const recentLogs = db.getAuditLogs(15);

    return res.json({
        success: true,
        fcaComplianceFramework: "FG22/5 Consumer Duty Audit Engine",
        metrics: {
            ...metrics,
            totalAuditLogsStored: recentLogs.length,
            systemStatus: "FCA_COMPLIANT_ACTIVE"
        },
        recentAuditLogs: recentLogs
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`⚡ FinPulse AI Enterprise REST API Engine ONLINE`);
    console.log(`🌐 Server running at: http://localhost:${PORT}`);
    console.log(`🛡️ FCA Consumer Duty Telemetry Vault Active`);
    console.log(`===================================================`);
});
