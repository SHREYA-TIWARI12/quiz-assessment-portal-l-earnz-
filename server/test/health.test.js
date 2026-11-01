import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
process.env.NODE_ENV = 'test'; process.env.JWT_SECRET = 'test-secret';
const { default: app } = await import('../index.js');
test('health endpoint reports API availability', async () => { const response = await request(app).get('/api/health'); assert.equal(response.status, 200); assert.equal(response.body.status, 'ok'); });
