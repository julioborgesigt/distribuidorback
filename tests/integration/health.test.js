// Testes de integração para endpoint de healthcheck
const request = require('supertest');
const express = require('express');

// Mock básico do endpoint de health
const app = express();
app.get('/health', (req, res) => {
  res.json({
    uptime: process.uptime(),
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: 'test',
    version: '1.2.0',
    database: 'connected',
    memory: {
      used: 50,
      total: 128,
      unit: 'MB'
    }
  });
});

describe('GET /health', () => {
  test('deve retornar status 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });

  test('deve retornar estrutura JSON correta', async () => {
    const response = await request(app).get('/health');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('environment');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('database');
    expect(response.body).toHaveProperty('memory');
  });

  test('deve retornar status como "ok"', async () => {
    const response = await request(app).get('/health');
    expect(response.body.status).toBe('ok');
  });

  test('deve retornar informações de memória', async () => {
    const response = await request(app).get('/health');
    expect(response.body.memory).toHaveProperty('used');
    expect(response.body.memory).toHaveProperty('total');
    expect(response.body.memory).toHaveProperty('unit');
    expect(response.body.memory.unit).toBe('MB');
  });
});
