// Configuração do Swagger/OpenAPI
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API do Sistema Distribuidor de Processos',
      version: '1.2.0',
      description: 'API REST para gerenciamento de processos judiciais e usuários administrativos',
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
      },
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
