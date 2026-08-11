/* ==========================================================================
   FinPulse AI — Social Media Video OCR & Transcript Microservice
   ========================================================================== */

/**
 * Extracts and cleans OCR text overlay / caption data from social video URLs
 * or raw image frame payloads (TikTok, IG Reels, YT Shorts, X).
 */
function parseSocialVideoText(payload) {
    const { videoUrl, imageBase64, rawCaption } = payload || {};
    let extractedText = rawCaption || "";

    // Simulated OCR extraction from video frame overlay if imageBase64 / URL provided
    if (videoUrl && videoUrl.includes("tiktok")) {
        extractedText += " [OCR Frame Text: 50x leverage forex signals group guaranteed £5000/week]";
    } else if (videoUrl && videoUrl.includes("instagram")) {
        extractedText += " [OCR Frame Text: 1000x moonshot presale meme coin presale ending today]";
    } else if (videoUrl && videoUrl.includes("twitter") || videoUrl && videoUrl.includes("x.com")) {
        extractedText += " [OCR Frame Text: Stack 4 Klarna accounts with Clearpay no credit check]";
    }

    // Clean OCR text noise
    const cleanedText = extractedText
        .replace(/[^\w\s\d@#:\/.-]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return {
        extractedText: cleanedText,
        confidenceScore: 0.94,
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
