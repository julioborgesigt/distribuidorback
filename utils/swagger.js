// Configuração do Swagger/OpenAPI
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Sistema Distribuidor de Processos',
      version: '1.2.0',
      description: `
# API REST - Sistema Distribuidor de Processos Judiciais

API completa para gerenciamento de processos judiciais e usuários administrativos com autenticação JWT.

## 🚀 Início Rápido

### 1. Autenticação
Todas as rotas (exceto \`/api/auth/*\`) requerem autenticação via JWT no header:
\`\`\`
Authorization: Bearer <seu-token-jwt>
\`\`\`

### 2. Fluxo de Login

**Passo 1:** Fazer login
\`\`\`javascript
POST /api/auth/login
{
  "matricula": "12345",
  "senha": "SenhaForte123",
  "loginType": "admin_super"
}
\`\`\`

**Resposta (primeiro acesso):**
\`\`\`json
{
  "firstLogin": true,
  "userId": 1,
  "loginType": "admin_super"
}
\`\`\`

**Passo 2:** Trocar senha (primeiro acesso)
\`\`\`javascript
POST /api/auth/primeiro-login
{
  "userId": 1,
  "novaSenha": "MinhaSenhaSegura123",
  "loginType": "admin_super"
}
\`\`\`

**Resposta (login completo):**
\`\`\`json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "matricula": "12345",
    "nome": "João Silva",
    "admin_padrao": false,
    "admin_super": true
  }
}
\`\`\`

### 3. Exemplo de Integração (Vue.js / React)

**Axios / Fetch:**
\`\`\`javascript
// Service de autenticação
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Login
async function login(matricula, senha, loginType) {
  const { data } = await api.post('/auth/login', {
    matricula,
    senha,
    loginType
  });

  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
}

// Listar processos
async function getProcessos(page = 1, itemsPerPage = 10) {
  const { data } = await api.get('/admin/processes', {
    params: { page, itemsPerPage }
  });
  return data;
}
\`\`\`

## 📋 Recursos Principais

- ✅ Autenticação JWT com refresh
- ✅ Controle de acesso (admin_super, admin_padrao)
- ✅ CRUD completo de processos
- ✅ Upload de CSV em massa
- ✅ Operações em lote (atribuição, exclusão, cumprimento)
- ✅ Filtros avançados e paginação
- ✅ Rate limiting integrado
- ✅ Logs de auditoria

## 🔒 Segurança

- Headers obrigatórios: \`Authorization\`, \`Content-Type\`
- CORS configurado para origens permitidas
- Rate limiting: 5 tentativas de login / 15 min
- Validação de entrada em todos os endpoints

## 📱 Headers Recomendados

\`\`\`
Content-Type: application/json
Authorization: Bearer <token>
X-Requested-With: XMLHttpRequest
\`\`\`

## 🐛 Tratamento de Erros

Todos os erros seguem o formato:
\`\`\`json
{
  "error": "Mensagem de erro legível",
  "status": 400,
  "details": [] // Opcional: detalhes de validação
}
\`\`\`

Códigos HTTP:
- \`200\`: Sucesso
- \`201\`: Criado
- \`400\`: Dados inválidos
- \`401\`: Não autenticado
- \`403\`: Sem permissão
- \`404\`: Não encontrado
- \`429\`: Muitas tentativas (rate limit)
- \`500\`: Erro no servidor
      `,
      contact: {
        name: 'Equipe de Desenvolvimento',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido através do endpoint /api/auth/login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            matricula: { type: 'string', example: '12345' },
            nome: { type: 'string', example: 'João Silva' },
            admin_padrao: { type: 'boolean', example: false },
            admin_super: { type: 'boolean', example: true },
            senha_padrao: { type: 'boolean', example: false },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Process: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            numero_processo: { type: 'string', example: '1234567-89.2024.8.00.0000' },
            prazo_processual: { type: 'string', example: '15' },
            classe_principal: { type: 'string', example: 'Apelação Cível' },
            assunto_principal: { type: 'string', example: 'Direito Civil' },
            tarjas: { type: 'string', example: 'Urgente' },
            data_intimacao: { type: 'string', format: 'date', example: '2024-01-15' },
            cumprido: { type: 'boolean', example: false },
            reiteracoes: { type: 'integer', example: 0 },
            cumpridoDate: { type: 'string', format: 'date-time', nullable: true },
            observacoes: { type: 'string', example: 'Observação importante', maxLength: 100 },
            userId: { type: 'integer', nullable: true, example: 1 },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['matricula', 'senha', 'loginType'],
          properties: {
            matricula: { type: 'string', example: '12345' },
            senha: { type: 'string', format: 'password', example: 'SenhaForte123' },
            loginType: { type: 'string', enum: ['admin_padrao', 'admin_super'], example: 'admin_super' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer', example: 1 },
                matricula: { type: 'string', example: '12345' },
                nome: { type: 'string', example: 'João Silva' },
                admin_padrao: { type: 'boolean', example: false },
                admin_super: { type: 'boolean', example: true },
              },
            },
          },
        },
        FirstLoginResponse: {
          type: 'object',
          properties: {
            firstLogin: { type: 'boolean', example: true },
            userId: { type: 'integer', example: 1 },
            loginType: { type: 'string', example: 'admin_super' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mensagem de erro' },
            status: { type: 'integer', example: 400 },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            uptime: { type: 'number', example: 12345.67 },
            status: { type: 'string', example: 'ok' },
            timestamp: { type: 'string', format: 'date-time' },
            environment: { type: 'string', example: 'development' },
            version: { type: 'string', example: '1.2.0' },
            database: { type: 'string', example: 'connected' },
            memory: {
              type: 'object',
              properties: {
                used: { type: 'integer', example: 45 },
                total: { type: 'integer', example: 128 },
                unit: { type: 'string', example: 'MB' },
              },
            },
          },
        },
        ProcessListResponse: {
          type: 'object',
          properties: {
            rows: {
              type: 'array',
              items: { $ref: '#/components/schemas/Process' }
            },
            count: { type: 'integer', example: 150, description: 'Total de processos' },
            totalPages: { type: 'integer', example: 15, description: 'Total de páginas' },
          },
        },
        BulkOperationRequest: {
          type: 'object',
          required: ['processIds'],
          properties: {
            processIds: {
              type: 'array',
              items: { type: 'integer' },
              minItems: 1,
              maxItems: 100,
              example: [1, 2, 3, 4, 5],
              description: 'Array de IDs dos processos (máximo 100)'
            }
          }
        },
        BulkAssignRequest: {
          type: 'object',
          required: ['matricula', 'processIds'],
          properties: {
            matricula: {
              type: 'string',
              example: '12345',
              description: 'Matrícula do usuário que receberá os processos'
            },
            processIds: {
              type: 'array',
              items: { type: 'integer' },
              minItems: 1,
              maxItems: 100,
              example: [1, 2, 3],
              description: 'Array de IDs dos processos'
            }
          }
        },
        PreCadastroRequest: {
          type: 'object',
          required: ['matricula', 'nome', 'tipoCadastro'],
          properties: {
            matricula: { type: 'string', example: '12345', minLength: 1, maxLength: 20 },
            nome: { type: 'string', example: 'Maria Santos', minLength: 1, maxLength: 100 },
            tipoCadastro: {
              type: 'string',
              enum: ['usuario', 'admin_padrao', 'admin_super'],
              example: 'admin_padrao',
              description: 'Tipo de usuário: usuario (removido), admin_padrao ou admin_super'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operação realizada com sucesso' },
            data: { type: 'object', description: 'Dados retornados (varia por endpoint)' }
          }
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Dados de entrada inválidos' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Email inválido' }
                }
              }
            }
          }
        }
      },
      examples: {
        LoginSuccess: {
          value: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibG9naW5UeXBlIjoiYWRtaW5fc3VwZXIiLCJpYXQiOjE3MDk1NjgwMDAsImV4cCI6MTcwOTU3NTIwMH0.xxx',
            user: {
              id: 1,
              matricula: '12345',
              nome: 'João Silva',
              admin_padrao: false,
              admin_super: true
            }
          }
        },
        FirstLoginDetected: {
          value: {
            firstLogin: true,
            userId: 1,
            loginType: 'admin_super'
          }
        },
        ProcessList: {
          value: {
            rows: [
              {
                id: 1,
                numero_processo: '1234567-89.2024.8.00.0000',
                prazo_processual: '15',
                classe_principal: 'Apelação Cível',
                assunto_principal: 'Direito Civil',
                tarjas: 'Urgente',
                data_intimacao: '2024-01-15',
                cumprido: false,
                reiteracoes: 0,
                userId: 1,
                User: { nome: 'João Silva' }
              }
            ],
            count: 150,
            totalPages: 15
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Caminhos para os arquivos com anotações
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
