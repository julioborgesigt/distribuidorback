# Proteção CSRF - Análise e Implementação

## Por que CSRF é de Baixa Prioridade Nesta API?

### Contexto: APIs REST com JWT em Headers

Esta API utiliza **autenticação JWT via header Authorization (Bearer token)**, não cookies. Isso significa que:

1. **Navegadores não enviam headers customizados automaticamente** em requisições cross-site
2. **Apenas JavaScript** pode adicionar o header `Authorization: Bearer <token>`
3. **Ataques CSRF tradicionais não funcionam**, pois dependem de cookies sendo enviados automaticamente

### Exemplo de Ataque CSRF (que NÃO funciona aqui):

```html
<!-- Ataque CSRF tradicional (não funciona com JWT em headers) -->
<form action="https://api.example.com/api/admin/delete-matricula" method="POST">
  <input name="matricula" value="12345">
  <input type="submit" value="Ganhe um prêmio!">
</form>
```

**Por que não funciona:**
- O formulário HTML só envia cookies automaticamente
- Não consegue enviar o header `Authorization: Bearer <token>`
- A API rejeita requisições sem JWT válido

## Proteções Implementadas

Mesmo com JWT em headers, implementamos **defesa em profundidade**:

### 1. Headers de Segurança (addSecurityHeaders)

```javascript
X-Frame-Options: DENY              // Previne Clickjacking
X-Content-Type-Options: nosniff    // Previne MIME sniffing
X-XSS-Protection: 1; mode=block    // Ativa proteção XSS do navegador
```

### 2. Validação de Header AJAX (validateAjaxHeader)

- Valida presença de `X-Requested-With` em requisições
- Dificulta ataques automatizados
- Garante que requisições vêm de clientes AJAX legítimos

### 3. Validação de Origin para Operações Críticas (validateOriginForCriticalOps)

Operações críticas validadas:
- `/api/admin/delete-matricula` - Exclusão de usuários
- `/api/admin/bulk-delete` - Exclusão em massa
- `/api/admin/reset-password` - Reset de senhas

**Validação:**
```javascript
// Verifica se Origin/Referer está na lista de permitidos
const allowedOrigins = [
  'https://distribuidorvue.onrender.com',
  'http://localhost:8080',
  process.env.FRONTEND_URL
];
```

### 4. Rate Limiting

Já implementado para operações sensíveis:
- Login: 5 tentativas / 15 min
- Bulk operations: 10 operações / 1 min
- Primeiro login: 3 tentativas / 15 min

### 5. CORS Configurado

```javascript
allowedOrigins: [
  'https://distribuidorvue.onrender.com',
  'http://localhost:8080',
  // ... outras origens permitidas
]
```

## Quando CSRF É uma Preocupação?

CSRF é crítico quando:
- ✅ Autenticação via **cookies de sessão**
- ✅ Cookies com flag `SameSite=None`
- ✅ Operações state-changing sem proteção

CSRF é baixa prioridade quando:
- ✅ **Autenticação via JWT em headers** (nosso caso)
- ✅ Headers customizados obrigatórios
- ✅ API-only (sem renderização de HTML)

## Referências

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [JWT and CSRF](https://stackoverflow.com/questions/21357182/csrf-token-necessary-when-using-stateless-sessionless-authentication)
- [REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)

## Testes

Para testar as proteções CSRF:

```bash
# Teste 1: Requisição sem JWT (deve falhar)
curl -X POST http://localhost:3000/api/admin/delete-matricula \
  -H "Content-Type: application/json" \
  -d '{"matricula":"12345"}'

# Teste 2: Requisição com JWT de origem não permitida (deve ser logada)
curl -X POST http://localhost:3000/api/admin/delete-matricula \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -H "Origin: http://malicious-site.com" \
  -d '{"matricula":"12345"}'

# Teste 3: Requisição válida (deve funcionar)
curl -X POST http://localhost:3000/api/admin/delete-matricula \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -H "Origin: http://localhost:8080" \
  -H "X-Requested-With: XMLHttpRequest" \
  -d '{"matricula":"12345"}'
```

## Conclusão

A proteção CSRF nesta API é **robusta por design** devido ao uso de JWT em headers. As camadas adicionais implementadas fornecem **defesa em profundidade** contra ataques sofisticados.

**Status:** ✅ Protegido contra CSRF
**Prioridade:** Baixa (já mitigado por arquitetura)
**Camadas de proteção:** 5 (Headers, AJAX validation, Origin check, Rate limiting, CORS)
