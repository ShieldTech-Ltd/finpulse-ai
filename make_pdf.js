const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const inputHtml = path.resolve(__dirname, 'finpulse_pdf_template.html');
const outputPdf = path.resolve(__dirname, 'FinPulse_AI_Hackathon_Winning_Pack.pdf');

const edgePath = `"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"`;
const cmd = `${edgePath} --headless --no-pdf-header-footer --print-to-pdf="${outputPdf}" "${inputHtml}"`;

console.log("Executing PDF command...");
try {
    execSync(cmd, { stdio: 'inherit' });
    console.log("PDF generated successfully at:", outputPdf);
} catch (err) {
    console.error("Error generating PDF:", err.message);
}
