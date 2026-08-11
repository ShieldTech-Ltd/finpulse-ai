const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

// Initial seed data with official UK FCA Warning List entities & scam patterns
const initialDb = {
    fcaWarningList: [
        { name: "Crypto King 99 Forex Signals", category: "Unauthorised Forex Broker", flagDate: "2026-01-15", domain: "crypto_king_99" },
        { name: "Moonshot Presale Meme Coin", category: "Unregistered Crypto Asset Presale", flagDate: "2026-02-02", domain: "moonshot_meme" },
        { name: "BNPL Stack Hacks Group", category: "Credit Stacking Scheme", flagDate: "2025-11-20", domain: "bnpl_hacks" },
        { name: "Guaranteed 50x Signal Telegram", category: "Clone Firm / Scam Signals", flagDate: "2026-03-10", domain: "t.me/forex_guaranteed" },
        { name: "YieldMax High Leverage DEX", category: "Unauthorised Derivative Platform", flagDate: "2026-04-01", domain: "yieldmax-dex.io" }
    ],
    auditLogs: [
        { id: "LOG-1001", timestamp: new Date(Date.now() - 3600000).toISOString(), event: "FINFLUENCER_AUDIT", platform: "TikTok", scamScore: 92, riskLevel: "RED", category: "Forex Leverage" },
        { id: "LOG-1002", timestamp: new Date(Date.now() - 7200000).toISOString(), event: "PAYSLIP_DECODE", grossSalary: 32000, taxCode: "1257L", pensionMatchUnlocked: 100 },
        { id: "LOG-1003", timestamp: new Date(Date.now() - 10800000).toISOString(), event: "INVESTOR_SANDBOX", strategy: "global-etf", monthlyContribution: 150, horizonYears: 5 }
    ],
    b2bMetrics: {
        activeGenZAccounts: 42850,
        fcaAuditVerifiedLearners: 12410,
        estFineSavingsGbp: 1820000,
        partnerLeadConversions: 6240
    }
};

// Initialize DB file if not present
function initDb() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
    }
}

function readDb() {
    initDb();
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return initialDb;
    }
}

function writeDb(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// DB API Methods
module.exports = {
    getFcaWarningList: () => {
        const db = readDb();
        return db.fcaWarningList || [];
    },
    checkFcaWarning: (query) => {
        const list = module.exports.getFcaWarningList();
        const lower = query.toLowerCase();
        return list.find(item => 
            lower.includes(item.domain.toLowerCase()) || 
            lower.includes(item.name.toLowerCase()) ||
            item.domain.toLowerCase().includes(lower)
        );
    },
    saveAuditLog: (logEntry) => {
        const db = readDb();
        const log = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toISOString(),
            ...logEntry
        };
        db.auditLogs.unshift(log);
        if (db.auditLogs.length > 500) db.auditLogs.pop(); // keep last 500
        writeDb(db);
        return log;
    },
    getAuditLogs: (limit = 20) => {
        const db = readDb();
        return (db.auditLogs || []).slice(0, limit);
    },
    getB2bMetrics: () => {
        const db = readDb();
        return db.b2bMetrics || initialDb.b2bMetrics;
    }
};
