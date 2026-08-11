const { randomUUID } = require('crypto');

// Privacy-first demo store. It intentionally avoids writing user input to disk.
// Production partners should supply an authenticated, tenant-scoped data adapter.
const state = { fcaWarningList: [], auditLogs: [] };

// DB API Methods
module.exports = {
    getFcaWarningList: () => {
        return [...state.fcaWarningList];
    },
    checkFcaWarning: (query) => {
        const list = module.exports.getFcaWarningList();
        const lower = String(query || '').trim().toLowerCase();
        if (lower.length < 3) return null;
        return list.find(item => 
            lower.includes(item.domain.toLowerCase()) || 
            lower.includes(item.name.toLowerCase()) ||
            item.domain.toLowerCase().includes(lower)
        );
    },
    saveAuditLog: (logEntry) => {
        const log = {
            id: `LOG-${randomUUID()}`,
            timestamp: new Date().toISOString(),
            ...logEntry
        };
        state.auditLogs.unshift(log);
        if (state.auditLogs.length > 100) state.auditLogs.pop();
        return log;
    },
    getAuditLogs: (limit = 20) => {
        return state.auditLogs.slice(0, Math.min(Number(limit) || 20, 100));
    },
    getB2bMetrics: () => {
        return { demoMode: true, sessionsThisInstance: state.auditLogs.length };
    },
    replaceFcaWarningList: (items) => {
        state.fcaWarningList = Array.isArray(items) ? items.slice(0, 1000) : [];
        return state.fcaWarningList.length;
    },
    reset: () => { state.fcaWarningList = []; state.auditLogs = []; }
};
