# CURSO COMPLETO: DESENVOLVIMENTO DE API REST COM NODE.JS, EXPRESS E MYSQL

## 📚 Sobre este Curso

Este curso completo ensina passo a passo como criar uma API REST profissional para gerenciamento de processos judiciais, similar ao projeto **distribuidorback**. Você aprenderá desde os fundamentos até conceitos avançados de desenvolvimento backend.

**O que você vai aprender:**
- Node.js e JavaScript moderno (ES6+)
- Express.js e arquitetura MVC
- MySQL e Sequelize ORM
- Autenticação JWT e segurança web
- Upload de arquivos e processamento de CSV
- Testes, deploy e boas práticas

**Pré-requisitos:**
- Conhecimento básico de programação
- Familiaridade com HTML/CSS/JavaScript
- Vontade de aprender!

---

## 📋 ÍNDICE

### MÓDULO 1 - FUNDAMENTOS E SETUP DO AMBIENTE
- 1.1 - Introdução ao Node.js e NPM
- 1.2 - JavaScript Moderno (ES6+)
- 1.3 - Configuração do Ambiente de Desenvolvimento
- 1.4 - Introdução ao Express.js
- 1.5 - Estrutura de Projeto MVC

### MÓDULO 2 - BANCO DE DADOS E ORM
- 2.1 - Fundamentos de Banco de Dados Relacionais
- 2.2 - MySQL: Instalação e Conceitos
- 2.3 - Introdução ao Sequelize ORM
- 2.4 - Models e Migrations
- 2.5 - Relacionamentos entre Tabelas
- 2.6 - Índices e Otimização

### MÓDULO 3 - AUTENTICAÇÃO E SEGURANÇA
- 3.1 - Fundamentos de Segurança Web
- 3.2 - Criptografia de Senhas com Bcrypt
- 3.3 - JSON Web Tokens (JWT)
- 3.4 - Middlewares de Autenticação
- 3.5 - Proteção contra Ataques Comuns
- 3.6 - Rate Limiting e Helmet

### MÓDULO 4 - CONSTRUINDO A API REST
- 4.1 - Princípios REST
- 4.2 - Rotas e Controllers
- 4.3 - Middlewares de Validação
- 4.4 - Tratamento de Erros
- 4.5 - CORS e Integração com Frontend
- 4.6 - Upload de Arquivos

### MÓDULO 5 - LÓGICA DE NEGÓCIO AVANÇADA
- 5.1 - Processamento de CSV
- 5.2 - Operações em Massa (Bulk Operations)
- 5.3 - Filtros e Paginação
- 5.4 - Sistema de Logging
- 5.5 - Documentação com Swagger

### MÓDULO 6 - TESTES, DEPLOY E MANUTENÇÃO
- 6.1 - Testes Unitários e de Integração
- 6.2 - Variáveis de Ambiente
- 6.3 - Deploy em Produção
- 6.4 - Monitoramento e Logs
- 6.5 - Manutenção e Boas Práticas

---

# MÓDULO 1 - FUNDAMENTOS E SETUP DO AMBIENTE

## 1.1 - Introdução ao Node.js e NPM

### O que é Node.js?

**Node.js** é um ambiente de execução JavaScript construído sobre o motor V8 do Chrome. Ele permite que você execute JavaScript no lado do servidor (backend), não apenas no navegador.

**Características principais:**
- **Assíncrono e orientado a eventos**: Não bloqueia operações de I/O
- **Single-threaded**: Usa um único thread com event loop
- **NPM**: Maior ecossistema de bibliotecas open-source
- **Cross-platform**: Funciona em Windows, Linux e Mac

**Por que usar Node.js?**
- JavaScript tanto no frontend quanto no backend
- Alto desempenho para aplicações de I/O intensivo
- Grande comunidade e ecossistema
- Ideal para APIs REST e aplicações em tempo real

### Instalando Node.js

**Linux (Ubuntu/Debian):**
```bash
# Usando NodeSource (recomendado)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version  # v18.x.x
npm --version   # 9.x.x
```

**Windows:**
1. Baixe o instalador em https://nodejs.org/
2. Execute o instalador (.msi)
3. Siga as instruções
4. Verifique no CMD: `node --version`

**macOS:**
```bash
# Usando Homebrew
brew install node

# Verificar instalação
node --version
npm --version
```

### O que é NPM?

**NPM (Node Package Manager)** é o gerenciador de pacotes do Node.js. Ele permite:
- Instalar bibliotecas de terceiros
- Gerenciar dependências do projeto
- Executar scripts personalizados
- Publicar seus próprios pacotes

**Comandos NPM essenciais:**

```bash
# Inicializar um projeto Node.js
npm init -y

# Instalar uma dependência
npm install express

# Instalar dependência de desenvolvimento
npm install --save-dev nodemon

# Instalar dependência globalmente
npm install -g pm2

# Remover uma dependência
npm uninstall express

# Atualizar dependências
npm update

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Executar scripts do package.json
npm run dev
npm start
npm test
```

### Package.json

O arquivo `package.json` é o coração do projeto Node.js. Ele contém:
- Metadados do projeto (nome, versão, descrição)
- Dependências e devDependencies
- Scripts personalizados
- Configurações do projeto

**Exemplo de package.json:**
```json
{
  "name": "distribuidorback",
  "version": "1.2.0",
  "description": "Sistema de distribuição de processos judiciais",
  "main": "server.js",
  "scripts": {
    "start": "NODE_ENV=production node server.js",
    "dev": "NODE_ENV=development nodemon server.js",
    "test": "jest --coverage"
  },
  "keywords": ["api", "rest", "nodejs", "express"],
  "author": "Seu Nome",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.31.1",
    "mysql2": "^3.12.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0",
    "jest": "^30.2.0"
  }
}
```

**Entendendo as versões:**
- `^4.18.2` - Aceita atualizações de minor e patch (4.x.x)
- `~4.18.2` - Aceita apenas atualizações de patch (4.18.x)
- `4.18.2` - Versão exata

### Primeiro Programa Node.js

Crie um arquivo `hello.js`:

```javascript
// hello.js
console.log('Olá, Node.js!');

// Usar módulos internos
const fs = require('fs');
const path = require('path');

// Ler arquivo
fs.readFile('arquivo.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler arquivo:', err);
    return;
  }
  console.log('Conteúdo:', data);
});

// Informações do sistema
console.log('Versão Node.js:', process.version);
console.log('Diretório atual:', __dirname);
console.log('Arquivo atual:', __filename);
```

Execute:
```bash
node hello.js
```

### Módulos CommonJS vs ES Modules

**CommonJS (padrão no Node.js):**
```javascript
// Exportar
module.exports = {
  soma: (a, b) => a + b,
  subtrai: (a, b) => a - b
};

// Importar
const { soma, subtrai } = require('./math');
```

**ES Modules (moderno):**
```javascript
// Exportar
export const soma = (a, b) => a + b;
export const subtrai = (a, b) => a - b;

// Importar
import { soma, subtrai } from './math.js';
```

**Para usar ES Modules**, adicione no package.json:
```json
{
  "type": "module"
}
```

Neste curso, usaremos **CommonJS** (padrão do projeto distribuidorback).

---

## 1.2 - JavaScript Moderno (ES6+)

### Arrow Functions

**Sintaxe tradicional:**
```javascript
function soma(a, b) {
  return a + b;
}
```

**Arrow function:**
```javascript
const soma = (a, b) => a + b;

// Com múltiplas linhas
const calcular = (a, b) => {
  const resultado = a + b;
  return resultado * 2;
};

// Sem parâmetros
const saudar = () => console.log('Olá!');

// Um parâmetro (parênteses opcionais)
const dobro = x => x * 2;
```

**Diferença importante - `this`:**
```javascript
// Função tradicional: 'this' é dinâmico
function Pessoa() {
  this.idade = 0;

  setInterval(function() {
    this.idade++; // 'this' não se refere à Pessoa
  }, 1000);
}

// Arrow function: 'this' é léxico (herda do contexto)
function Pessoa() {
  this.idade = 0;

  setInterval(() => {
    this.idade++; // 'this' se refere à Pessoa
  }, 1000);
}
```

### Template Literals

**Concatenação tradicional:**
```javascript
const nome = 'João';
const idade = 25;
const mensagem = 'Olá, ' + nome + '! Você tem ' + idade + ' anos.';
```

**Template literals:**
```javascript
const nome = 'João';
const idade = 25;
const mensagem = `Olá, ${nome}! Você tem ${idade} anos.`;

// Multilinhas
const html = `
  <div>
    <h1>${nome}</h1>
    <p>Idade: ${idade}</p>
  </div>
`;

// Expressões
const preco = 100;
const total = `Total: R$ ${preco * 1.1}`;
```

### Destructuring

**Arrays:**
```javascript
const numeros = [1, 2, 3, 4, 5];

// Tradicional
const primeiro = numeros[0];
const segundo = numeros[1];

// Destructuring
const [primeiro, segundo, ...resto] = numeros;
console.log(primeiro); // 1
console.log(segundo);  // 2
console.log(resto);    // [3, 4, 5]

// Pular elementos
const [a, , c] = numeros;
console.log(a); // 1
console.log(c); // 3
```

**Objetos:**
```javascript
const usuario = {
  nome: 'João',
  idade: 25,
  cidade: 'São Paulo',
  email: 'joao@email.com'
};

// Tradicional
const nome = usuario.nome;
const idade = usuario.idade;

// Destructuring
const { nome, idade } = usuario;

// Renomear variáveis
const { nome: nomeUsuario, idade: anos } = usuario;

// Valores padrão
const { nome, pais = 'Brasil' } = usuario;

// Rest operator
const { nome, ...outrosDados } = usuario;
```

**Destructuring em parâmetros de função:**
```javascript
// Tradicional
function exibirUsuario(usuario) {
  console.log(usuario.nome);
  console.log(usuario.idade);
}

// Destructuring
function exibirUsuario({ nome, idade }) {
  console.log(nome);
  console.log(idade);
}

exibirUsuario(usuario);
```

### Spread Operator

**Arrays:**
```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Concatenar
const arr3 = [...arr1, ...arr2];
console.log(arr3); // [1, 2, 3, 4, 5, 6]

// Copiar array
const copia = [...arr1];

// Adicionar elementos
const novo = [0, ...arr1, 4];
console.log(novo); // [0, 1, 2, 3, 4]

// Math.max com array
const numeros = [10, 5, 20, 15];
console.log(Math.max(...numeros)); // 20
```

**Objetos:**
```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// Mesclar objetos
const obj3 = { ...obj1, ...obj2 };
console.log(obj3); // { a: 1, b: 2, c: 3, d: 4 }

// Sobrescrever propriedades
const usuario = { nome: 'João', idade: 25 };
const atualizado = { ...usuario, idade: 26 };
console.log(atualizado); // { nome: 'João', idade: 26 }

// Adicionar propriedades
const completo = { ...usuario, email: 'joao@email.com' };
```

### Async/Await

**Promises tradicionais:**
```javascript
function buscarUsuario(id) {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}
```

**Async/Await:**
```javascript
async function buscarUsuario(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

// Múltiplas operações assíncronas
async function buscarDados() {
  try {
    // Sequencial
    const usuario = await buscarUsuario(1);
    const posts = await buscarPosts(usuario.id);

    // Paralelo (mais rápido)
    const [usuario, posts] = await Promise.all([
      buscarUsuario(1),
      buscarPosts(1)
    ]);

    return { usuario, posts };
  } catch (error) {
    console.error(error);
  }
}
```

### Let, Const e Var

```javascript
// var: escopo de função, hoisting
var x = 10;
if (true) {
  var x = 20; // Mesma variável
}
console.log(x); // 20

// let: escopo de bloco, sem hoisting
let y = 10;
if (true) {
  let y = 20; // Variável diferente
}
console.log(y); // 10

// const: escopo de bloco, não pode ser reatribuída
const z = 10;
z = 20; // Erro!

// Mas objetos const podem ser modificados
const obj = { a: 1 };
obj.a = 2; // OK
obj = {}; // Erro!

// Use sempre const por padrão
// Use let quando precisar reatribuir
// Evite var
```

### Array Methods Modernos

```javascript
const numeros = [1, 2, 3, 4, 5];

// map: transforma cada elemento
const dobrados = numeros.map(n => n * 2);
console.log(dobrados); // [2, 4, 6, 8, 10]

// filter: filtra elementos
const pares = numeros.filter(n => n % 2 === 0);
console.log(pares); // [2, 4]

// find: encontra primeiro elemento
const maior3 = numeros.find(n => n > 3);
console.log(maior3); // 4

// reduce: reduz a um único valor
const soma = numeros.reduce((acc, n) => acc + n, 0);
console.log(soma); // 15

// some: verifica se algum elemento satisfaz
const temPar = numeros.some(n => n % 2 === 0);
console.log(temPar); // true

// every: verifica se todos satisfazem
const todosPares = numeros.every(n => n % 2 === 0);
console.log(todosPares); // false

// forEach: itera sobre elementos
numeros.forEach(n => console.log(n));
```

**Exemplo prático:**
```javascript
const usuarios = [
  { id: 1, nome: 'João', idade: 25, ativo: true },
  { id: 2, nome: 'Maria', idade: 30, ativo: false },
  { id: 3, nome: 'Pedro', idade: 20, ativo: true }
];

// Buscar usuários ativos
const ativos = usuarios.filter(u => u.ativo);

// Buscar nomes dos usuários ativos
const nomesAtivos = usuarios
  .filter(u => u.ativo)
  .map(u => u.nome);

// Soma das idades
const somaIdades = usuarios.reduce((acc, u) => acc + u.idade, 0);

// Média das idades
const mediaIdades = somaIdades / usuarios.length;
```

### Optional Chaining e Nullish Coalescing

**Optional Chaining (?.):**
```javascript
const usuario = {
  nome: 'João',
  endereco: {
    rua: 'Rua A',
    cidade: 'São Paulo'
  }
};

// Tradicional
const cidade = usuario && usuario.endereco && usuario.endereco.cidade;

// Optional chaining
const cidade = usuario?.endereco?.cidade;
console.log(cidade); // 'São Paulo'

const cep = usuario?.endereco?.cep;
console.log(cep); // undefined (não dá erro)

// Com arrays
const primeiro = usuarios?.[0]?.nome;

// Com funções
const resultado = objeto?.metodo?.();
```

**Nullish Coalescing (??):**
```javascript
// || retorna o segundo valor se o primeiro for falsy (0, '', false, null, undefined)
const valor1 = 0 || 10;
console.log(valor1); // 10

// ?? retorna o segundo valor APENAS se o primeiro for null ou undefined
const valor2 = 0 ?? 10;
console.log(valor2); // 0

const nome = null ?? 'Anônimo';
console.log(nome); // 'Anônimo'

const idade = undefined ?? 18;
console.log(idade); // 18

// Combinando
const config = {
  timeout: usuario?.config?.timeout ?? 5000
};
```

---

## 1.3 - Configuração do Ambiente de Desenvolvimento

### Estrutura de Pastas do Projeto

```
distribuidorback/
├── controllers/        # Lógica de negócio
│   ├── adminController.js
│   └── authController.js
├── models/            # Modelos do banco de dados
│   ├── index.js
│   ├── user.js
│   └── process.js
├── routes/            # Definição de rotas
│   ├── admin.js
│   └── auth.js
├── middlewares/       # Middlewares personalizados
│   ├── autenticarAdmin.js
│   ├── validators.js
│   ├── sanitizer.js
│   ├── csrfProtection.js
│   └── errorHandler.js
├── utils/             # Funções utilitárias
│   ├── logger.js
│   ├── helpers.js
│   └── swagger.js
├── scripts/           # Scripts de manutenção
│   ├── fix-indexes.js
│   └── add-performance-indexes.sql
├── tests/             # Testes automatizados
│   ├── unit/
│   └── integration/
├── docs/              # Documentação
│   ├── CSRF-PROTECTION.md
│   ├── ERRO-CORS.md
│   └── FRONTEND-INTEGRATION.md
├── logs/              # Arquivos de log
│   ├── error.log
│   └── combined.log
├── uploads/           # Arquivos enviados
├── .env               # Variáveis de ambiente (NÃO committar)
├── .env.example       # Exemplo de .env
├── .gitignore         # Arquivos ignorados pelo Git
├── package.json       # Dependências e scripts
├── package-lock.json  # Lock de versões exatas
├── server.js          # Arquivo principal
└── README.md          # Documentação principal
```

### Inicializando o Projeto

```bash
# Criar pasta do projeto
mkdir meu-projeto-api
cd meu-projeto-api

# Inicializar Git
git init

# Inicializar NPM
npm init -y

# Criar estrutura de pastas
mkdir controllers models routes middlewares utils tests docs logs uploads scripts
```

### Instalando Dependências

**Dependências principais:**
```bash
npm install express
npm install sequelize mysql2
npm install jsonwebtoken bcryptjs
npm install dotenv
npm install cors helmet compression
npm install express-validator
npm install xss
npm install express-rate-limit
npm install multer csv-parser iconv-lite
npm install winston moment-timezone
npm install swagger-jsdoc swagger-ui-express
```

**Dependências de desenvolvimento:**
```bash
npm install --save-dev nodemon
npm install --save-dev jest supertest
```

**Ou instale tudo de uma vez:**
```bash
npm install express sequelize mysql2 jsonwebtoken bcryptjs dotenv cors helmet compression express-validator xss express-rate-limit multer csv-parser iconv-lite winston moment-timezone swagger-jsdoc swagger-ui-express

npm install --save-dev nodemon jest supertest
```

### Configurando Nodemon

Crie o arquivo `nodemon.json`:

```json
{
  "watch": [
    "server.js",
    "controllers/",
    "models/",
    "routes/",
    "middlewares/",
    "utils/"
  ],
  "ext": "js,json",
  "ignore": [
    "node_modules/",
    "logs/",
    "uploads/",
    "tests/"
  ],
  "exec": "node server.js",
  "env": {
    "NODE_ENV": "development"
  }
}
```

### Configurando Git

Crie o arquivo `.gitignore`:

```
# Dependências
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Ambiente
.env
.env.local
.env.production

# Logs
logs/
*.log

# Uploads
uploads/
*.csv

# Sistema Operacional
.DS_Store
Thumbs.db
desktop.ini

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# Testes
coverage/
.nyc_output/

# Build
dist/
build/
```

### Variáveis de Ambiente

Crie o arquivo `.env`:

```env
# Servidor
NODE_ENV=development
PORT=3000

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha
DB_NAME=distribuidorback
DB_PORT=3306

# JWT
JWT_SECRET=sua_chave_secreta_muito_longa_e_segura_aqui_64_caracteres
JWT_EXPIRATION=2h

# Frontend (CORS)
FRONTEND_URL=http://localhost:8080
FRONTEND_URL_2=http://localhost:3001

# Sequelize
SEQUELIZE_ALTER=false
```

Crie o arquivo `.env.example` (para versionar):

```env
# Servidor
NODE_ENV=development
PORT=3000

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=distribuidorback
DB_PORT=3306

# JWT
JWT_SECRET=
JWT_EXPIRATION=2h

# Frontend (CORS)
FRONTEND_URL=
FRONTEND_URL_2=

# Sequelize
SEQUELIZE_ALTER=false
```

### Scripts NPM

Atualize o `package.json`:

```json
{
  "name": "distribuidorback",
  "version": "1.0.0",
  "description": "API REST para gerenciamento de processos",
  "main": "server.js",
  "scripts": {
    "start": "NODE_ENV=production node server.js",
    "dev": "NODE_ENV=development nodemon server.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:integration": "jest --testPathPattern=tests/integration",
    "check": "node -c server.js",
    "check:security": "npm audit && npm outdated",
    "logs:view": "tail -f logs/combined.log",
    "logs:errors": "tail -f logs/error.log",
    "logs:clear": "rm -f logs/*.log"
  },
  "keywords": ["api", "rest", "nodejs", "express", "mysql"],
  "author": "Seu Nome",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.31.1",
    "mysql2": "^3.12.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^3.0.2",
    "dotenv": "^16.4.7",
    "cors": "^2.8.5",
    "helmet": "^8.1.0",
    "compression": "^1.7.4",
    "express-validator": "^7.3.0",
    "xss": "^1.0.15",
    "express-rate-limit": "^8.2.1",
    "multer": "^1.4.5-lts.1",
    "csv-parser": "^3.0.0",
    "iconv-lite": "^0.6.3",
    "winston": "^3.18.3",
    "moment-timezone": "^0.5.47",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.0",
    "jest": "^30.2.0",
    "supertest": "^7.1.4"
  }
}
```

### IDEs Recomendadas

**Visual Studio Code (recomendado):**
- Download: https://code.visualstudio.com/
- Extensões úteis:
  - ESLint
  - Prettier
  - JavaScript (ES6) code snippets
  - Path Intellisense
  - REST Client
  - GitLens
  - MySQL (cweijan.vscode-mysql-client2)

**Outras opções:**
- WebStorm (pago)
- Sublime Text
- Atom

### Ferramentas de Teste de API

**Postman:**
- Download: https://www.postman.com/downloads/
- Interface gráfica completa
- Coleções de requisições
- Testes automatizados

**Insomnia:**
- Download: https://insomnia.rest/download
- Alternativa ao Postman
- Interface mais simples

**Thunder Client (VS Code):**
- Extensão do VS Code
- Leve e integrada
- Perfeito para testes rápidos

**cURL (linha de comando):**
```bash
# GET
curl http://localhost:3000/api/users

# POST com JSON
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"matricula": "admin", "senha": "12345678"}'

# Com autenticação
curl http://localhost:3000/api/admin/processes \
  -H "Authorization: Bearer SEU_TOKEN_JWT"
```

---

## 1.4 - Introdução ao Express.js

### O que é Express.js?

**Express** é um framework web minimalista e flexível para Node.js. Ele fornece:
- Sistema de roteamento robusto
- Middlewares para processamento de requisições
- Suporte a templates (views)
- Métodos HTTP simplificados
- Integração com diversos bancos de dados

**Por que usar Express?**
- Simples e fácil de aprender
- Grande comunidade e ecossistema
- Altamente customizável
- Performance excelente
- Padrão da indústria

### Primeiro Servidor Express

Crie o arquivo `server.js`:

```javascript
// Importar Express
const express = require('express');

// Criar aplicação Express
const app = express();

// Definir porta
const PORT = process.env.PORT || 3000;

// Rota simples
app.get('/', (req, res) => {
  res.send('Olá, Express!');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});
```

Execute:
```bash
node server.js
```

Acesse no navegador: http://localhost:3000

### Middlewares

**Middlewares** são funções que têm acesso ao objeto de requisição (`req`), ao objeto de resposta (`res`) e à próxima função middleware no ciclo (`next`).

**Estrutura de um middleware:**
```javascript
function meuMiddleware(req, res, next) {
  // Fazer algo antes de processar a requisição
  console.log('Middleware executado!');

  // Chamar próximo middleware
  next();

  // Ou encerrar a requisição
  // res.send('Resposta do middleware');
}

// Usar middleware globalmente
app.use(meuMiddleware);

// Usar middleware em rota específica
app.get('/rota', meuMiddleware, (req, res) => {
  res.send('Rota com middleware');
});
```

**Middlewares integrados do Express:**

```javascript
// Parsear JSON no body
app.use(express.json());

// Parsear dados de formulário
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static('public'));
```

**Exemplo prático:**
```javascript
const express = require('express');
const app = express();

// Middleware de log
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware para parsear JSON
app.use(express.json());

// Middleware de autenticação
function autenticar(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  // Validar token aqui
  req.usuario = { id: 1, nome: 'João' }; // Mock
  next();
}

// Rota pública
app.get('/', (req, res) => {
  res.json({ mensagem: 'Rota pública' });
});

// Rota protegida
app.get('/perfil', autenticar, (req, res) => {
  res.json({ usuario: req.usuario });
});

app.listen(3000);
```

### Rotas HTTP

**Métodos HTTP:**
- **GET**: Buscar dados
- **POST**: Criar dados
- **PUT**: Atualizar dados completos
- **PATCH**: Atualizar dados parciais
- **DELETE**: Deletar dados

```javascript
// GET - Listar todos
app.get('/api/users', (req, res) => {
  res.json({ usuarios: [] });
});

// GET - Buscar por ID
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, nome: 'João' });
});

// POST - Criar
app.post('/api/users', (req, res) => {
  const { nome, email } = req.body;
  res.status(201).json({ id: 1, nome, email });
});

// PUT - Atualizar completo
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  res.json({ id, nome, email });
});

// PATCH - Atualizar parcial
app.patch('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  res.json({ id, ...dados });
});

// DELETE - Deletar
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ mensagem: `Usuário ${id} deletado` });
});
```

### Parâmetros de Requisição

**1. Parâmetros de URL (params):**
```javascript
// Rota: /api/users/:id/posts/:postId
app.get('/api/users/:id/posts/:postId', (req, res) => {
  const { id, postId } = req.params;
  res.json({ userId: id, postId });
});

// Requisição: GET /api/users/123/posts/456
// req.params = { id: '123', postId: '456' }
```

**2. Query strings (query):**
```javascript
app.get('/api/users', (req, res) => {
  const { page, limit, search } = req.query;
  res.json({ page, limit, search });
});

// Requisição: GET /api/users?page=1&limit=10&search=joão
// req.query = { page: '1', limit: '10', search: 'joão' }
```

**3. Body (corpo da requisição):**
```javascript
app.post('/api/users', (req, res) => {
  const { nome, email, idade } = req.body;
  res.json({ nome, email, idade });
});

// Requisição: POST /api/users
// Body: { "nome": "João", "email": "joao@email.com", "idade": 25 }
// req.body = { nome: 'João', email: 'joao@email.com', idade: 25 }
```

**4. Headers:**
```javascript
app.get('/api/info', (req, res) => {
  const token = req.headers.authorization;
  const contentType = req.headers['content-type'];

  res.json({
    token,
    contentType,
    allHeaders: req.headers
  });
});

// Requisição: GET /api/info
// Headers: { Authorization: 'Bearer token123', Content-Type: 'application/json' }
```

### Respostas HTTP

```javascript
// Enviar JSON
res.json({ mensagem: 'Sucesso' });

// Enviar texto
res.send('Olá, mundo!');

// Enviar HTML
res.send('<h1>Título</h1>');

// Status code + JSON
res.status(201).json({ id: 1 });

// Redirecionar
res.redirect('/nova-rota');

// Download de arquivo
res.download('caminho/arquivo.pdf');

// Enviar arquivo
res.sendFile('caminho/arquivo.html');

// Status sem conteúdo
res.sendStatus(204);

// Múltiplos métodos encadeados
res
  .status(200)
  .set('X-Custom-Header', 'valor')
  .json({ data: [] });
```

### Status Codes Importantes

```javascript
// 2xx - Sucesso
200 - OK (sucesso geral)
201 - Created (recurso criado)
204 - No Content (sucesso sem retorno)

// 3xx - Redirecionamento
301 - Moved Permanently
302 - Found (redirect temporário)

// 4xx - Erros do cliente
400 - Bad Request (dados inválidos)
401 - Unauthorized (não autenticado)
403 - Forbidden (sem permissão)
404 - Not Found (não encontrado)
409 - Conflict (conflito, ex: duplicado)
422 - Unprocessable Entity (validação falhou)

// 5xx - Erros do servidor
500 - Internal Server Error
503 - Service Unavailable

// Exemplo de uso
app.post('/api/users', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ erro: 'Email é obrigatório' });
  }

  // Verificar se já existe
  const existe = false; // Mock
  if (existe) {
    return res.status(409).json({ erro: 'Email já cadastrado' });
  }

  // Criar usuário
  res.status(201).json({ id: 1, email });
});
```

### Organizando Rotas

**Arquivo server.js:**
```javascript
const express = require('express');
const app = express();

// Middlewares globais
app.use(express.json());

// Importar rotas
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// Usar rotas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(3000);
```

**Arquivo routes/users.js:**
```javascript
const express = require('express');
const router = express.Router();

// Base: /api/users

router.get('/', (req, res) => {
  res.json({ usuarios: [] });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ id, nome: 'João' });
});

router.post('/', (req, res) => {
  const { nome, email } = req.body;
  res.status(201).json({ id: 1, nome, email });
});

module.exports = router;
```

**Arquivo routes/auth.js:**
```javascript
const express = require('express');
const router = express.Router();

// Base: /api/auth

router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  res.json({ token: 'token_jwt_aqui' });
});

router.post('/logout', (req, res) => {
  res.json({ mensagem: 'Logout realizado' });
});

module.exports = router;
```

### Tratamento de Erros

**Middleware de erro (deve ser o último):**
```javascript
// Rotas
app.get('/erro', (req, res) => {
  throw new Error('Erro proposital!');
});

// Middleware de tratamento de erro
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    erro: err.message || 'Erro interno do servidor',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Rota 404 (deve vir antes do error handler)
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});
```

**Tratamento assíncrono:**
```javascript
// Sem tratamento de erro assíncrono
app.get('/async-erro', async (req, res) => {
  const data = await buscarDados(); // Se der erro, não será capturado
  res.json(data);
});

// Com tratamento (opção 1)
app.get('/async-ok', async (req, res, next) => {
  try {
    const data = await buscarDados();
    res.json(data);
  } catch (erro) {
    next(erro);
  }
});

// Com tratamento (opção 2 - wrapper)
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/async-ok2', asyncHandler(async (req, res) => {
  const data = await buscarDados();
  res.json(data);
}));
```

---

## 1.5 - Estrutura de Projeto MVC

### O que é MVC?

**MVC (Model-View-Controller)** é um padrão arquitetural que divide a aplicação em três camadas:

- **Model**: Gerencia os dados e a lógica de negócio
- **View**: Responsável pela apresentação (interface)
- **Controller**: Intermediário entre Model e View

**No contexto de API REST:**
- **Model**: Esquemas do banco de dados (Sequelize)
- **View**: Não existe (API retorna JSON, não HTML)
- **Controller**: Lógica de processamento das requisições

### Estrutura MVC para API REST

```
distribuidorback/
├── models/               # Model - Dados
│   ├── index.js         # Conexão e relacionamentos
│   ├── user.js          # Modelo de usuário
│   └── process.js       # Modelo de processo
├── controllers/          # Controller - Lógica
│   ├── authController.js
│   └── adminController.js
├── routes/              # Rotas - Mapeamento
│   ├── auth.js
│   └── admin.js
├── middlewares/         # Intermediários
│   ├── autenticarAdmin.js
│   └── validators.js
└── server.js           # Entrada principal
```

### Fluxo de Requisição MVC

```
Cliente → Requisição HTTP
         ↓
    Express Router (routes/)
         ↓
    Middlewares (autenticação, validação)
         ↓
    Controller (lógica de negócio)
         ↓
    Model (consulta ao banco)
         ↓
    Controller (formata resposta)
         ↓
    Resposta JSON → Cliente
```

### Exemplo Completo MVC

**1. Model (models/user.js):**
```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    matricula: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    senha: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    admin_super: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    admin_padrao: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'usuarios',
    timestamps: false
  });

  return User;
};
```

**2. Controller (controllers/userController.js):**
```javascript
const { User } = require('../models');

// Listar todos os usuários
exports.listar = async (req, res) => {
  try {
    const usuarios = await User.findAll({
      attributes: ['id', 'matricula', 'nome', 'admin_super', 'admin_padrao']
    });

    res.json({
      total: usuarios.length,
      dados: usuarios
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
};

// Buscar por ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findByPk(id, {
      attributes: ['id', 'matricula', 'nome', 'admin_super', 'admin_padrao']
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar usuário' });
  }
};

// Criar usuário
exports.criar = async (req, res) => {
  try {
    const { matricula, nome, senha, admin_super, admin_padrao } = req.body;

    // Verificar se matrícula já existe
    const existe = await User.findOne({ where: { matricula } });
    if (existe) {
      return res.status(409).json({ erro: 'Matrícula já cadastrada' });
    }

    // Criar usuário
    const usuario = await User.create({
      matricula,
      nome,
      senha, // Hash será feito no middleware
      admin_super: admin_super || false,
      admin_padrao: admin_padrao || false
    });

    res.status(201).json({
      id: usuario.id,
      matricula: usuario.matricula,
      nome: usuario.nome
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
};

// Atualizar usuário
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, admin_super, admin_padrao } = req.body;

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    await usuario.update({
      nome: nome || usuario.nome,
      admin_super: admin_super !== undefined ? admin_super : usuario.admin_super,
      admin_padrao: admin_padrao !== undefined ? admin_padrao : usuario.admin_padrao
    });

    res.json({
      mensagem: 'Usuário atualizado',
      usuario: {
        id: usuario.id,
        matricula: usuario.matricula,
        nome: usuario.nome
      }
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao atualizar usuário' });
  }
};

// Deletar usuário
exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    await usuario.destroy();

    res.json({ mensagem: 'Usuário deletado com sucesso' });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao deletar usuário' });
  }
};
```

**3. Routes (routes/users.js):**
```javascript
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validarCriacaoUsuario } = require('../middlewares/validators');
const autenticarAdmin = require('../middlewares/autenticarAdmin');

// Todas as rotas requerem autenticação
router.use(autenticarAdmin);

// GET /api/users - Listar todos
router.get('/', userController.listar);

// GET /api/users/:id - Buscar por ID
router.get('/:id', userController.buscarPorId);

// POST /api/users - Criar
router.post('/', validarCriacaoUsuario, userController.criar);

// PUT /api/users/:id - Atualizar
router.put('/:id', userController.atualizar);

// DELETE /api/users/:id - Deletar
router.delete('/:id', userController.deletar);

module.exports = router;
```

**4. Middleware (middlewares/validators.js):**
```javascript
const { body, validationResult } = require('express-validator');

exports.validarCriacaoUsuario = [
  body('matricula')
    .trim()
    .notEmpty().withMessage('Matrícula é obrigatória')
    .isLength({ min: 3, max: 20 }).withMessage('Matrícula deve ter entre 3 e 20 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Matrícula deve conter apenas letras, números, _ e -'),

  body('nome')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ min: 3, max: 100 }).withMessage('Nome deve ter entre 3 e 100 caracteres'),

  body('senha')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Senha deve conter maiúscula, minúscula e número'),

  body('admin_super')
    .optional()
    .isBoolean().withMessage('admin_super deve ser booleano'),

  body('admin_padrao')
    .optional()
    .isBoolean().withMessage('admin_padrao deve ser booleano'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }
    next();
  }
];
```

**5. Server.js (integração):**
```javascript
const express = require('express');
const app = express();
require('dotenv').config();

// Middlewares globais
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rotas
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// Usar rotas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ mensagem: 'API funcionando!' });
});

// Rota 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

### Padrão de Nomenclatura

**Arquivos:**
- Models: `user.js`, `process.js` (singular, minúsculo)
- Controllers: `userController.js`, `authController.js` (camelCase + Controller)
- Routes: `users.js`, `auth.js` (plural ou contexto, minúsculo)

**Funções:**
- Controllers: `listar`, `buscarPorId`, `criar`, `atualizar`, `deletar` (verbos, camelCase)
- Models: `User`, `Process` (PascalCase)
- Middlewares: `autenticarAdmin`, `validarCriacaoUsuario` (camelCase)

**Rotas:**
- GET `/api/users` - Listar
- GET `/api/users/:id` - Buscar
- POST `/api/users` - Criar
- PUT `/api/users/:id` - Atualizar completo
- PATCH `/api/users/:id` - Atualizar parcial
- DELETE `/api/users/:id` - Deletar

### Boas Práticas MVC

**1. Separação de responsabilidades:**
- ✅ Model: APENAS definição de dados e relacionamentos
- ✅ Controller: APENAS lógica de negócio
- ✅ Routes: APENAS mapeamento de rotas
- ❌ Evite: Lógica no model, acesso ao banco na rota

**2. Controllers magros:**
```javascript
// ❌ Ruim: Controller muito complexo
exports.criar = async (req, res) => {
  const usuario = await User.create(req.body);
  const processo = await Process.create({ userId: usuario.id });
  const log = await Log.create({ action: 'criar', userId: usuario.id });
  enviarEmail(usuario.email);
  res.json(usuario);
};

// ✅ Bom: Delegar para serviços
const UserService = require('../services/userService');

exports.criar = async (req, res) => {
  try {
    const usuario = await UserService.criar(req.body);
    res.status(201).json(usuario);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};
```

**3. Validação antes do controller:**
```javascript
// ✅ Bom: Validação no middleware
router.post('/', validarCriacaoUsuario, userController.criar);

// ❌ Ruim: Validação no controller
exports.criar = async (req, res) => {
  if (!req.body.nome) {
    return res.status(400).json({ erro: 'Nome é obrigatório' });
  }
  // ...
};
```

**4. Tratamento de erros consistente:**
```javascript
// utils/errorHandler.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// No controller
if (!usuario) {
  throw new AppError('Usuário não encontrado', 404);
}

// No error handler global
app.use((err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({ erro: err.message });
  }

  console.error(err);
  res.status(500).json({ erro: 'Erro interno' });
});
```

---

# MÓDULO 2 - BANCO DE DADOS E ORM

## 2.1 - Fundamentos de Banco de Dados Relacionais

### O que é um Banco de Dados Relacional?

Um **banco de dados relacional** organiza dados em tabelas (relações) com linhas (registros) e colunas (campos). As tabelas podem se relacionar entre si através de chaves.

**Conceitos fundamentais:**
- **Tabela**: Coleção de dados organizados em linhas e colunas
- **Registro (Row)**: Uma linha da tabela, representa uma entidade
- **Campo (Column)**: Uma coluna da tabela, representa um atributo
- **Chave Primária (Primary Key)**: Identificador único de cada registro
- **Chave Estrangeira (Foreign Key)**: Referência a uma chave primária de outra tabela
- **Relacionamento**: Conexão entre tabelas

**Exemplo de tabela usuarios:**
```
+----+------------+------------------+------------------+
| id | matricula  | nome             | senha            |
+----+------------+------------------+------------------+
| 1  | admin001   | João Silva       | $2a$10$hash...  |
| 2  | admin002   | Maria Santos     | $2a$10$hash...  |
+----+------------+------------------+------------------+
```

### Tipos de Relacionamentos

**1. One-to-One (1:1)**
Um registro em A relaciona-se com exatamente um registro em B.

```
Usuário ←→ Perfil
```

**2. One-to-Many (1:N)**
Um registro em A relaciona-se com vários registros em B.

```
Usuário ←→ Processos
  (1)        (N)

Um usuário tem vários processos.
Um processo pertence a um usuário.
```

**3. Many-to-Many (N:N)**
Múltiplos registros em A relacionam-se com múltiplos em B.

```
Processos ←→ Tags
  (N)          (N)

Um processo tem várias tags.
Uma tag está em vários processos.
```

### SQL - Structured Query Language

**SQL** é a linguagem padrão para interagir com bancos de dados relacionais.

**Comandos principais:**

**DDL (Data Definition Language) - Definição:**
```sql
-- Criar tabela
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  matricula VARCHAR(20) UNIQUE NOT NULL,
  nome VARCHAR(100) NOT NULL,
  senha VARCHAR(100) NOT NULL,
  admin_super BOOLEAN DEFAULT FALSE,
  admin_padrao BOOLEAN DEFAULT FALSE
);

-- Alterar tabela
ALTER TABLE usuarios ADD COLUMN email VARCHAR(100);

-- Deletar tabela
DROP TABLE usuarios;
```

**DML (Data Manipulation Language) - Manipulação:**
```sql
-- Inserir dados
INSERT INTO usuarios (matricula, nome, senha, admin_super)
VALUES ('admin001', 'João Silva', 'hash_senha', TRUE);

-- Buscar dados
SELECT * FROM usuarios;
SELECT id, nome FROM usuarios WHERE admin_super = TRUE;

-- Atualizar dados
UPDATE usuarios SET nome = 'João Pedro' WHERE id = 1;

-- Deletar dados
DELETE FROM usuarios WHERE id = 1;
```

**DQL (Data Query Language) - Consultas:**
```sql
-- Buscar todos
SELECT * FROM usuarios;

-- Buscar com condições
SELECT * FROM usuarios WHERE admin_super = TRUE;

-- Buscar com ordenação
SELECT * FROM usuarios ORDER BY nome ASC;

-- Buscar com limite
SELECT * FROM usuarios LIMIT 10 OFFSET 20;

-- Buscar com agregação
SELECT COUNT(*) as total FROM usuarios;
SELECT AVG(idade) as media FROM usuarios;

-- Buscar com JOIN
SELECT u.nome, p.numero_processo
FROM usuarios u
INNER JOIN processos p ON u.id = p.userId;
```

### Normalização de Dados

**Normalização** é o processo de organizar dados para reduzir redundância e melhorar integridade.

**Primeira Forma Normal (1NF):**
- Cada campo contém apenas valores atômicos (não listas)
- Cada registro é único

```
❌ Ruim:
usuarios: { id: 1, nome: 'João', telefones: '111,222,333' }

✅ Bom:
usuarios: { id: 1, nome: 'João' }
telefones: { id: 1, userId: 1, numero: '111' }
telefones: { id: 2, userId: 1, numero: '222' }
```

**Segunda Forma Normal (2NF):**
- Está em 1NF
- Todos os campos não-chave dependem totalmente da chave primária

**Terceira Forma Normal (3NF):**
- Está em 2NF
- Não há dependências transitivas (campos que dependem de outros campos não-chave)

### Índices

**Índices** aceleram consultas ao criar estruturas de busca otimizadas.

```sql
-- Criar índice
CREATE INDEX idx_matricula ON usuarios(matricula);

-- Índice único
CREATE UNIQUE INDEX idx_email ON usuarios(email);

-- Índice composto
CREATE INDEX idx_nome_matricula ON usuarios(nome, matricula);

-- Remover índice
DROP INDEX idx_matricula ON usuarios;
```

**Quando usar índices:**
- ✅ Campos usados em WHERE
- ✅ Campos usados em JOIN
- ✅ Campos usados em ORDER BY
- ❌ Tabelas pequenas (overhead)
- ❌ Campos raramente consultados

### Transações

**Transações** garantem que operações sejam atômicas (tudo ou nada).

**Propriedades ACID:**
- **Atomicity**: Tudo ou nada
- **Consistency**: Dados sempre consistentes
- **Isolation**: Transações isoladas entre si
- **Durability**: Dados persistem após commit

```sql
-- Iniciar transação
START TRANSACTION;

-- Operações
UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;

-- Confirmar
COMMIT;

-- Ou reverter
ROLLBACK;
```

---

## 2.2 - MySQL: Instalação e Conceitos

### Instalando MySQL

**Linux (Ubuntu/Debian):**
```bash
# Atualizar repositórios
sudo apt update

# Instalar MySQL Server
sudo apt install mysql-server

# Verificar status
sudo systemctl status mysql

# Executar script de segurança
sudo mysql_secure_installation
```

**Windows:**
1. Baixe MySQL Installer em https://dev.mysql.com/downloads/installer/
2. Execute o instalador
3. Escolha "Server only" ou "Developer Default"
4. Configure senha do root
5. Inicie o serviço MySQL

**macOS:**
```bash
# Usando Homebrew
brew install mysql

# Iniciar serviço
brew services start mysql

# Executar segurança
mysql_secure_installation
```

### Acessando MySQL

**Via terminal:**
```bash
# Acessar como root
mysql -u root -p

# Acessar com usuário específico
mysql -u usuario -p -h localhost -D banco_de_dados
```

**Via MySQL Workbench:**
- Download: https://dev.mysql.com/downloads/workbench/
- Interface gráfica completa
- Criação de diagramas ER
- Editor de queries

### Criando Banco de Dados

```sql
-- Criar banco de dados
CREATE DATABASE distribuidorback
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Usar banco de dados
USE distribuidorback;

-- Listar bancos
SHOW DATABASES;

-- Deletar banco
DROP DATABASE distribuidorback;
```

**Charset utf8mb4:**
- Suporta emojis e caracteres especiais
- Recomendado para aplicações modernas
- Evita problemas com acentuação

### Criando Usuário

```sql
-- Criar usuário
CREATE USER 'distribuidor'@'localhost' IDENTIFIED BY 'senha_segura';

-- Conceder privilégios
GRANT ALL PRIVILEGES ON distribuidorback.* TO 'distribuidor'@'localhost';

-- Atualizar privilégios
FLUSH PRIVILEGES;

-- Ver privilégios
SHOW GRANTS FOR 'distribuidor'@'localhost';

-- Remover privilégios
REVOKE ALL PRIVILEGES ON distribuidorback.* FROM 'distribuidor'@'localhost';

-- Deletar usuário
DROP USER 'distribuidor'@'localhost';
```

### Criando Tabelas do Projeto

**Tabela de usuários:**
```sql
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  matricula VARCHAR(20) UNIQUE NOT NULL,
  nome VARCHAR(100) NOT NULL,
  senha VARCHAR(100) NOT NULL,
  senha_padrao BOOLEAN DEFAULT TRUE,
  admin_super BOOLEAN DEFAULT FALSE,
  admin_padrao BOOLEAN DEFAULT FALSE,
  INDEX idx_matricula (matricula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Tabela de processos:**
```sql
CREATE TABLE processos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  numero_processo VARCHAR(50) UNIQUE NOT NULL,
  prazo_processual VARCHAR(20) NOT NULL,
  classe_principal VARCHAR(255),
  assunto_principal VARCHAR(255),
  tarjas VARCHAR(255),
  data_intimacao DATE,
  cumprido BOOLEAN DEFAULT FALSE,
  reiteracoes INT DEFAULT 0,
  cumpridoDate DATETIME,
  observacoes VARCHAR(100) DEFAULT '',
  userId INT,
  INDEX idx_numero_processo (numero_processo),
  INDEX idx_cumprido (cumprido),
  INDEX idx_userId (userId),
  INDEX idx_data_intimacao (data_intimacao),
  FOREIGN KEY (userId) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Tipos de Dados MySQL

**Numéricos:**
```sql
INT           -- -2147483648 a 2147483647
BIGINT        -- Números muito grandes
DECIMAL(10,2) -- Números decimais precisos (ex: dinheiro)
FLOAT         -- Números decimais aproximados
BOOLEAN       -- 0 ou 1 (alias para TINYINT(1))
```

**Texto:**
```sql
CHAR(10)      -- Tamanho fixo (10 caracteres)
VARCHAR(100)  -- Tamanho variável (até 100 caracteres)
TEXT          -- Texto longo (até 65,535 caracteres)
LONGTEXT      -- Texto muito longo (até 4GB)
```

**Data e Hora:**
```sql
DATE          -- YYYY-MM-DD
TIME          -- HH:MM:SS
DATETIME      -- YYYY-MM-DD HH:MM:SS
TIMESTAMP     -- YYYY-MM-DD HH:MM:SS (auto-atualiza)
```

**Outros:**
```sql
ENUM('A', 'B', 'C')  -- Apenas valores permitidos
JSON          -- Dados JSON nativos
BLOB          -- Dados binários (imagens, arquivos)
```

### Comandos Úteis MySQL

```sql
-- Ver tabelas do banco
SHOW TABLES;

-- Ver estrutura da tabela
DESCRIBE usuarios;
SHOW CREATE TABLE usuarios;

-- Ver índices
SHOW INDEX FROM usuarios;

-- Ver tamanho das tabelas
SELECT
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'distribuidorback';

-- Ver quantidade de registros
SELECT COUNT(*) FROM usuarios;

-- Limpar tabela (mantém estrutura)
TRUNCATE TABLE processos;

-- Backup do banco
mysqldump -u root -p distribuidorback > backup.sql

-- Restaurar banco
mysql -u root -p distribuidorback < backup.sql
```

---

## 2.3 - Introdução ao Sequelize ORM

### O que é um ORM?

**ORM (Object-Relational Mapping)** é uma técnica que mapeia objetos JavaScript para tabelas do banco de dados.

**Vantagens:**
- ✅ Escrever JavaScript em vez de SQL
- ✅ Abstração do banco de dados (trocar MySQL por PostgreSQL facilmente)
- ✅ Proteção contra SQL injection
- ✅ Validações automáticas
- ✅ Migrations para controle de versão do schema

**Desvantagens:**
- ❌ Queries complexas podem ser difíceis
- ❌ Performance pode ser inferior ao SQL puro
- ❌ Curva de aprendizado

### Instalando Sequelize

```bash
# Sequelize + driver MySQL
npm install sequelize mysql2

# CLI do Sequelize (opcional)
npm install --save-dev sequelize-cli
```

### Configurando Sequelize

**Arquivo models/index.js:**
```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Criar instância do Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,     // nome do banco
  process.env.DB_USER,     // usuário
  process.env.DB_PASS,     // senha
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,

    // Charset
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },

    // Logging
    logging: process.env.NODE_ENV === 'development' ? console.log : false,

    // Pool de conexões
    pool: {
      max: 5,          // máximo de conexões
      min: 0,          // mínimo de conexões
      acquire: 30000,  // tempo máximo para adquirir conexão (ms)
      idle: 10000      // tempo máximo de inatividade (ms)
    },

    // Timezone
    timezone: '-03:00' // São Paulo
  }
);

// Testar conexão
async function testarConexao() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com MySQL estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error);
    process.exit(1);
  }
}

testarConexao();

// Importar models
const User = require('./user')(sequelize);
const Process = require('./process')(sequelize);

// Definir relacionamentos
User.hasMany(Process, { foreignKey: 'userId' });
Process.belongsTo(User, { foreignKey: 'userId' });

// Sincronizar com banco (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development' && process.env.SEQUELIZE_ALTER === 'true') {
  sequelize.sync({ alter: true })
    .then(() => console.log('📊 Tabelas sincronizadas'))
    .catch(err => console.error('Erro ao sincronizar:', err));
}

// Exportar
module.exports = {
  sequelize,
  User,
  Process
};
```

### Definindo Models

**Arquivo models/user.js:**
```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    matricula: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 20],
        is: /^[a-zA-Z0-9_-]+$/  // apenas letras, números, _ e -
      }
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100]
      }
    },
    senha: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    senha_padrao: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    admin_super: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    admin_padrao: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'usuarios',
    timestamps: false,  // não criar createdAt e updatedAt
    indexes: [
      {
        unique: true,
        fields: ['matricula']
      }
    ]
  });

  return User;
};
```

**Arquivo models/process.js:**
```javascript
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Process = sequelize.define('Process', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero_processo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    prazo_processual: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    classe_principal: {
      type: DataTypes.STRING(255)
    },
    assunto_principal: {
      type: DataTypes.STRING(255)
    },
    tarjas: {
      type: DataTypes.STRING(255)
    },
    data_intimacao: {
      type: DataTypes.DATEONLY  // apenas data, sem hora
    },
    cumprido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reiteracoes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    cumpridoDate: {
      type: DataTypes.DATE  // data e hora
    },
    observacoes: {
      type: DataTypes.STRING(100),
      defaultValue: '',
      validate: {
        len: [0, 100]
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    tableName: 'processos',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['numero_processo']
      },
      {
        fields: ['cumprido']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['data_intimacao']
      }
    ]
  });

  return Process;
};
```

### DataTypes do Sequelize

```javascript
// Strings
DataTypes.STRING         // VARCHAR(255)
DataTypes.STRING(100)    // VARCHAR(100)
DataTypes.CHAR(10)       // CHAR(10)
DataTypes.TEXT           // TEXT
DataTypes.TEXT('long')   // LONGTEXT

// Números
DataTypes.INTEGER        // INT
DataTypes.BIGINT         // BIGINT
DataTypes.FLOAT          // FLOAT
DataTypes.DOUBLE         // DOUBLE
DataTypes.DECIMAL(10, 2) // DECIMAL(10, 2)

// Booleanos
DataTypes.BOOLEAN        // TINYINT(1)

// Data e Hora
DataTypes.DATE           // DATETIME
DataTypes.DATEONLY       // DATE
DataTypes.TIME           // TIME

// Outros
DataTypes.JSON           // JSON
DataTypes.BLOB           // BLOB
DataTypes.ENUM('A', 'B') // ENUM
DataTypes.UUID           // UUID (36 caracteres)
```

### Validações Sequelize

```javascript
{
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,                    // email válido
      notEmpty: true,                   // não vazio
      len: [5, 100],                    // tamanho entre 5 e 100
      is: /^[a-z]+$/i,                 // regex
      isIn: [['admin', 'user']],       // valores permitidos
      isNumeric: true,                  // apenas números
      isInt: true,                      // inteiro
      isDecimal: true,                  // decimal
      isLowercase: true,                // minúsculas
      isUppercase: true,                // maiúsculas
      isUrl: true,                      // URL válida
      isIP: true,                       // IP válido
      isCreditCard: true,               // cartão válido

      // Validação customizada
      isEven(value) {
        if (parseInt(value) % 2 !== 0) {
          throw new Error('Apenas números pares!');
        }
      }
    }
  }
}
```

---

## 2.4 - Models e Migrations

### CRUD com Sequelize

**Create - Criar:**
```javascript
const { User } = require('../models');

// Criar um registro
const usuario = await User.create({
  matricula: 'admin001',
  nome: 'João Silva',
  senha: 'hash_da_senha',
  admin_super: true
});

console.log(usuario.id);        // ID gerado
console.log(usuario.matricula); // admin001

// Criar múltiplos registros
const usuarios = await User.bulkCreate([
  { matricula: 'user001', nome: 'Maria', senha: 'hash1' },
  { matricula: 'user002', nome: 'Pedro', senha: 'hash2' }
]);
```

**Read - Buscar:**
```javascript
// Buscar todos
const todos = await User.findAll();

// Buscar por chave primária
const usuario = await User.findByPk(1);

// Buscar um registro
const admin = await User.findOne({
  where: { matricula: 'admin001' }
});

// Buscar com condições
const admins = await User.findAll({
  where: {
    admin_super: true,
    admin_padrao: false
  }
});

// Buscar específicos campos
const usuarios = await User.findAll({
  attributes: ['id', 'nome', 'matricula']
});

// Buscar e contar
const { count, rows } = await User.findAndCountAll({
  where: { admin_super: true },
  limit: 10,
  offset: 0
});

console.log(`Total: ${count}`);
console.log(`Retornados: ${rows.length}`);
```

**Update - Atualizar:**
```javascript
// Atualizar um registro (opção 1)
const usuario = await User.findByPk(1);
usuario.nome = 'João Pedro';
await usuario.save();

// Atualizar um registro (opção 2)
await usuario.update({ nome: 'João Pedro' });

// Atualizar múltiplos registros
const [quantidade] = await User.update(
  { admin_padrao: true },
  { where: { admin_super: false } }
);

console.log(`${quantidade} registros atualizados`);

// Incrementar/Decrementar
await usuario.increment('reiteracoes', { by: 1 });
await usuario.decrement('reiteracoes', { by: 1 });
```

**Delete - Deletar:**
```javascript
// Deletar um registro (opção 1)
const usuario = await User.findByPk(1);
await usuario.destroy();

// Deletar múltiplos registros
const quantidade = await User.destroy({
  where: { admin_super: false }
});

console.log(`${quantidade} registros deletados`);

// Deletar todos (CUIDADO!)
await User.destroy({ truncate: true });
```

### Operadores de Query

```javascript
const { Op } = require('sequelize');

// Igualdade
await User.findAll({
  where: { nome: 'João' }
});

// Diferente
await User.findAll({
  where: { nome: { [Op.ne]: 'João' } }
});

// LIKE (contém)
await User.findAll({
  where: { nome: { [Op.like]: '%João%' } }
});

// IN (está em)
await User.findAll({
  where: { id: { [Op.in]: [1, 2, 3] } }
});

// NOT IN
await User.findAll({
  where: { id: { [Op.notIn]: [1, 2, 3] } }
});

// Maior que / Menor que
await Process.findAll({
  where: {
    reiteracoes: { [Op.gt]: 5 },    // maior que
    data_intimacao: { [Op.lt]: new Date() }  // menor que
  }
});

// Entre
await Process.findAll({
  where: {
    data_intimacao: {
      [Op.between]: ['2024-01-01', '2024-12-31']
    }
  }
});

// IS NULL / IS NOT NULL
await Process.findAll({
  where: { userId: { [Op.is]: null } }
});

await Process.findAll({
  where: { userId: { [Op.not]: null } }
});

// AND (padrão)
await User.findAll({
  where: {
    admin_super: true,
    admin_padrao: false
  }
});

// OR
await User.findAll({
  where: {
    [Op.or]: [
      { admin_super: true },
      { admin_padrao: true }
    ]
  }
});

// AND + OR complexo
await Process.findAll({
  where: {
    cumprido: false,
    [Op.or]: [
      { classe_principal: 'Cível' },
      { assunto_principal: 'Contrato' }
    ]
  }
});
```

### Ordenação e Paginação

```javascript
// Ordenação
await User.findAll({
  order: [
    ['nome', 'ASC'],     // crescente
    ['id', 'DESC']       // decrescente
  ]
});

// Paginação
const page = 1;
const limit = 10;
const offset = (page - 1) * limit;

const { count, rows } = await User.findAndCountAll({
  limit,
  offset,
  order: [['nome', 'ASC']]
});

console.log(`Página ${page} de ${Math.ceil(count / limit)}`);
console.log(`Total de registros: ${count}`);
console.log(`Registros retornados: ${rows.length}`);
```

### Agregações

```javascript
// Contar
const total = await User.count();
const admins = await User.count({ where: { admin_super: true } });

// Máximo
const maxReiteracoes = await Process.max('reiteracoes');

// Mínimo
const minReiteracoes = await Process.min('reiteracoes');

// Soma
const somaReiteracoes = await Process.sum('reiteracoes');

// Média
const mediaReiteracoes = await Process.aggregate('reiteracoes', 'avg');

// Aggregação avançada
const resultado = await Process.findAll({
  attributes: [
    'userId',
    [sequelize.fn('COUNT', sequelize.col('id')), 'total_processos'],
    [sequelize.fn('SUM', sequelize.col('reiteracoes')), 'total_reiteracoes']
  ],
  group: ['userId']
});
```

### Raw Queries (SQL direto)

Quando o Sequelize não é suficiente:

```javascript
const { sequelize } = require('../models');

// Query SELECT
const [results, metadata] = await sequelize.query(
  'SELECT * FROM usuarios WHERE admin_super = ?',
  {
    replacements: [true],  // parametros seguros
    type: sequelize.QueryTypes.SELECT
  }
);

// Query INSERT/UPDATE/DELETE
await sequelize.query(
  'UPDATE usuarios SET admin_super = ? WHERE id = ?',
  {
    replacements: [true, 1],
    type: sequelize.QueryTypes.UPDATE
  }
);

// Query complexa com JOIN
const processos = await sequelize.query(`
  SELECT p.*, u.nome as usuario_nome
  FROM processos p
  LEFT JOIN usuarios u ON p.userId = u.id
  WHERE p.cumprido = false
  ORDER BY p.data_intimacao DESC
  LIMIT 10
`, {
  type: sequelize.QueryTypes.SELECT
});
```

---

## 2.5 - Relacionamentos entre Tabelas

### Tipos de Relacionamentos Sequelize

**1. One-to-One (1:1) - hasOne / belongsTo:**
```javascript
// Usuário tem um perfil
User.hasOne(Profile, { foreignKey: 'userId' });
Profile.belongsTo(User, { foreignKey: 'userId' });

// Criar com associação
const usuario = await User.create({ nome: 'João' });
await usuario.createProfile({ bio: 'Desenvolvedor' });

// Buscar com include
const usuario = await User.findOne({
  where: { id: 1 },
  include: Profile
});

console.log(usuario.Profile.bio);
```

**2. One-to-Many (1:N) - hasMany / belongsTo:**
```javascript
// Usuário tem vários processos
User.hasMany(Process, { foreignKey: 'userId' });
Process.belongsTo(User, { foreignKey: 'userId' });

// Criar com associação
const usuario = await User.findByPk(1);
await usuario.createProcess({
  numero_processo: '0001234-56.2024.8.01.0001',
  prazo_processual: '5 dias'
});

// Buscar processos do usuário
const processos = await usuario.getProcesses();

// Contar processos
const total = await usuario.countProcesses();

// Buscar usuário com processos
const usuario = await User.findOne({
  where: { id: 1 },
  include: Process
});

console.log(usuario.Processes); // array de processos
```

**3. Many-to-Many (N:N) - belongsToMany:**
```javascript
// Processos têm várias tags, tags têm vários processos
Process.belongsToMany(Tag, {
  through: 'process_tags',
  foreignKey: 'processId'
});
Tag.belongsToMany(Process, {
  through: 'process_tags',
  foreignKey: 'tagId'
});

// Adicionar tag a processo
const processo = await Process.findByPk(1);
const tag = await Tag.findByPk(2);
await processo.addTag(tag);

// Adicionar múltiplas tags
await processo.addTags([tag1, tag2, tag3]);

// Remover tag
await processo.removeTag(tag);

// Buscar processo com tags
const processo = await Process.findOne({
  where: { id: 1 },
  include: Tag
});

console.log(processo.Tags); // array de tags
```

### Include (Eager Loading)

**Include simples:**
```javascript
// Buscar processos com usuário associado
const processos = await Process.findAll({
  include: User
});

processos.forEach(p => {
  console.log(p.numero_processo);
  console.log(p.User?.nome); // nome do usuário
});
```

**Include com condições:**
```javascript
// Apenas processos com usuário
const processos = await Process.findAll({
  include: {
    model: User,
    required: true  // INNER JOIN (não retorna se não tiver usuário)
  }
});

// Include com LEFT JOIN (padrão)
const processos = await Process.findAll({
  include: {
    model: User,
    required: false  // retorna mesmo sem usuário
  }
});
```

**Include com where:**
```javascript
// Buscar processos de admins super
const processos = await Process.findAll({
  include: {
    model: User,
    where: { admin_super: true }
  }
});
```

**Include com attributes:**
```javascript
// Selecionar apenas alguns campos
const processos = await Process.findAll({
  attributes: ['id', 'numero_processo', 'cumprido'],
  include: {
    model: User,
    attributes: ['id', 'nome', 'matricula']
  }
});
```

**Include aninhado:**
```javascript
// Usuário → Processos → Tags
const usuario = await User.findOne({
  where: { id: 1 },
  include: {
    model: Process,
    include: Tag
  }
});

console.log(usuario.Processes[0].Tags);
```

**Include com alias:**
```javascript
// Definir alias no relacionamento
User.hasMany(Process, {
  as: 'MeusProcessos',
  foreignKey: 'userId'
});

// Usar alias no include
const usuario = await User.findOne({
  where: { id: 1 },
  include: {
    model: Process,
    as: 'MeusProcessos'
  }
});

console.log(usuario.MeusProcessos);
```

### Exemplo Prático do Projeto

**models/index.js:**
```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

// Importar models
const User = require('./user')(sequelize);
const Process = require('./process')(sequelize);

// Relacionamento: Um usuário tem vários processos
User.hasMany(Process, {
  foreignKey: 'userId',
  as: 'processos'
});

// Um processo pertence a um usuário
Process.belongsTo(User, {
  foreignKey: 'userId',
  as: 'usuario'
});

module.exports = {
  sequelize,
  User,
  Process
};
```

**Usando no controller:**
```javascript
const { Process, User } = require('../models');

// Listar processos com usuário
exports.listarProcessos = async (req, res) => {
  try {
    const processos = await Process.findAll({
      include: {
        model: User,
        as: 'usuario',
        attributes: ['id', 'nome', 'matricula']
      },
      order: [['data_intimacao', 'DESC']]
    });

    res.json({
      total: processos.length,
      dados: processos
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar processos' });
  }
};

// Listar processos de um usuário específico
exports.processosDoUsuario = async (req, res) => {
  try {
    const { userId } = req.params;

    const usuario = await User.findByPk(userId, {
      include: {
        model: Process,
        as: 'processos',
        where: { cumprido: false }
      }
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome
      },
      total_processos: usuario.processos.length,
      processos: usuario.processos
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar dados' });
  }
};
```

---

## 2.6 - Índices e Otimização

### Por que usar Índices?

Índices aceleram consultas, especialmente em tabelas grandes.

**Sem índice:**
```sql
SELECT * FROM processos WHERE numero_processo = '0001234';
-- Busca sequencial: O(n) - verifica cada linha
```

**Com índice:**
```sql
CREATE INDEX idx_numero_processo ON processos(numero_processo);
SELECT * FROM processos WHERE numero_processo = '0001234';
-- Busca indexada: O(log n) - muito mais rápido
```

### Criando Índices no Sequelize

**No model:**
```javascript
const Process = sequelize.define('Process', {
  // ... campos
}, {
  indexes: [
    // Índice único
    {
      unique: true,
      fields: ['numero_processo']
    },
    // Índice simples
    {
      fields: ['cumprido']
    },
    // Índice composto
    {
      fields: ['userId', 'cumprido']
    },
    // Índice com nome customizado
    {
      name: 'idx_data_intimacao_desc',
      fields: [{ attribute: 'data_intimacao', order: 'DESC' }]
    }
  ]
});
```

**Via migration:**
```javascript
await queryInterface.addIndex('processos', ['userId'], {
  name: 'idx_userId'
});

await queryInterface.addIndex('processos', ['cumprido', 'data_intimacao'], {
  name: 'idx_cumprido_data'
});

// Remover índice
await queryInterface.removeIndex('processos', 'idx_userId');
```

### Índices do Projeto distribuidorback

**Tabela usuarios:**
```sql
CREATE INDEX idx_matricula ON usuarios(matricula);
```

**Tabela processos:**
```sql
CREATE INDEX idx_numero_processo ON processos(numero_processo);
CREATE INDEX idx_cumprido ON processos(cumprido);
CREATE INDEX idx_userId ON processos(userId);
CREATE INDEX idx_data_intimacao ON processos(data_intimacao);
CREATE INDEX idx_cumprido_userId ON processos(cumprido, userId);
```

### Quando usar Índices?

**✅ Use índices em:**
- Campos usados em WHERE
- Campos usados em JOIN
- Campos usados em ORDER BY
- Chaves estrangeiras
- Campos com alta cardinalidade (muitos valores únicos)

**❌ Evite índices em:**
- Tabelas pequenas (< 1000 registros)
- Campos com baixa cardinalidade (poucos valores únicos, ex: sexo)
- Campos raramente consultados
- Tabelas com muitas inserções (overhead)

### Otimizando Queries

**1. Selecionar apenas campos necessários:**
```javascript
// ❌ Ruim
const usuarios = await User.findAll();

// ✅ Bom
const usuarios = await User.findAll({
  attributes: ['id', 'nome', 'matricula']
});
```

**2. Limitar resultados:**
```javascript
// ✅ Sempre use limit em listagens
const processos = await Process.findAll({
  limit: 10,
  offset: 0
});
```

**3. Evitar N+1 queries:**
```javascript
// ❌ Ruim (N+1 problema)
const processos = await Process.findAll();
for (const p of processos) {
  const usuario = await User.findByPk(p.userId); // 1 query por processo!
}

// ✅ Bom (eager loading)
const processos = await Process.findAll({
  include: User  // 1 única query com JOIN
});
```

**4. Usar índices compostos:**
```javascript
// Índice composto para query comum
{
  indexes: [
    {
      fields: ['cumprido', 'userId']
    }
  ]
}

// Query que usa o índice composto
await Process.findAll({
  where: {
    cumprido: false,
    userId: 1
  }
});
```

**5. Cache de resultados:**
```javascript
// Exemplo simples de cache em memória
const cache = {};

async function buscarUsuario(id) {
  const cacheKey = `user_${id}`;

  // Verificar cache
  if (cache[cacheKey]) {
    console.log('Cache hit!');
    return cache[cacheKey];
  }

  // Buscar no banco
  const usuario = await User.findByPk(id);

  // Salvar no cache
  cache[cacheKey] = usuario;

  return usuario;
}
```

### Analisando Performance

**EXPLAIN do MySQL:**
```javascript
const [results] = await sequelize.query(
  'EXPLAIN SELECT * FROM processos WHERE cumprido = false',
  { type: sequelize.QueryTypes.SELECT }
);

console.log(results);
```

**Logging de queries:**
```javascript
const sequelize = new Sequelize(..., {
  logging: (sql, timing) => {
    console.log(`[${timing}ms] ${sql}`);
  },
  benchmark: true  // mostra tempo de execução
});
```

### Script de Performance do Projeto

**scripts/add-performance-indexes.js:**
```javascript
const { sequelize } = require('../models');

async function adicionarIndices() {
  try {
    console.log('Adicionando índices de performance...');

    // Índices na tabela processos
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_cumprido_userId
      ON processos(cumprido, userId)
    `);

    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_data_intimacao_cumprido
      ON processos(data_intimacao, cumprido)
    `);

    console.log('✅ Índices adicionados com sucesso!');
  } catch (erro) {
    console.error('❌ Erro ao adicionar índices:', erro);
  } finally {
    await sequelize.close();
  }
}

adicionarIndices();
```

Execute:
```bash
node scripts/add-performance-indexes.js
```

---

# MÓDULO 3 - AUTENTICAÇÃO E SEGURANÇA

## 3.1 - Fundamentos de Segurança Web

### Principais Vulnerabilidades (OWASP Top 10)

**1. SQL Injection**
Inserção de código SQL malicioso através de inputs.

```javascript
// ❌ VULNERÁVEL
const query = `SELECT * FROM usuarios WHERE nome = '${req.body.nome}'`;
// Se nome = "' OR '1'='1", retorna todos os usuários!

// ✅ SEGURO (Sequelize usa parametrização automática)
await User.findOne({ where: { nome: req.body.nome } });
```

**2. XSS (Cross-Site Scripting)**
Injeção de código JavaScript malicioso.

```javascript
// ❌ VULNERÁVEL
res.send(`<h1>Olá, ${req.body.nome}</h1>`);
// Se nome = "<script>alert('XSS')</script>", executa código!

// ✅ SEGURO (sanitizar input)
const xss = require('xss');
const nomeLimpo = xss(req.body.nome);
res.send(`<h1>Olá, ${nomeLimpo}</h1>`);
```

**3. CSRF (Cross-Site Request Forgery)**
Execução de ações indesejadas em nome do usuário autenticado.

**Proteção:**
- Use JWT (não cookies)
- Valide Origin/Referer headers
- Use tokens CSRF para operações críticas

**4. Autenticação Quebrada**
Falhas no sistema de login/logout.

**Boas práticas:**
- Senhas fortes obrigatórias
- Hash de senhas com bcrypt
- Rate limiting contra brute force
- Tokens com expiração

**5. Exposição de Dados Sensíveis**
Vazamento de informações confidenciais.

**Proteção:**
- HTTPS obrigatório em produção
- Não retornar senhas nas APIs
- Não commitar .env
- Criptografar dados sensíveis

**6. Controle de Acesso Quebrado**
Usuários acessando recursos sem permissão.

```javascript
// ❌ VULNERÁVEL
app.delete('/api/users/:id', async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  // Qualquer um pode deletar qualquer usuário!
});

// ✅ SEGURO (verificar permissões)
app.delete('/api/users/:id', autenticarAdmin, async (req, res) => {
  if (!req.user.admin_super) {
    return res.status(403).json({ erro: 'Sem permissão' });
  }
  await User.destroy({ where: { id: req.params.id } });
});
```

### Princípios de Segurança

**1. Princípio do Menor Privilégio**
Conceda apenas as permissões mínimas necessárias.

**2. Defesa em Profundidade**
Múltiplas camadas de segurança (não confie em apenas uma).

**3. Falha Segura**
Em caso de erro, negue acesso por padrão.

**4. Não Confie no Input do Usuário**
Sempre valide e sanitize dados de entrada.

**5. Mantenha a Segurança Simples**
Código complexo é mais propenso a falhas.

### HTTPS e TLS

**HTTPS** criptografa a comunicação entre cliente e servidor.

**Em produção, sempre use HTTPS:**
```javascript
// Redirecionar HTTP para HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.header('host')}${req.url}`);
  }
  next();
});
```

---

## 3.2 - Criptografia de Senhas com Bcrypt

### Por que Criptografar Senhas?

**Nunca armazene senhas em texto puro!**

Se o banco de dados for comprometido:
- ❌ Texto puro: Atacante tem todas as senhas
- ✅ Hash bcrypt: Senhas são irreversíveis

### O que é Bcrypt?

**Bcrypt** é um algoritmo de hashing projetado para ser lento (dificulta ataques de força bruta).

**Características:**
- **Salt**: Adiciona aleatoriedade ao hash
- **Rounds**: Número de iterações (padrão: 10)
- **Lento**: Projetado para ser computacionalmente caro
- **Irreversível**: Não é possível obter a senha original

### Instalando Bcrypt

```bash
npm install bcryptjs
```

### Usando Bcrypt

**Hash de senha:**
```javascript
const bcrypt = require('bcryptjs');

// Gerar hash (assíncrono)
const senha = '12345678';
const salt = await bcrypt.genSalt(10); // 10 rounds
const hash = await bcrypt.hash(senha, salt);

console.log(hash);
// $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

// Ou em uma linha
const hash = await bcrypt.hash(senha, 10);
```

**Comparar senha:**
```javascript
const senhaDigitada = '12345678';
const hashArmazenado = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

const match = await bcrypt.compare(senhaDigitada, hashArmazenado);

if (match) {
  console.log('Senha correta!');
} else {
  console.log('Senha incorreta!');
}
```

### Implementação no Projeto

**Criar usuário com senha criptografada:**
```javascript
const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.criarUsuario = async (req, res) => {
  try {
    const { matricula, nome, senha } = req.body;

    // Verificar se usuário já existe
    const existe = await User.findOne({ where: { matricula } });
    if (existe) {
      return res.status(409).json({ erro: 'Matrícula já cadastrada' });
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const usuario = await User.create({
      matricula,
      nome,
      senha: senhaHash,
      senha_padrao: true
    });

    res.status(201).json({
      id: usuario.id,
      matricula: usuario.matricula,
      nome: usuario.nome
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
};
```

**Login com verificação de senha:**
```javascript
const bcrypt = require('bcryptjs');
const { User } = require('../models');

exports.login = async (req, res) => {
  try {
    const { matricula, senha } = req.body;

    // Buscar usuário
    const usuario = await User.findOne({ where: { matricula } });
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Comparar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Verificar se é primeiro login
    if (usuario.senha_padrao) {
      return res.json({
        firstLogin: true,
        userId: usuario.id,
        mensagem: 'Troque sua senha no primeiro acesso'
      });
    }

    // Gerar token JWT (próxima seção)
    const token = gerarToken(usuario);

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        matricula: usuario.matricula
      }
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro no login' });
  }
};
```

**Trocar senha no primeiro login:**
```javascript
exports.primeiroLogin = async (req, res) => {
  try {
    const { userId, novaSenha } = req.body;

    // Validar força da senha
    const senhaForteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!senhaForteRegex.test(novaSenha)) {
      return res.status(400).json({
        erro: 'Senha deve ter mínimo 8 caracteres, incluindo maiúscula, minúscula e número'
      });
    }

    // Buscar usuário
    const usuario = await User.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Criptografar nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar senha
    await usuario.update({
      senha: senhaHash,
      senha_padrao: false
    });

    // Gerar token JWT
    const token = gerarToken(usuario);

    res.json({
      token,
      mensagem: 'Senha atualizada com sucesso'
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao trocar senha' });
  }
};
```

### Rounds de Salt

**Mais rounds = mais seguro, mas mais lento:**

```javascript
// 10 rounds (padrão, recomendado)
await bcrypt.hash(senha, 10); // ~65ms

// 12 rounds (mais seguro)
await bcrypt.hash(senha, 12); // ~260ms

// 14 rounds (muito seguro, pode ser lento)
await bcrypt.hash(senha, 14); // ~1040ms
```

**Recomendação:** Use 10 rounds para a maioria das aplicações.

---

## 3.3 - JSON Web Tokens (JWT)

### O que é JWT?

**JWT (JSON Web Token)** é um padrão aberto para transmitir informações de forma segura entre partes como um objeto JSON.

**Estrutura do JWT:**
```
xxxxx.yyyyy.zzzzz

Header.Payload.Signature
```

**Exemplo real:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6MSwiYWRtaW5fc3VwZXIiOnRydWV9.
4pcPyMD09olPSyXnrXCjTwXyr4BsezdI1AVTmud2fU4
```

**Header (Base64):**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload (Base64):**
```json
{
  "id": 1,
  "admin_super": true,
  "iat": 1609459200,
  "exp": 1609545600
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### Vantagens do JWT

- ✅ **Stateless**: Servidor não precisa armazenar sessões
- ✅ **Escalável**: Funciona bem com múltiplos servidores
- ✅ **Seguro**: Assinado criptograficamente
- ✅ **Compacto**: Pode ser enviado via URL, header ou body
- ✅ **Auto-contido**: Contém todas as informações necessárias

### Instalando jsonwebtoken

```bash
npm install jsonwebtoken
```

### Gerando JWT

```javascript
const jwt = require('jsonwebtoken');

// Payload (dados do usuário)
const payload = {
  id: usuario.id,
  loginType: usuario.admin_super ? 'admin_super' : 'admin_padrao'
};

// Secret (deve estar no .env)
const secret = process.env.JWT_SECRET;

// Opções
const options = {
  expiresIn: '2h' // ou '7d', '30d', '1y'
};

// Gerar token
const token = jwt.sign(payload, secret, options);

console.log(token);
```

**Exemplo completo:**
```javascript
function gerarToken(usuario) {
  const payload = {
    id: usuario.id,
    loginType: usuario.admin_super ? 'admin_super' : 'admin_padrao',
    matricula: usuario.matricula
  };

  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '2h' }
  );
}

// Usar no login
const token = gerarToken(usuario);
res.json({ token });
```

### Verificando JWT

```javascript
const jwt = require('jsonwebtoken');

try {
  // Verificar e decodificar token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  console.log(decoded);
  // { id: 1, loginType: 'admin_super', iat: 1609459200, exp: 1609545600 }

  // Usar os dados
  console.log('User ID:', decoded.id);
  console.log('Login Type:', decoded.loginType);

} catch (erro) {
  if (erro.name === 'TokenExpiredError') {
    console.error('Token expirado!');
  } else if (erro.name === 'JsonWebTokenError') {
    console.error('Token inválido!');
  } else {
    console.error('Erro ao verificar token:', erro);
  }
}
```

### Middleware de Autenticação

**middlewares/autenticarAdmin.js:**
```javascript
const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    // 1. Extrair token do header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    // Formato: "Bearer TOKEN_AQUI"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ erro: 'Formato de token inválido' });
    }

    const token = parts[1];

    // 2. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Buscar usuário no banco
    const usuario = await User.findByPk(decoded.id, {
      attributes: ['id', 'matricula', 'nome', 'admin_super', 'admin_padrao']
    });

    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário não encontrado' });
    }

    // 4. Verificar se tem permissão de admin
    if (!usuario.admin_super && !usuario.admin_padrao) {
      return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
    }

    // 5. Anexar usuário ao req para uso nos controllers
    req.user = usuario;
    req.userId = usuario.id;
    req.loginType = decoded.loginType;

    // 6. Continuar para o próximo middleware/controller
    next();

  } catch (erro) {
    if (erro.name === 'TokenExpiredError') {
      return res.status(401).json({ erro: 'Token expirado' });
    } else if (erro.name === 'JsonWebTokenError') {
      return res.status(401).json({ erro: 'Token inválido' });
    } else {
      console.error('Erro na autenticação:', erro);
      return res.status(500).json({ erro: 'Erro na autenticação' });
    }
  }
};
```

**Usando o middleware:**
```javascript
const express = require('express');
const router = express.Router();
const autenticarAdmin = require('../middlewares/autenticarAdmin');
const adminController = require('../controllers/adminController');

// Aplicar autenticação em todas as rotas
router.use(autenticarAdmin);

// Rotas protegidas
router.get('/processes', adminController.listarProcessos);
router.post('/processes', adminController.criarProcesso);
router.delete('/processes/:id', adminController.deletarProcesso);

module.exports = router;
```

### Refresh Tokens

Para sessões mais longas, use refresh tokens:

```javascript
// Gerar access token (curto, 15min)
const accessToken = jwt.sign(
  { id: usuario.id },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// Gerar refresh token (longo, 7 dias)
const refreshToken = jwt.sign(
  { id: usuario.id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);

// Endpoint para renovar token
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Verificar refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Gerar novo access token
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccessToken });
  } catch (erro) {
    res.status(401).json({ erro: 'Refresh token inválido' });
  }
});
```

### Boas Práticas JWT

**1. Use SECRET forte:**
```javascript
// ❌ Ruim
JWT_SECRET=secret123

// ✅ Bom (64+ caracteres aleatórios)
JWT_SECRET=b7f8a2d4e3f7c78e8e9a3d0b5f6d8a3e7c9f2b8e4d1a5c0e2d3f9b6a7d8e4c1f
```

**2. Defina expiração curta:**
```javascript
// ❌ Ruim
{ expiresIn: '30d' }

// ✅ Bom
{ expiresIn: '2h' }
```

**3. Não armazene dados sensíveis:**
```javascript
// ❌ Ruim (JWT é apenas codificado, não criptografado)
const payload = { id: 1, senha: 'hash', cpf: '123.456.789-00' };

// ✅ Bom
const payload = { id: 1, loginType: 'admin_super' };
```

**4. Valide o token em TODAS as requisições protegidas:**
```javascript
// ✅ Sempre use o middleware de autenticação
router.use(autenticarAdmin);
```

---

## 3.4 - Middlewares de Autenticação

### Controle de Acesso Baseado em Papéis (RBAC)

**Verificar admin_super:**
```javascript
// middlewares/verificarAdminSuper.js
module.exports = (req, res, next) => {
  if (!req.user.admin_super) {
    return res.status(403).json({
      erro: 'Acesso negado. Apenas super administradores.'
    });
  }
  next();
};
```

**Verificar admin_padrao ou admin_super:**
```javascript
// middlewares/verificarAdmin.js
module.exports = (req, res, next) => {
  if (!req.user.admin_super && !req.user.admin_padrao) {
    return res.status(403).json({
      erro: 'Acesso negado. Apenas administradores.'
    });
  }
  next();
};
```

**Uso nas rotas:**
```javascript
const autenticarAdmin = require('../middlewares/autenticarAdmin');
const verificarAdminSuper = require('../middlewares/verificarAdminSuper');

// Apenas admin_super pode deletar usuários
router.delete('/users/:id',
  autenticarAdmin,
  verificarAdminSuper,
  adminController.deletarUsuario
);

// Admin_super pode ver todos os processos
// Admin_padrao pode ver apenas seus processos
router.get('/processes',
  autenticarAdmin,
  adminController.listarProcessos
);
```

### Filtragem por Permissão

**No controller:**
```javascript
exports.listarProcessos = async (req, res) => {
  try {
    let where = {};

    // Admin_padrao só vê seus processos
    if (req.loginType === 'admin_padrao') {
      where.userId = req.userId;
    }

    // Admin_super vê todos os processos
    const processos = await Process.findAll({
      where,
      include: {
        model: User,
        attributes: ['id', 'nome', 'matricula']
      },
      order: [['data_intimacao', 'DESC']]
    });

    res.json({
      total: processos.length,
      dados: processos
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar processos' });
  }
};
```

### Ownership Verification

Verificar se o usuário é dono do recurso:

```javascript
// middlewares/verificarPropriedade.js
const { Process } = require('../models');

exports.verificarPropriedadeProcesso = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Admin_super pode editar qualquer processo
    if (req.user.admin_super) {
      return next();
    }

    // Admin_padrao só pode editar seus próprios processos
    const processo = await Process.findByPk(id);
    if (!processo) {
      return res.status(404).json({ erro: 'Processo não encontrado' });
    }

    if (processo.userId !== req.userId) {
      return res.status(403).json({
        erro: 'Você não tem permissão para editar este processo'
      });
    }

    next();
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao verificar propriedade' });
  }
};

// Usar na rota
router.put('/processes/:id',
  autenticarAdmin,
  verificarPropriedadeProcesso,
  adminController.atualizarProcesso
);
```

---

## 3.5 - Proteção contra Ataques Comuns

### Rate Limiting

**Protege contra:**
- Brute force em login
- DDoS (Denial of Service)
- Scraping excessivo

**Instalação:**
```bash
npm install express-rate-limit
```

**Configuração básica:**
```javascript
const rateLimit = require('express-rate-limit');

// Rate limit global (100 requisições por 15 minutos)
const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de requisições
  message: 'Muitas requisições. Tente novamente mais tarde.',
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false
});

app.use('/api/', limiterGlobal);
```

**Rate limit específico para login:**
```javascript
const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas de login
  skipSuccessfulRequests: true, // não conta requisições bem-sucedidas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});

router.post('/login', limiterLogin, authController.login);
```

**Rate limit por IP:**
```javascript
const limiterPorIP = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({
      erro: 'Muitas requisições deste IP'
    });
  }
});
```

**Rate limit para operações em massa:**
```javascript
const limiterBulk = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 operações em massa por minuto
  message: 'Limite de operações em massa excedido'
});

router.post('/bulk-delete', limiterBulk, adminController.bulkDelete);
router.post('/bulk-assign', limiterBulk, adminController.bulkAssign);
```

### Proteção XSS

**Instalação:**
```bash
npm install xss
```

**Middleware de sanitização:**
```javascript
// middlewares/sanitizer.js
const xss = require('xss');

function sanitizeValue(value) {
  if (typeof value === 'string') {
    return xss(value);
  }
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = sanitizeValue(value[key]);
      return acc;
    }, Array.isArray(value) ? [] : {});
  }
  return value;
}

module.exports = (req, res, next) => {
  // Sanitizar body
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  // Sanitizar query
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }

  // Sanitizar params
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
};
```

**Usar globalmente:**
```javascript
const sanitizer = require('./middlewares/sanitizer');

app.use(express.json());
app.use(sanitizer); // Após parsear JSON
```

### Validação de Inputs

**Instalação:**
```bash
npm install express-validator
```

**Middleware de validação:**
```javascript
// middlewares/validators.js
const { body, query, param, validationResult } = require('express-validator');

// Validação de login
exports.validarLogin = [
  body('matricula')
    .trim()
    .notEmpty().withMessage('Matrícula é obrigatória')
    .isLength({ min: 1, max: 20 }).withMessage('Matrícula inválida'),

  body('senha')
    .notEmpty().withMessage('Senha é obrigatória'),

  body('loginType')
    .isIn(['admin_super', 'admin_padrao']).withMessage('Tipo de login inválido'),

  (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }
    next();
  }
];

// Validação de criação de processo
exports.validarCriacaoProcesso = [
  body('numero_processo')
    .trim()
    .notEmpty().withMessage('Número do processo é obrigatório')
    .isLength({ min: 1, max: 50 }).withMessage('Número inválido'),

  body('prazo_processual')
    .trim()
    .notEmpty().withMessage('Prazo processual é obrigatório'),

  body('data_intimacao')
    .optional()
    .isISO8601().withMessage('Data de intimação inválida'),

  body('observacoes')
    .optional()
    .isLength({ max: 100 }).withMessage('Observações devem ter no máximo 100 caracteres'),

  (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }
    next();
  }
];

// Validação de paginação
exports.validarPaginacao = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Página deve ser um número inteiro positivo'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit deve estar entre 1 e 100'),

  (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }
    next();
  }
];

// Validação de ID
exports.validarId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido'),

  (req, res, next) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }
    next();
  }
];
```

**Usar nas rotas:**
```javascript
const { validarLogin, validarCriacaoProcesso } = require('../middlewares/validators');

router.post('/login', validarLogin, authController.login);
router.post('/processes', validarCriacaoProcesso, adminController.criarProcesso);
```

### Proteção CSRF

**middlewares/csrfProtection.js:**
```javascript
module.exports = (req, res, next) => {
  // APIs com JWT geralmente não precisam de CSRF tradicional
  // Mas podemos validar headers customizados

  // Verificar header X-Requested-With
  const requestedWith = req.headers['x-requested-with'];
  if (!requestedWith || requestedWith !== 'XMLHttpRequest') {
    // Permitir apenas se for JSON API
    if (req.headers['content-type']?.includes('application/json')) {
      return next();
    }
    return res.status(403).json({ erro: 'CSRF validation failed' });
  }

  next();
};

// Usar em operações críticas
router.post('/processes/:id/delete', csrfProtection, adminController.deletar);
```

---

## 3.6 - Rate Limiting e Helmet

### Helmet - Headers de Segurança

**Helmet** configura headers HTTP de segurança automaticamente.

**Instalação:**
```bash
npm install helmet
```

**Configuração:**
```javascript
const helmet = require('helmet');

// Configuração básica
app.use(helmet());

// Ou com customizações
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:']
      }
    },
    hsts: {
      maxAge: 31536000, // 1 ano
      includeSubDomains: true,
      preload: true
    }
  })
);
```

**Headers configurados pelo Helmet:**

```
X-DNS-Prefetch-Control: off
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Download-Options: noopen
X-Content-Type-Options: nosniff
X-XSS-Protection: 0
```

### CORS Configurado

**Instalação:**
```bash
npm install cors
```

**Configuração segura:**
```javascript
const cors = require('cors');

// Lista branca de origens permitidas
const whitelist = [
  'https://distribuidorvue.onrender.com',
  'http://localhost:8080',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2
].filter(Boolean); // Remove undefined

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requisições sem origin (Postman, mobile apps)
    if (!origin) {
      return callback(null, true);
    }

    // Verificar se origem está na whitelist
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true, // Permite cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining'],
  maxAge: 86400 // 24 horas (cache de preflight)
};

app.use(cors(corsOptions));
```

### Compressão de Respostas

**Instalação:**
```bash
npm install compression
```

**Configuração:**
```javascript
const compression = require('compression');

// Comprimir respostas maiores que 1KB
app.use(compression({
  threshold: 1024, // 1KB
  level: 6 // nível de compressão (0-9, padrão 6)
}));
```

### Logging de Segurança

**Instalação:**
```bash
npm install winston moment-timezone
```

**Configuração do Winston:**
```javascript
// utils/logger.js
const winston = require('winston');
const moment = require('moment-timezone');

// Formato customizado
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: () => moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss')
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Criar logger
const logger = winston.createLogger({
  level: 'info',
  format: customFormat,
  transports: [
    // Arquivo de erros
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Arquivo geral
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Console em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Métodos customizados
logger.logAuthAttempt = (matricula, success, ip) => {
  logger.info('Auth attempt', {
    matricula,
    success,
    ip,
    timestamp: new Date()
  });
};

logger.logSecurityEvent = (event, details) => {
  logger.warn('Security event', {
    event,
    details,
    timestamp: new Date()
  });
};

module.exports = logger;
```

**Usar no controller:**
```javascript
const logger = require('../utils/logger');

exports.login = async (req, res) => {
  const { matricula, senha } = req.body;

  try {
    const usuario = await User.findOne({ where: { matricula } });

    if (!usuario || !await bcrypt.compare(senha, usuario.senha)) {
      // Log de tentativa falhada
      logger.logAuthAttempt(matricula, false, req.ip);
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Log de sucesso
    logger.logAuthAttempt(matricula, true, req.ip);

    const token = gerarToken(usuario);
    res.json({ token });
  } catch (erro) {
    logger.error('Erro no login', { erro: erro.message });
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};
```

---

# MÓDULO 4 - CONSTRUINDO A API REST

## 4.1 - Princípios REST

### O que é REST?

**REST (Representational State Transfer)** é um estilo arquitetural para sistemas distribuídos, especialmente para APIs web.

**Princípios REST:**

**1. Client-Server**: Separação entre frontend e backend
- Cliente cuida da interface
- Servidor cuida dos dados e lógica

**2. Stateless**: Cada requisição é independente
- Servidor não armazena estado do cliente
- Cada requisição contém todas as informações necessárias

**3. Cacheable**: Respostas podem ser cacheadas
- Melhora performance
- Reduz carga no servidor

**4. Uniform Interface**: Interface padronizada
- Recursos identificados por URIs
- Manipulação via representações (JSON)
- Mensagens autodescritivas
- HATEOAS (links para recursos relacionados)

**5. Layered System**: Sistema em camadas
- Cliente não sabe se está conectado diretamente ao servidor final
- Permite balanceadores de carga, caches, proxies

**6. Code on Demand** (opcional): Servidor pode enviar código executável
- Raramente usado em APIs

### Recursos e URIs

**Recursos** são os dados/objetos que sua API manipula.

**Boas práticas de URIs:**

```
✅ Bom:
GET    /api/users              # Lista de usuários
GET    /api/users/123          # Usuário específico
POST   /api/users              # Criar usuário
PUT    /api/users/123          # Atualizar usuário completo
PATCH  /api/users/123          # Atualizar parcialmente
DELETE /api/users/123          # Deletar usuário

GET    /api/users/123/processes  # Processos do usuário 123

❌ Ruim:
GET    /api/getUsers           # Verbo na URL
POST   /api/createUser         # Verbo na URL
GET    /api/user/123           # Singular no recurso
GET    /api/users/delete/123   # Ação na URL
```

**Regras:**
- Use substantivos no plural
- Use hierarquia para relacionamentos
- Use query strings para filtros/paginação
- Seja consistente

### Métodos HTTP

| Método | Uso | Idempotente | Body | Resposta |
|--------|-----|-------------|------|----------|
| GET | Buscar dados | Sim | Não | 200, 404 |
| POST | Criar recurso | Não | Sim | 201, 400 |
| PUT | Atualizar completo | Sim | Sim | 200, 404 |
| PATCH | Atualizar parcial | Não | Sim | 200, 404 |
| DELETE | Deletar recurso | Sim | Não | 200, 204, 404 |

**Idempotente**: Múltiplas chamadas têm o mesmo efeito que uma única chamada.

### Status Codes

**2xx - Sucesso:**
```
200 OK - Sucesso geral
201 Created - Recurso criado
204 No Content - Sucesso sem retorno
```

**3xx - Redirecionamento:**
```
301 Moved Permanently - Recurso movido permanentemente
304 Not Modified - Cache ainda válido
```

**4xx - Erro do Cliente:**
```
400 Bad Request - Dados inválidos
401 Unauthorized - Não autenticado
403 Forbidden - Sem permissão
404 Not Found - Recurso não encontrado
409 Conflict - Conflito (ex: duplicado)
422 Unprocessable Entity - Validação falhou
429 Too Many Requests - Rate limit excedido
```

**5xx - Erro do Servidor:**
```
500 Internal Server Error - Erro genérico do servidor
503 Service Unavailable - Serviço temporariamente indisponível
```

### Versionamento de API

**Opção 1: Via URL (mais comum):**
```javascript
app.use('/api/v1/users', userRoutesV1);
app.use('/api/v2/users', userRoutesV2);
```

**Opção 2: Via Header:**
```javascript
// Cliente envia:
// Accept: application/vnd.myapi.v2+json

app.use((req, res, next) => {
  const version = req.headers.accept?.match(/v(\d+)/)?.[1] || '1';
  req.apiVersion = version;
  next();
});
```

**Opção 3: Via Query:**
```javascript
GET /api/users?version=2
```

### Paginação

**Query strings para paginação:**
```javascript
GET /api/processes?page=1&limit=20&sortBy=data_intimacao&order=desc

// Controller
exports.listar = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await Process.findAndCountAll({
    limit,
    offset,
    order: [[req.query.sortBy || 'id', req.query.order || 'ASC']]
  });

  res.json({
    page,
    limit,
    total: count,
    totalPages: Math.ceil(count / limit),
    data: rows
  });
};
```

### Filtros

**Query strings para filtros:**
```javascript
GET /api/processes?cumprido=false&classe=Cível&search=contrato

exports.listar = async (req, res) => {
  const where = {};

  // Filtro booleano
  if (req.query.cumprido !== undefined) {
    where.cumprido = req.query.cumprido === 'true';
  }

  // Filtro exato
  if (req.query.classe) {
    where.classe_principal = req.query.classe;
  }

  // Busca textual
  if (req.query.search) {
    where[Op.or] = [
      { numero_processo: { [Op.like]: `%${req.query.search}%` } },
      { assunto_principal: { [Op.like]: `%${req.query.search}%` } }
    ];
  }

  const processos = await Process.findAll({ where });
  res.json(processos);
};
```

---

## 4.2 - Rotas e Controllers

### Estrutura de Rotas

**routes/auth.js:**
```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validarLogin, validarPrimeiroLogin } = require('../middlewares/validators');
const rateLimit = require('express-rate-limit');

// Rate limiter para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Muitas tentativas de login'
});

// POST /api/auth/login
router.post('/login', loginLimiter, validarLogin, authController.login);

// POST /api/auth/primeiro-login
router.post('/primeiro-login', validarPrimeiroLogin, authController.primeiroLogin);

module.exports = router;
```

**routes/admin.js:**
```javascript
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const autenticarAdmin = require('../middlewares/autenticarAdmin');
const { validarPaginacao } = require('../middlewares/validators');

// Autenticar todas as rotas
router.use(autenticarAdmin);

// Usuários
router.get('/users', validarPaginacao, adminController.listarUsuarios);
router.post('/pre-cadastro', adminController.preCadastro);
router.post('/reset-password', adminController.resetPassword);
router.post('/delete-matricula', adminController.deleteMatricula);

// Processos
router.get('/processes', validarPaginacao, adminController.listarProcessos);
router.post('/manual-assign', adminController.manualAssign);
router.post('/bulk-assign', adminController.bulkAssign);
router.post('/bulk-delete', adminController.bulkDelete);
router.patch('/processes/:id/cumprir', adminController.marcarCumprido);
router.put('/processes/:id/observacoes', adminController.atualizarObservacoes);

// Upload
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });
router.post('/upload', upload.single('file'), adminController.uploadCSV);

module.exports = router;
```

### Estrutura de Controllers

**controllers/authController.js:**
```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');

// Gerar token JWT
function gerarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      loginType: usuario.admin_super ? 'admin_super' : 'admin_padrao'
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '2h' }
  );
}

// Login
exports.login = async (req, res) => {
  try {
    const { matricula, senha, loginType } = req.body;

    // Buscar usuário
    const usuario = await User.findOne({ where: { matricula } });

    if (!usuario) {
      logger.logAuthAttempt(matricula, false, req.ip);
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      logger.logAuthAttempt(matricula, false, req.ip);
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Verificar tipo de login
    const isAdminSuper = loginType === 'admin_super';
    const isAdminPadrao = loginType === 'admin_padrao';

    if (isAdminSuper && !usuario.admin_super) {
      return res.status(403).json({ erro: 'Sem permissão para login de super admin' });
    }

    if (isAdminPadrao && !usuario.admin_padrao) {
      return res.status(403).json({ erro: 'Sem permissão para login de admin padrão' });
    }

    // Verificar primeiro login
    if (usuario.senha_padrao) {
      return res.json({
        firstLogin: true,
        userId: usuario.id,
        loginType
      });
    }

    // Login bem-sucedido
    logger.logAuthAttempt(matricula, true, req.ip);

    const token = gerarToken(usuario);
    res.json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        matricula: usuario.matricula,
        loginType
      }
    });
  } catch (erro) {
    logger.error('Erro no login', { erro: erro.message });
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};

// Primeiro login
exports.primeiroLogin = async (req, res) => {
  try {
    const { userId, novaSenha, loginType } = req.body;

    // Validar força da senha
    const senhaForte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!senhaForte.test(novaSenha)) {
      return res.status(400).json({
        erro: 'Senha deve ter mínimo 8 caracteres, incluindo maiúscula, minúscula e número'
      });
    }

    // Buscar usuário
    const usuario = await User.findByPk(userId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Criptografar e atualizar senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    await usuario.update({
      senha: senhaHash,
      senha_padrao: false
    });

    // Gerar token
    const token = gerarToken(usuario);

    res.json({
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        matricula: usuario.matricula,
        loginType
      }
    });
  } catch (erro) {
    logger.error('Erro no primeiro login', { erro: erro.message });
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};
```

**controllers/adminController.js (exemplo parcial):**
```javascript
const { User, Process } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

// Listar processos com filtros
exports.listarProcessos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 20;
    const offset = (page - 1) * itemsPerPage;

    // Construir where baseado em permissões
    let where = {};

    // Admin_padrao só vê seus processos
    if (req.loginType === 'admin_padrao') {
      where.userId = req.userId;
    }

    // Filtros opcionais
    if (req.query.search) {
      where.numero_processo = { [Op.like]: `%${req.query.search}%` };
    }

    if (req.query.cumprido !== undefined) {
      where.cumprido = req.query.cumprido === 'true';
    }

    if (req.query.classe) {
      where.classe_principal = req.query.classe;
    }

    if (req.query.userId && req.loginType === 'admin_super') {
      where.userId = req.query.userId;
    }

    // Buscar processos
    const { count, rows } = await Process.findAndCountAll({
      where,
      include: {
        model: User,
        attributes: ['id', 'nome', 'matricula']
      },
      limit: itemsPerPage,
      offset,
      order: [['data_intimacao', 'DESC']]
    });

    res.json({
      page,
      itemsPerPage,
      totalItems: count,
      totalPages: Math.ceil(count / itemsPerPage),
      data: rows
    });
  } catch (erro) {
    logger.error('Erro ao listar processos', { erro: erro.message });
    res.status(500).json({ erro: 'Erro ao buscar processos' });
  }
};

// Marcar processo como cumprido
exports.marcarCumprido = async (req, res) => {
  try {
    const { id } = req.params;

    const processo = await Process.findByPk(id);
    if (!processo) {
      return res.status(404).json({ erro: 'Processo não encontrado' });
    }

    // Verificar permissão
    if (req.loginType === 'admin_padrao' && processo.userId !== req.userId) {
      return res.status(403).json({ erro: 'Sem permissão para editar este processo' });
    }

    // Atualizar
    await processo.update({
      cumprido: true,
      cumpridoDate: new Date()
    });

    logger.info('Processo marcado como cumprido', {
      processId: id,
      userId: req.userId
    });

    res.json({
      mensagem: 'Processo marcado como cumprido',
      processo
    });
  } catch (erro) {
    logger.error('Erro ao marcar cumprido', { erro: erro.message });
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};

// Atribuir processos em massa
exports.bulkAssign = async (req, res) => {
  try {
    const { processIds, matricula } = req.body;

    // Validar
    if (!Array.isArray(processIds) || processIds.length === 0) {
      return res.status(400).json({ erro: 'Lista de processos inválida' });
    }

    // Buscar usuário
    const usuario = await User.findOne({ where: { matricula } });
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Atualizar processos
    const [atualizado s] = await Process.update(
      { userId: usuario.id },
      { where: { id: { [Op.in]: processIds } } }
    );

    logger.info('Processos atribuídos em massa', {
      quantidade: atualizados,
      userId: usuario.id,
      adminId: req.userId
    });

    res.json({
      mensagem: `${atualizados} processos atribuídos com sucesso`,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        matricula: usuario.matricula
      }
    });
  } catch (erro) {
    logger.error('Erro no bulk assign', { erro: erro.message });
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};
```

---

## 4.3 - Middlewares de Validação

### Express Validator

**middlewares/validators.js (completo):**
```javascript
const { body, query, param, validationResult } = require('express-validator');

// Handler de erros de validação
const handleValidationErrors = (req, res, next) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: erros.array()
    });
  }
  next();
};

// Validar login
exports.validarLogin = [
  body('matricula')
    .trim()
    .notEmpty().withMessage('Matrícula é obrigatória')
    .isLength({ min: 1, max: 20 }).withMessage('Matrícula deve ter entre 1 e 20 caracteres'),

  body('senha')
    .notEmpty().withMessage('Senha é obrigatória'),

  body('loginType')
    .isIn(['admin_super', 'admin_padrao']).withMessage('Tipo de login inválido'),

  handleValidationErrors
];

// Validar primeiro login
exports.validarPrimeiroLogin = [
  body('userId')
    .isInt({ min: 1 }).withMessage('ID de usuário inválido'),

  body('novaSenha')
    .notEmpty().withMessage('Nova senha é obrigatória')
    .isLength({ min: 8 }).withMessage('Senha deve ter no mínimo 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Senha deve conter maiúscula, minúscula e número'),

  body('loginType')
    .isIn(['admin_super', 'admin_padrao']).withMessage('Tipo de login inválido'),

  handleValidationErrors
];

// Validar paginação
exports.validarPaginacao = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Página deve ser um número inteiro positivo'),

  query('itemsPerPage')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Items por página deve estar entre 1 e 100'),

  query('sortBy')
    .optional()
    .isIn(['id', 'nome', 'data_intimacao', 'numero_processo']).withMessage('Campo de ordenação inválido'),

  query('order')
    .optional()
    .isIn(['ASC', 'DESC']).withMessage('Ordem deve ser ASC ou DESC'),

  handleValidationErrors
];

// Validar ID em params
exports.validarId = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido'),

  handleValidationErrors
];

// Validar criação de processo
exports.validarCriacaoProcesso = [
  body('numero_processo')
    .trim()
    .notEmpty().withMessage('Número do processo é obrigatório')
    .isLength({ max: 50 }).withMessage('Número do processo deve ter no máximo 50 caracteres'),

  body('prazo_processual')
    .trim()
    .notEmpty().withMessage('Prazo processual é obrigatório'),

  body('data_intimacao')
    .optional()
    .isISO8601().withMessage('Data de intimação inválida'),

  body('observacoes')
    .optional()
    .isLength({ max: 100 }).withMessage('Observações devem ter no máximo 100 caracteres'),

  handleValidationErrors
];

// Validar bulk operations
exports.validarBulkOperation = [
  body('processIds')
    .isArray({ min: 1 }).withMessage('Lista de processos é obrigatória'),

  body('processIds.*')
    .isInt({ min: 1 }).withMessage('IDs de processos inválidos'),

  handleValidationErrors
];
```

---

## 4.4 - Tratamento de Erros

### Error Handler Global

**middlewares/errorHandler.js:**
```javascript
const logger = require('../utils/logger');

// Classe de erro customizada
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware de erro (deve ser o último)
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log do erro
  logger.error('Erro capturado', {
    erro: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Erros operacionais (esperados)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      erro: err.message
    });
  }

  // Erros do Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: err.errors.map(e => e.message)
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      erro: 'Registro duplicado',
      campo: err.errors[0]?.path
    });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      erro: 'Erro no banco de dados'
    });
  }

  // Erros do JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      erro: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      erro: 'Token expirado'
    });
  }

  // Erro genérico (não esperado)
  res.status(500).json({
    erro: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Rota 404
const notFound = (req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    url: req.originalUrl
  });
};

// Handler de async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
  asyncHandler
};
```

**Usando no server.js:**
```javascript
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Rotas...

// 404 (antes do error handler)
app.use(notFound);

// Error handler (último middleware)
app.use(errorHandler);
```

**Usando AppError nos controllers:**
```javascript
const { AppError } = require('../middlewares/errorHandler');

exports.buscarProcesso = async (req, res, next) => {
  try {
    const { id } = req.params;
    const processo = await Process.findByPk(id);

    if (!processo) {
      throw new AppError('Processo não encontrado', 404);
    }

    res.json(processo);
  } catch (erro) {
    next(erro);
  }
};
```

---

## 4.5 - CORS e Integração com Frontend

### Configuração CORS

**server.js:**
```javascript
const cors = require('cors');

// Whitelist de origens
const whitelist = [
  'https://distribuidorvue.onrender.com',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_2,
  process.env.FRONTEND_URL_3
].filter(Boolean); // Remove undefined

// Opções CORS
const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requisições sem origin (Postman, apps mobile)
    if (!origin) {
      return callback(null, true);
    }

    // Verificar whitelist
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      logger.logSecurityEvent('CORS blocked', { origin });
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
  maxAge: 86400 // 24 horas
};

app.use(cors(corsOptions));
```

### Exemplos de Integração Frontend

**Vue.js com Axios:**
```javascript
// plugins/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.distribuidorback.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado, redirecionar para login
      localStorage.removeItem('token');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Exemplo de uso:**
```javascript
// Login
async login(matricula, senha, loginType) {
  try {
    const response = await api.post('/auth/login', {
      matricula,
      senha,
      loginType
    });

    // Verificar primeiro login
    if (response.data.firstLogin) {
      return { firstLogin: true, userId: response.data.userId };
    }

    // Salvar token
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    return response.data;
  } catch (erro) {
    console.error('Erro no login:', erro.response?.data);
    throw erro;
  }
}

// Listar processos
async listarProcessos(filtros) {
  try {
    const response = await api.get('/admin/processes', {
      params: {
        page: filtros.page || 1,
        itemsPerPage: filtros.itemsPerPage || 20,
        search: filtros.search,
        cumprido: filtros.cumprido,
        classe: filtros.classe
      }
    });

    return response.data;
  } catch (erro) {
    console.error('Erro ao buscar processos:', erro);
    throw erro;
  }
}

// Upload de CSV
async uploadCSV(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });

    return response.data;
  } catch (erro) {
    console.error('Erro no upload:', erro);
    throw erro;
  }
}
```

---

## 4.6 - Upload de Arquivos

### Configuração Multer

**server.js ou middleware separado:**
```javascript
const multer = require('multer');
const path = require('path');
const { AppError } = require('./middlewares/errorHandler');

// Configuração de storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Gerar nome único: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  // Aceitar apenas CSV
  const allowedMimes = [
    'text/csv',
    'application/vnd.ms-excel',
    'text/plain',
    'application/csv'
  ];

  if (allowedMimes.includes(file.mimetype) || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new AppError('Apenas arquivos CSV são permitidos', 400), false);
  }
};

// Configurar multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;
```

### Controller de Upload

**controllers/adminController.js:**
```javascript
const fs = require('fs');
const csv = require('csv-parser');
const iconv = require('iconv-lite');
const { Process } = require('../models');
const logger = require('../utils/logger');

exports.uploadCSV = async (req, res) => {
  try {
    // Verificar se arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ erro: 'Nenhum arquivo enviado' });
    }

    const filePath = req.file.path;
    const processos = [];
    const erros = [];

    // Ler arquivo CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(iconv.decodeStream('latin1')) // Converter de latin1 para utf8
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          try {
            // Validar e processar linha
            const processo = {
              numero_processo: row['Número do Processo'] || row.numero_processo,
              prazo_processual: row['Prazo Processual'] || row.prazo_processual,
              classe_principal: row['Classe Principal'] || row.classe_principal,
              assunto_principal: row['Assunto Principal'] || row.assunto_principal,
              tarjas: row['Tarjas'] || row.tarjas,
              data_intimacao: row['Data de Intimação'] || row.data_intimacao,
              reiteracoes: parseInt(row['Reiterações'] || row.reiteracoes || 0)
            };

            // Validar campos obrigatórios
            if (!processo.numero_processo || !processo.prazo_processual) {
              erros.push({
                linha: processos.length + 1,
                erro: 'Campos obrigatórios faltando'
              });
              return;
            }

            processos.push(processo);
          } catch (erro) {
            erros.push({
              linha: processos.length + 1,
              erro: erro.message
            });
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Deletar arquivo temporário
    fs.unlinkSync(filePath);

    // Salvar processos no banco
    let criados = 0;
    let atualizados = 0;

    for (const processo of processos) {
      const [instance, created] = await Process.upsert(processo, {
        returning: true
      });

      if (created) {
        criados++;
      } else {
        atualizados++;
      }
    }

    logger.info('CSV processado', {
      total: processos.length,
      criados,
      atualizados,
      erros: erros.length,
      userId: req.userId
    });

    res.json({
      mensagem: 'CSV processado com sucesso',
      total: processos.length,
      criados,
      atualizados,
      erros: erros.length > 0 ? erros : undefined
    });
  } catch (erro) {
    // Limpar arquivo em caso de erro
    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }

    logger.error('Erro no upload CSV', { erro: erro.message });
    res.status(500).json({ erro: 'Erro ao processar arquivo' });
  }
};
```

---

# MÓDULO 5 - LÓGICA DE NEGÓCIO AVANÇADA

## 5.1 - Processamento de CSV

### Parsing de CSV com Encoding

**Problema:** Arquivos CSV brasileiros geralmente usam encoding `latin1` (ISO-8859-1) em vez de UTF-8.

**Solução:** Usar `iconv-lite` para converter:

```javascript
const fs = require('fs');
const csv = require('csv-parser');
const iconv = require('iconv-lite');

async function lerCSV(filePath) {
  const dados = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(iconv.decodeStream('latin1')) // Converter latin1 → UTF-8
      .pipe(iconv.encodeStream('utf8'))
      .pipe(csv({
        separator: ';',  // Separador brasileiro
        mapHeaders: ({ header }) => header.trim().toLowerCase().replace(/\s+/g, '_')
      }))
      .on('data', (row) => {
        dados.push(row);
      })
      .on('end', () => {
        resolve(dados);
      })
      .on('error', (erro) => {
        reject(erro);
      });
  });
}
```

### Normalização de Headers

**Problema:** Headers podem ter acentos, espaços, variações.

**Solução:** Normalizar headers:

```javascript
function normalizarHeader(header) {
  return header
    .trim()
    .toLowerCase()
    .normalize('NFD')              // Remover acentos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')    // Substituir caracteres especiais
    .replace(/_+/g, '_')           // Múltiplos underscores → um
    .replace(/^_|_$/g, '');        // Remover underscores das pontas
}

// Exemplo:
normalizarHeader('Número do Processo');  // numero_do_processo
normalizarHeader('Data de Intimação');   // data_de_intimacao
```

### Deduplicação de Dados

**Problema:** CSV pode conter processos duplicados.

**Solução:** Manter o mais recente baseado na data:

```javascript
function removerDuplicatas(processos) {
  const map = new Map();

  for (const processo of processos) {
    const key = processo.numero_processo;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, processo);
      continue;
    }

    // Manter o mais recente
    const dataAtual = new Date(processo.data_intimacao);
    const dataExistente = new Date(existing.data_intimacao);

    if (dataAtual > dataExistente) {
      map.set(key, processo);
    }
  }

  return Array.from(map.values());
}
```

---

## 5.2 - Operações em Massa (Bulk Operations)

### Bulk Create

```javascript
exports.bulkCreate = async (req, res) => {
  try {
    const { processos } = req.body;

    // Validar
    if (!Array.isArray(processos) || processos.length === 0) {
      return res.status(400).json({ erro: 'Lista vazia' });
    }

    // Criar em massa
    const criados = await Process.bulkCreate(processos, {
      validate: true,
      ignoreDuplicates: true,  // Ignorar duplicados
      updateOnDuplicate: ['prazo_processual', 'data_intimacao', 'reiteracoes']
    });

    res.status(201).json({
      mensagem: `${criados.length} processos criados`,
      processos: criados
    });
  } catch (erro) {
    logger.error('Erro no bulk create', { erro: erro.message });
    res.status(500).json({ erro: 'Erro ao criar processos' });
  }
};
```

### Bulk Update

```javascript
exports.bulkUpdate = async (req, res) => {
  try {
    const { processIds, dados } = req.body;

    // Validar
    if (!Array.isArray(processIds) || processIds.length === 0) {
      return res.status(400).json({ erro: 'Lista de IDs inválida' });
    }

    // Atualizar em massa
    const [atualizados] = await Process.update(dados, {
      where: { id: { [Op.in]: processIds } }
    });

    logger.info('Bulk update realizado', {
      quantidade: atualizados,
      userId: req.userId
    });

    res.json({
      mensagem: `${atualizados} processos atualizados`
    });
  } catch (erro) {
    logger.error('Erro no bulk update', { erro: erro.message });
    res.status(500).json({ erro: 'Erro ao atualizar processos' });
  }
};
```

### Bulk Delete

```javascript
exports.bulkDelete = async (req, res) => {
  try {
    const { processIds } = req.body;

    // Validar
    if (!Array.isArray(processIds) || processIds.length === 0) {
      return res.status(400).json({ erro: 'Lista de IDs inválida' });
    }

    // Limite de segurança
    if (processIds.length > 100) {
      return res.status(400).json({
        erro: 'Máximo de 100 processos por vez'
      });
    }

    // Deletar em massa
    const deletados = await Process.destroy({
      where: { id: { [Op.in]: processIds } }
    });

    logger.warn('Bulk delete realizado', {
      quantidade: deletados,
      userId: req.userId,
      processIds
    });

    res.json({
      mensagem: `${deletados} processos deletados`
    });
  } catch (erro) {
    logger.error('Erro no bulk delete', { erro: erro.message });
    res.status(500).json({ erro: 'Erro ao deletar processos' });
  }
};
```

### Transações para Operações Críticas

```javascript
const { sequelize } = require('../models');

exports.bulkAssignComTransacao = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { processIds, matricula } = req.body;

    // Buscar usuário
    const usuario = await User.findOne(
      { where: { matricula } },
      { transaction: t }
    );

    if (!usuario) {
      await t.rollback();
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // Atualizar processos
    const [atualizados] = await Process.update(
      { userId: usuario.id },
      {
        where: { id: { [Op.in]: processIds } },
        transaction: t
      }
    );

    // Commit da transação
    await t.commit();

    res.json({
      mensagem: `${atualizados} processos atribuídos`,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        matricula: usuario.matricula
      }
    });
  } catch (erro) {
    // Rollback em caso de erro
    await t.rollback();

    logger.error('Erro no bulk assign', { erro: erro.message });
    res.status(500).json({ erro: 'Erro ao atribuir processos' });
  }
};
```

---

## 5.3 - Filtros e Paginação Avançados

### Query Builder Dinâmico

```javascript
exports.listarComFiltrosAvancados = async (req, res) => {
  try {
    // Paginação
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Where dinâmico
    const where = {};

    // Filtro de busca textual
    if (req.query.search) {
      where[Op.or] = [
        { numero_processo: { [Op.like]: `%${req.query.search}%` } },
        { classe_principal: { [Op.like]: `%${req.query.search}%` } },
        { assunto_principal: { [Op.like]: `%${req.query.search}%` } }
      ];
    }

    // Filtro booleano
    if (req.query.cumprido !== undefined) {
      where.cumprido = req.query.cumprido === 'true';
    }

    // Filtro exato
    if (req.query.classe) {
      where.classe_principal = req.query.classe;
    }

    // Filtro de intervalo de datas
    if (req.query.dataInicio || req.query.dataFim) {
      where.data_intimacao = {};

      if (req.query.dataInicio) {
        where.data_intimacao[Op.gte] = req.query.dataInicio;
      }

      if (req.query.dataFim) {
        where.data_intimacao[Op.lte] = req.query.dataFim;
      }
    }

    // Filtro de prazo vencido
    if (req.query.prazo === 'vencido') {
      where.data_intimacao = {
        [Op.lt]: new Date()
      };
      where.cumprido = false;
    }

    // Filtro de usuário (admin_super only)
    if (req.query.userId && req.loginType === 'admin_super') {
      where.userId = req.query.userId;
    }

    // Admin_padrao vê apenas seus processos
    if (req.loginType === 'admin_padrao') {
      where.userId = req.userId;
    }

    // Ordenação
    const sortBy = req.query.sortBy || 'data_intimacao';
    const order = req.query.order || 'DESC';
    const ordenacao = [[sortBy, order]];

    // Buscar com include
    const { count, rows } = await Process.findAndCountAll({
      where,
      include: {
        model: User,
        attributes: ['id', 'nome', 'matricula']
      },
      limit,
      offset,
      order: ordenacao,
      distinct: true  // Para contagem correta com include
    });

    // Resposta
    res.json({
      page,
      limit,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (erro) {
    logger.error('Erro ao listar processos', { erro: erro.message });
    res.status(500).json({ erro: 'Erro ao buscar processos' });
  }
};
```

### Estatísticas de Dashboard

```javascript
exports.getDashboardStats = async (req, res) => {
  try {
    const where = {};

    // Admin_padrao vê apenas seus dados
    if (req.loginType === 'admin_padrao') {
      where.userId = req.userId;
    }

    // Aplicar filtros opcionais
    if (req.query.dataInicio || req.query.dataFim) {
      where.data_intimacao = {};

      if (req.query.dataInicio) {
        where.data_intimacao[Op.gte] = req.query.dataInicio;
      }

      if (req.query.dataFim) {
        where.data_intimacao[Op.lte] = req.query.dataFim;
      }
    }

    // Buscar estatísticas em paralelo
    const [
      total,
      cumpridos,
      pendentes,
      vencidos,
      naoAtribuidos
    ] = await Promise.all([
      // Total de processos
      Process.count({ where }),

      // Processos cumpridos
      Process.count({
        where: { ...where, cumprido: true }
      }),

      // Processos pendentes
      Process.count({
        where: { ...where, cumprido: false }
      }),

      // Processos vencidos
      Process.count({
        where: {
          ...where,
          cumprido: false,
          data_intimacao: { [Op.lt]: new Date() }
        }
      }),

      // Processos não atribuídos (apenas admin_super)
      req.loginType === 'admin_super'
        ? Process.count({
            where: { ...where, userId: null }
          })
        : Promise.resolve(0)
    ]);

    res.json({
      total,
      cumpridos,
      pendentes,
      vencidos,
      naoAtribuidos,
      percentualCumpridos: total > 0 ? ((cumpridos / total) * 100).toFixed(2) : 0
    });
  } catch (erro) {
    logger.error('Erro ao buscar estatísticas', { erro: erro.message });
    res.status(500).json({ erro: 'Erro ao buscar estatísticas' });
  }
};
```

---

## 5.4 - Sistema de Logging

### Winston Logger Completo

**utils/logger.js:**
```javascript
const winston = require('winston');
const moment = require('moment-timezone');
const path = require('path');

// Formato customizado
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: () => moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss')
  }),
  winston.format.errors({ stack: true }),
  winston.format.metadata(),
  winston.format.json()
);

// Formato para console (desenvolvimento)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
    }`;
  })
);

// Criar logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  transports: [
    // Arquivo de erros
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),

    // Arquivo combinado
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880,
      maxFiles: 10,
      tailable: true
    }),

    // Arquivo de auditoria
    new winston.transports.File({
      filename: path.join('logs', 'audit.log'),
      level: 'warn',
      maxsize: 5242880,
      maxFiles: 10
    })
  ],

  // Tratamento de exceções não capturadas
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'exceptions.log')
    })
  ],

  // Tratamento de promessas rejeitadas
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'rejections.log')
    })
  ]
});

// Console em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Métodos customizados
logger.logAuthAttempt = (matricula, success, ip, metadata = {}) => {
  const message = success
    ? `Login bem-sucedido: ${matricula}`
    : `Tentativa de login falhou: ${matricula}`;

  logger.info(message, {
    event: 'auth_attempt',
    matricula,
    success,
    ip,
    ...metadata
  });
};

logger.logSecurityEvent = (event, details = {}) => {
  logger.warn(`Evento de segurança: ${event}`, {
    event: 'security',
    type: event,
    ...details
  });
};

logger.logDataChange = (action, model, id, userId, data = {}) => {
  logger.info(`Alteração de dados: ${action}`, {
    event: 'data_change',
    action,
    model,
    id,
    userId,
    ...data
  });
};

module.exports = logger;
```

### Logging Middleware

```javascript
// middlewares/requestLogger.js
const logger = require('../utils/logger');

module.exports = (req, res, next) => {
  const start = Date.now();

  // Log após resposta
  res.on('finish', () => {
    const duration = Date.now() - start;

    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };

    // Log de erro
    if (res.statusCode >= 400) {
      logger.error(`${req.method} ${req.originalUrl}`, logData);
    }
    // Log de warn (lentidão)
    else if (duration > 1000) {
      logger.warn(`Requisição lenta: ${req.method} ${req.originalUrl}`, logData);
    }
    // Log normal
    else {
      logger.info(`${req.method} ${req.originalUrl}`, logData);
    }
  });

  next();
};
```

**Usar no server.js:**
```javascript
const requestLogger = require('./middlewares/requestLogger');

app.use(requestLogger);
```

---

## 5.5 - Documentação com Swagger

### Configuração Swagger

**utils/swagger.js:**
```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Distribuidor Back API',
      version: '1.0.0',
      description: 'API REST para gerenciamento de processos judiciais',
      contact: {
        name: 'Suporte',
        email: 'suporte@distribuidorback.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Desenvolvimento'
      },
      {
        url: 'https://api.distribuidorback.com',
        description: 'Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            matricula: { type: 'string' },
            nome: { type: 'string' },
            admin_super: { type: 'boolean' },
            admin_padrao: { type: 'boolean' }
          }
        },
        Process: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            numero_processo: { type: 'string' },
            prazo_processual: { type: 'string' },
            classe_principal: { type: 'string' },
            assunto_principal: { type: 'string' },
            data_intimacao: { type: 'string', format: 'date' },
            cumprido: { type: 'boolean' },
            reiteracoes: { type: 'integer' },
            observacoes: { type: 'string' },
            userId: { type: 'integer' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            erro: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};
```

### Documentar Rotas

**routes/auth.js:**
```javascript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de administrador
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - matricula
 *               - senha
 *               - loginType
 *             properties:
 *               matricula:
 *                 type: string
 *                 example: admin001
 *               senha:
 *                 type: string
 *                 example: senha123
 *               loginType:
 *                 type: string
 *                 enum: [admin_super, admin_padrao]
 *                 example: admin_super
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', limiterLogin, validarLogin, authController.login);
```

**Usar no server.js:**
```javascript
const { specs, swaggerUi } = require('./utils/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }'
}));
```

---

# MÓDULO 6 - TESTES, DEPLOY E MANUTENÇÃO

## 6.1 - Testes Unitários e de Integração

### Configuração Jest

**jest.config.js:**
```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'middlewares/**/*.js',
    '!**/*.test.js'
  ],
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['./tests/setup.js']
};
```

**tests/setup.js:**
```javascript
const { sequelize } = require('../models');

// Configurar ambiente de teste
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'distribuidorback_test';

// Antes de todos os testes
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// Após todos os testes
afterAll(async () => {
  await sequelize.close();
});
```

### Testes Unitários

**tests/unit/helpers.test.js:**
```javascript
const { validarSenhaForte, normalizarHeader } = require('../../utils/helpers');

describe('Helpers - Validação de Senha', () => {
  test('Deve aceitar senha forte', () => {
    expect(validarSenhaForte('Senha123')).toBe(true);
    expect(validarSenhaForte('MyP@ssw0rd')).toBe(true);
  });

  test('Deve rejeitar senha fraca', () => {
    expect(validarSenhaForte('123456')).toBe(false);
    expect(validarSenhaForte('senha')).toBe(false);
    expect(validarSenhaForte('SENHA123')).toBe(false); // sem minúscula
  });
});

describe('Helpers - Normalização de Header', () => {
  test('Deve normalizar headers corretamente', () => {
    expect(normalizarHeader('Número do Processo')).toBe('numero_do_processo');
    expect(normalizarHeader('Data de Intimação')).toBe('data_de_intimacao');
  });
});
```

### Testes de Integração

**tests/integration/auth.test.js:**
```javascript
const request = require('supertest');
const app = require('../../server');
const { User } = require('../../models');
const bcrypt = require('bcryptjs');

describe('Autenticação API', () => {
  let usuario;

  beforeEach(async () => {
    // Criar usuário de teste
    usuario = await User.create({
      matricula: 'test001',
      nome: 'Teste',
      senha: await bcrypt.hash('Senha123', 10),
      admin_super: true,
      senha_padrao: false
    });
  });

  afterEach(async () => {
    // Limpar banco
    await User.destroy({ where: {}, truncate: true });
  });

  describe('POST /api/auth/login', () => {
    test('Deve fazer login com credenciais válidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          matricula: 'test001',
          senha: 'Senha123',
          loginType: 'admin_super'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.matricula).toBe('test001');
    });

    test('Deve rejeitar credenciais inválidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          matricula: 'test001',
          senha: 'SenhaErrada',
          loginType: 'admin_super'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('erro');
    });
  });
});
```

**Executar testes:**
```bash
# Todos os testes
npm test

# Com cobertura
npm test -- --coverage

# Modo watch
npm run test:watch

# Apenas unitários
npm run test:unit
```

---

## 6.2 - Variáveis de Ambiente

### Arquivo .env

**.env (exemplo):**
```env
# Ambiente
NODE_ENV=production

# Servidor
PORT=3000

# Banco de Dados
DB_HOST=sao.domcloud.co
DB_USER=distribuidor
DB_PASS=senha_super_segura_aqui
DB_NAME=distribuidor_proc
DB_PORT=3306

# JWT
JWT_SECRET=b7f8a2d4e3f7c78e8e9a3d0b5f6d8a3e7c9f2b8e4d1a5c0e2d3f9b6a7d8e4c1f
JWT_EXPIRATION=2h

# Frontend CORS
FRONTEND_URL=https://distribuidorvue.onrender.com
FRONTEND_URL_2=http://localhost:8080

# Logging
LOG_LEVEL=info

# Sequelize
SEQUELIZE_ALTER=false
```

### Validação de Variáveis

**utils/validateEnv.js:**
```javascript
function validateEnv() {
  const required = [
    'DB_HOST',
    'DB_USER',
    'DB_PASS',
    'DB_NAME',
    'JWT_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Variáveis de ambiente faltando:');
    missing.forEach(key => console.error(`  - ${key}`));
    process.exit(1);
  }

  // Validar JWT_SECRET
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET deve ter no mínimo 32 caracteres');
    process.exit(1);
  }

  console.log('✅ Variáveis de ambiente validadas');
}

module.exports = validateEnv;
```

**Usar no server.js:**
```javascript
require('dotenv').config();
const validateEnv = require('./utils/validateEnv');

validateEnv();
// ... resto do código
```

---

## 6.3 - Deploy em Produção

### Preparação para Deploy

**1. Criar script de build:**
```json
// package.json
{
  "scripts": {
    "start": "NODE_ENV=production node server.js",
    "build": "npm ci --production"
  }
}
```

**2. Otimizar dependências:**
```bash
# Remover devDependencies
npm prune --production
```

**3. Habilitar variáveis de produção:**
```env
NODE_ENV=production
SEQUELIZE_ALTER=false
LOG_LEVEL=warn
```

### Deploy no Render.com

**render.yaml:**
```yaml
services:
  - type: web
    name: distribuidorback
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_HOST
        sync: false
      - key: DB_USER
        sync: false
      - key: DB_PASS
        sync: false
      - key: DB_NAME
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: PORT
        value: 3000
```

**Passos:**
1. Criar conta no Render.com
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente
4. Deploy automático

### Deploy no Heroku

```bash
# Login
heroku login

# Criar app
heroku create distribuidorback

# Configurar variáveis
heroku config:set NODE_ENV=production
heroku config:set DB_HOST=seu_host
heroku config:set JWT_SECRET=sua_chave

# Deploy
git push heroku main

# Ver logs
heroku logs --tail
```

### Deploy com PM2

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'distribuidorback',
    script: './server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    max_memory_restart: '1G'
  }]
};
```

**Comandos PM2:**
```bash
# Iniciar
pm2 start ecosystem.config.js

# Parar
pm2 stop distribuidorback

# Restart
pm2 restart distribuidorback

# Monitorar
pm2 monit

# Logs
pm2 logs

# Salvar configuração
pm2 save

# Auto-iniciar no boot
pm2 startup
```

---

## 6.4 - Monitoramento e Logs

### Health Check

**server.js:**
```javascript
const os = require('os');
const { sequelize } = require('./models');

app.get('/health', async (req, res) => {
  try {
    // Verificar conexão com banco
    await sequelize.authenticate();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(os.totalmem() / 1024 / 1024)
      },
      database: 'connected'
    });
  } catch (erro) {
    res.status(503).json({
      status: 'unhealthy',
      error: erro.message
    });
  }
});
```

### Análise de Logs

**Scripts úteis:**
```bash
# Ver logs em tempo real
tail -f logs/combined.log

# Ver apenas erros
tail -f logs/error.log

# Buscar por palavra-chave
grep "login" logs/combined.log

# Contar erros
grep -c "error" logs/error.log

# Últimas 100 linhas
tail -n 100 logs/combined.log
```

---

## 6.5 - Manutenção e Boas Práticas

### Checklist de Segurança

- [ ] Senhas criptografadas com bcrypt
- [ ] JWT com SECRET forte (64+ caracteres)
- [ ] HTTPS obrigatório em produção
- [ ] CORS configurado com whitelist
- [ ] Rate limiting habilitado
- [ ] Validação de inputs em todas as rotas
- [ ] Sanitização XSS
- [ ] Headers de segurança (Helmet)
- [ ] Logs de auditoria
- [ ] .env no .gitignore
- [ ] Dependências atualizadas
- [ ] SQL Injection protegido (ORM)

### Monitoramento de Dependências

```bash
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente
npm audit fix

# Verificar dependências desatualizadas
npm outdated

# Atualizar dependência específica
npm update express

# Atualizar todas
npm update
```

### Backup do Banco de Dados

**Script de backup:**
```bash
#!/bin/bash
# backup.sh

DATA=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="./backups"
DB_NAME="distribuidor_proc"

mkdir -p $BACKUP_DIR

mysqldump -u root -p $DB_NAME > "$BACKUP_DIR/backup_$DATA.sql"

echo "Backup criado: backup_$DATA.sql"

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

### Boas Práticas de Código

**1. Use async/await em vez de callbacks:**
```javascript
// ❌ Ruim
User.findByPk(1, (err, user) => {
  if (err) return console.error(err);
  console.log(user);
});

// ✅ Bom
const user = await User.findByPk(1);
```

**2. Trate erros adequadamente:**
```javascript
// ✅ Sempre use try-catch
try {
  const resultado = await operacaoAssincrona();
} catch (erro) {
  logger.error('Erro na operação', { erro: erro.message });
  throw new AppError('Erro ao processar', 500);
}
```

**3. Evite lógica no modelo:**
```javascript
// ❌ Ruim: Lógica no model
const User = sequelize.define('User', {
  // ...
  methods: {
    async enviarEmail() { /* ... */ }
  }
});

// ✅ Bom: Lógica no service ou controller
```

**4. Use constantes para magic numbers:**
```javascript
// ❌ Ruim
await bcrypt.hash(senha, 10);

// ✅ Bom
const BCRYPT_ROUNDS = 10;
await bcrypt.hash(senha, BCRYPT_ROUNDS);
```

---

## CONCLUSÃO

Parabéns! Você completou o curso completo de desenvolvimento de API REST com Node.js, Express e MySQL.

**Você aprendeu:**
- ✅ Fundamentos de Node.js e JavaScript ES6+
- ✅ Express.js e arquitetura MVC
- ✅ MySQL e Sequelize ORM
- ✅ Autenticação JWT e segurança web
- ✅ Rate limiting, validação, sanitização
- ✅ Upload de arquivos e processamento CSV
- ✅ Operações em massa e transações
- ✅ Logging, monitoramento e documentação
- ✅ Testes automatizados
- ✅ Deploy e manutenção em produção

**Próximos passos:**
1. Implemente o projeto completo do zero
2. Adicione features extras (notificações, relatórios, etc)
3. Crie um frontend com Vue.js ou React
4. Explore tecnologias complementares (Redis, WebSockets, GraphQL)
5. Contribua para projetos open-source

**Recursos adicionais:**
- Documentação oficial: https://nodejs.org/ | https://expressjs.com/ | https://sequelize.org/
- GitHub do projeto: https://github.com/distribuidorback
- Comunidade Node.js Brasil
- Stack Overflow

**Boa sorte em sua jornada de desenvolvimento!** 🚀

