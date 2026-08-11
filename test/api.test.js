const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../server');
const db = require('../db');

test.beforeEach(() => db.reset());

test('health endpoint identifies educational demo mode', async () => {
    const response = await request(app).get('/api/v1/health').expect(200);
    assert.equal(response.body.mode, 'educational-demo');
});

test('does not expose repository or database files', async () => {
    await request(app).get('/server.js').expect(404);
    await request(app).get('/database.json').expect(404);
    await request(app).get('/package.json').expect(404);
});

test('validates scanner and payslip input', async () => {
    await request(app).post('/api/v1/scan').send({ claimText: '' }).expect(400);
    await request(app).post('/api/v1/payslip/decode').send({ grossSalary: -1, pensionRate: 5 }).expect(400);
});

test('returns 400 for malformed JSON', async () => {
    await request(app).post('/api/v1/scan')
        .set('Content-Type', 'application/json').send('{broken').expect(400, { error: 'Invalid JSON body' });
});

test('caption analysis is explicitly not OCR', async () => {
    const response = await request(app).post('/api/v1/scan/ocr')
        .send({ rawCaption: 'Guaranteed 50x leverage returns' }).expect(200);
    assert.equal(response.body.source, 'user-supplied-caption');
    assert.equal(response.body.confidenceScore, null);
    assert.match(response.body.notice, /OCR (?:is|are) not enabled/);
});

test('sensitive partner routes are hidden without a configured token', async () => {
    await request(app).get('/api/v1/b2b/telemetry').expect(404);
    await request(app).get('/api/v1/b2b/export').expect(404);
});

test('serves the website and approved assets', async () => {
    await request(app).get('/').expect(200).expect('Content-Type', /html/);
    await request(app).get('/style.css').expect(200).expect('Content-Type', /css/);
});

test('runs a decision rehearsal without returning advice', async () => {
    const response = await request(app).post('/api/v1/rehearsal').send({
        claimText: 'Guaranteed 50x leverage returns. DM me today.',
        amount: 250,
        reason: 'save for a rental deposit'
    }).expect(200);

    assert.equal(response.body.success, true);
    assert.match(response.body.downsideScenario, /full £250 at risk/);
    assert.match(response.body.boundary, /not a scam determination/);
    assert.equal(response.body.comprehension.correctOption, 1);
});

test('creates an educational decision receipt after comprehension check', async () => {
    const rehearsal = await request(app).post('/api/v1/rehearsal').send({
        claimText: 'Guaranteed 50x leverage returns',
        amount: 250,
        reason: 'pay for a holiday'
    }).expect(200);

    const receipt = await request(app).post('/api/v1/decision-receipt').send({
        rehearsalId: rehearsal.body.rehearsalId,
        amount: 250,
        selectedOption: 1
    }).expect(200);

    assert.equal(receipt.body.learningStatus, 'CORE_RISK_UNDERSTOOD');
    assert.match(receipt.body.privacy, /claim text.*not stored/i);
    assert.match(receipt.body.boundary, /not approval to invest/);
});
