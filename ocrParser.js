/* ==========================================================================
   FinPulse AI — Social Media Video OCR & Transcript Microservice
   ========================================================================== */

/**
 * Extracts and cleans OCR text overlay / caption data from social video URLs
 * or raw image frame payloads (TikTok, IG Reels, YT Shorts, X).
 */
function parseSocialVideoText(payload) {
    const { rawCaption } = payload || {};
    const extractedText = typeof rawCaption === 'string' ? rawCaption : '';

    // Clean OCR text noise
    const cleanedText = extractedText
        .replace(/[^\w\s\d@#:\/.-]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return {
        extractedText: cleanedText,
        source: 'user-supplied-caption',
        confidenceScore: null,
        notice: 'Image and video OCR are not enabled. Analysis is limited to the caption supplied by the user.',
        detectedKeywords: detectFinfluencerKeywords(cleanedText),
        timestamp: new Date().toISOString()
    };
}

function detectFinfluencerKeywords(text) {
    const keywords = [];
    const lower = text.toLowerCase();

    if (lower.includes('50x') || lower.includes('100x') || lower.includes('leverage')) {
        keywords.push({ keyword: "high-leverage", severity: "HIGH" });
    }
    if (lower.includes('guaranteed') || lower.includes('1000x') || lower.includes('presale')) {
        keywords.push({ keyword: "unrealistic-return", severity: "HIGH" });
    }
    if (lower.includes('klarna') || lower.includes('clearpay') || lower.includes('stack')) {
        keywords.push({ keyword: "bnpl-stacking", severity: "MEDIUM" });
    }
    if (lower.includes('dm me') || lower.includes('vip link') || lower.includes('telegram')) {
        keywords.push({ keyword: "unregulated-funnel", severity: "HIGH" });
    }

    return keywords;
}

module.exports = {
    parseSocialVideoText,
    detectFinfluencerKeywords
};
