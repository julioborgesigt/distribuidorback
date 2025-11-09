// Testes unitários para validação de CPF
const { isValidCPF, formatCPF } = require('../../utils/helpers');

describe('Validação de CPF - isValidCPF', () => {
  test('deve aceitar CPF válido sem máscara', () => {
    expect(isValidCPF('11144477735')).toBe(true);
    expect(isValidCPF('12345678909')).toBe(true);
    expect(isValidCPF('52998224725')).toBe(true);
  });

  test('deve aceitar CPF válido com máscara', () => {
    expect(isValidCPF('111.444.777-35')).toBe(true);
    expect(isValidCPF('123.456.789-09')).toBe(true);
    expect(isValidCPF('529.982.247-25')).toBe(true);
  });

  test('deve rejeitar CPF com todos os dígitos iguais', () => {
    expect(isValidCPF('11111111111')).toBe(false);
    expect(isValidCPF('000.000.000-00')).toBe(false);
    expect(isValidCPF('22222222222')).toBe(false);
    expect(isValidCPF('99999999999')).toBe(false);
  });

  test('deve rejeitar CPF com dígitos verificadores inválidos', () => {
    expect(isValidCPF('12345678900')).toBe(false);
    expect(isValidCPF('11144477736')).toBe(false);
    expect(isValidCPF('123.456.789-00')).toBe(false);
  });

  test('deve rejeitar CPF com tamanho incorreto', () => {
    expect(isValidCPF('123456789')).toBe(false);
    expect(isValidCPF('1234567890123')).toBe(false);
    expect(isValidCPF('123')).toBe(false);
  });

  test('deve rejeitar CPF vazio ou null', () => {
    expect(isValidCPF('')).toBe(false);
    expect(isValidCPF(null)).toBe(false);
    expect(isValidCPF(undefined)).toBe(false);
  });

  test('deve aceitar CPF com caracteres especiais além de pontos e traços', () => {
    // A função limpa caracteres não numéricos
    expect(isValidCPF('111-444-777-35')).toBe(true);
    expect(isValidCPF('111 444 777 35')).toBe(true);
  });
});

describe('Formatação de CPF - formatCPF', () => {
  test('deve formatar CPF sem máscara para formato padrão', () => {
    expect(formatCPF('11144477735')).toBe('111.444.777-35');
    expect(formatCPF('12345678909')).toBe('123.456.789-09');
  });

  test('deve manter formatação de CPF já formatado', () => {
    const formatted = formatCPF('111.444.777-35');
    expect(formatted).toContain('111');
    expect(formatted).toContain('444');
    expect(formatted).toContain('777');
    expect(formatted).toContain('35');
  });

  test('deve retornar null para CPF com tamanho incorreto', () => {
    expect(formatCPF('123')).toBe(null);
    expect(formatCPF('12345678901234')).toBe(null);
  });

  test('deve retornar null para entrada vazia', () => {
    expect(formatCPF('')).toBe(null);
    expect(formatCPF(null)).toBe(null);
  });

  test('deve formatar CPF com caracteres especiais', () => {
    expect(formatCPF('111-444-777-35')).toBe('111.444.777-35');
    expect(formatCPF('111 444 777 35')).toBe('111.444.777-35');
  });
});
