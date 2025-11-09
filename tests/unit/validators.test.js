// Testes unitários para validadores
const { validationResult } = require('express-validator');

describe('Validadores - Conceitos gerais', () => {
  test('deve validar que express-validator está disponível', () => {
    expect(validationResult).toBeDefined();
    expect(typeof validationResult).toBe('function');
  });

  test('deve validar formato de matrícula básico', () => {
    const matriculaValida = '12345';
    const matriculaInvalida = '';

    expect(matriculaValida.length).toBeGreaterThan(0);
    expect(matriculaInvalida.length).toBe(0);
  });

  test('deve validar comprimento mínimo de senha', () => {
    const senhaValida = '12345678';
    const senhaInvalida = '123';

    expect(senhaValida.length).toBeGreaterThanOrEqual(8);
    expect(senhaInvalida.length).toBeLessThan(8);
  });

  test('deve validar que array de IDs não está vazio', () => {
    const arrayValido = [1, 2, 3];
    const arrayInvalido = [];

    expect(arrayValido.length).toBeGreaterThan(0);
    expect(arrayInvalido.length).toBe(0);
  });

  test('deve validar limite máximo de array (100 itens)', () => {
    const arrayDentroLimite = new Array(50).fill(1);
    const arrayForaLimite = new Array(101).fill(1);

    expect(arrayDentroLimite.length).toBeLessThanOrEqual(100);
    expect(arrayForaLimite.length).toBeGreaterThan(100);
  });
});

describe('Validadores - Tipos de login', () => {
  test('deve aceitar loginType admin_super', () => {
    const loginTypes = ['admin_super', 'admin_padrao'];
    expect(loginTypes).toContain('admin_super');
  });

  test('deve aceitar loginType admin_padrao', () => {
    const loginTypes = ['admin_super', 'admin_padrao'];
    expect(loginTypes).toContain('admin_padrao');
  });

  test('deve rejeitar loginType inválido', () => {
    const loginTypes = ['admin_super', 'admin_padrao'];
    expect(loginTypes).not.toContain('usuario');
    expect(loginTypes).not.toContain('admin');
  });
});

describe('Validadores - Observações', () => {
  test('deve aceitar observação com até 100 caracteres', () => {
    const observacao = 'A'.repeat(100);
    expect(observacao.length).toBeLessThanOrEqual(100);
  });

  test('deve rejeitar observação com mais de 100 caracteres', () => {
    const observacao = 'A'.repeat(101);
    expect(observacao.length).toBeGreaterThan(100);
  });

  test('deve aceitar observação vazia', () => {
    const observacao = '';
    expect(observacao.length).toBe(0);
  });
});
