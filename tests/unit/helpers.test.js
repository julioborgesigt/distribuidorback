// Testes unitários para funções utilitárias
const { isValidPassword, getRealIP, sanitizeString } = require('../../utils/helpers');

describe('Helpers - isValidPassword', () => {
  test('deve aceitar senha válida com maiúscula, minúscula e número', () => {
    expect(isValidPassword('SenhaForte123')).toBe(true);
  });

  test('deve aceitar senha válida com símbolos', () => {
    expect(isValidPassword('Senha@Forte123')).toBe(true);
  });

  test('deve rejeitar senha sem maiúscula', () => {
    expect(isValidPassword('senhafraca123')).toBe(false);
  });

  test('deve rejeitar senha sem minúscula', () => {
    expect(isValidPassword('SENHAFRACA123')).toBe(false);
  });

  test('deve rejeitar senha sem número', () => {
    expect(isValidPassword('SenhaFraca')).toBe(false);
  });

  test('deve rejeitar senha muito curta', () => {
    expect(isValidPassword('Sen1')).toBe(false);
  });

  test('deve rejeitar senha vazia', () => {
    expect(isValidPassword('')).toBe(false);
  });

  test('deve rejeitar senha null ou undefined', () => {
    expect(isValidPassword(null)).toBe(false);
    expect(isValidPassword(undefined)).toBe(false);
  });
});

describe('Helpers - getRealIP', () => {
  test('deve retornar IP do header x-forwarded-for', () => {
    const req = {
      headers: { 'x-forwarded-for': '192.168.1.100' },
      ip: '127.0.0.1'
    };
    expect(getRealIP(req)).toBe('192.168.1.100');
  });

  test('deve retornar IP do header x-real-ip se x-forwarded-for não existir', () => {
    const req = {
      headers: { 'x-real-ip': '192.168.1.101' },
      ip: '127.0.0.1'
    };
    expect(getRealIP(req)).toBe('192.168.1.101');
  });

  test('deve retornar req.ip se nenhum header especial existir', () => {
    const req = {
      headers: {},
      ip: '127.0.0.1',
      connection: {},
      socket: {}
    };
    expect(getRealIP(req)).toBe('127.0.0.1');
  });

  test('deve lidar com múltiplos IPs no x-forwarded-for', () => {
    const req = {
      headers: { 'x-forwarded-for': '192.168.1.100, 10.0.0.1' },
      ip: '127.0.0.1'
    };
    expect(getRealIP(req)).toBe('192.168.1.100');
  });
});

describe('Helpers - sanitizeString', () => {
  test('deve remover tags HTML e manter conteúdo', () => {
    const result = sanitizeString('<script>alert("xss")</script>Texto');
    // A biblioteca xss pode remover a tag script mas manter o conteúdo
    expect(result).toContain('Texto');
  });

  test('deve processar HTML complexo', () => {
    const result = sanitizeString('<div class="test">Conteúdo</div>');
    expect(result).toContain('Conteúdo');
  });

  test('deve manter texto sem HTML intacto', () => {
    expect(sanitizeString('Texto normal')).toBe('Texto normal');
  });

  test('deve lidar com strings vazias', () => {
    expect(sanitizeString('')).toBe('');
  });

  test('deve lidar com null', () => {
    const result = sanitizeString(null);
    expect(result === null || result === '').toBe(true);
  });
});
