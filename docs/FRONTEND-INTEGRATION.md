# 🚀 Guia de Integração Frontend

Guia completo para integração da API do Sistema Distribuidor de Processos com seu frontend (Vue.js, React, Angular, etc).

## 📋 Índice

- [Configuração Inicial](#configuração-inicial)
- [Autenticação](#autenticação)
- [Serviços da API](#serviços-da-api)
- [Exemplos Práticos](#exemplos-práticos)
- [Tratamento de Erros](#tratamento-de-erros)
- [Boas Práticas](#boas-práticas)

---

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
# Axios (recomendado)
npm install axios

# Ou use fetch nativo do navegador (não precisa instalar)
```

### 2. Criar Service Base

Crie um arquivo `api/config.js`:

```javascript
import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // Recomendado para segurança
  },
  timeout: 10000 // 10 segundos
});

// Interceptor: Adiciona token automaticamente em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Trata erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se token expirou (401), redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Se rate limit (429), mostra mensagem amigável
    if (error.response?.status === 429) {
      console.error('Muitas requisições. Aguarde um momento.');
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 🔐 Autenticação

### Service de Autenticação

Crie `api/auth.service.js`:

```javascript
import api from './config';

export const authService = {
  /**
   * Realiza login do usuário
   * @param {string} matricula - Matrícula do usuário
   * @param {string} senha - Senha
   * @param {string} loginType - 'admin_super' ou 'admin_padrao'
   * @returns {Promise<Object>} Token e dados do usuário
   */
  async login(matricula, senha, loginType) {
    try {
      const { data } = await api.post('/auth/login', {
        matricula,
        senha,
        loginType
      });

      // Se é primeiro login, retorna flag
      if (data.firstLogin) {
        return {
          firstLogin: true,
          userId: data.userId,
          loginType: data.loginType
        };
      }

      // Se login completo, salva token e usuário
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  },

  /**
   * Troca senha no primeiro acesso
   * @param {number} userId - ID do usuário
   * @param {string} novaSenha - Nova senha (mín 8 caracteres, letra maiúscula, minúscula e número)
   * @param {string} loginType - Tipo de login
   */
  async firstLogin(userId, novaSenha, loginType) {
    try {
      const { data } = await api.post('/auth/primeiro-login', {
        userId,
        novaSenha,
        loginType
      });

      // Salva token e usuário
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  },

  /**
   * Faz logout removendo dados do localStorage
   */
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  /**
   * Retorna usuário logado do localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Verifica se usuário é admin_super
   */
  isAdminSuper() {
    const user = this.getCurrentUser();
    return user?.admin_super === true;
  },

  /**
   * Trata erros de autenticação
   */
  handleAuthError(error) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          return new Error(data.error || 'Credenciais inválidas');
        case 403:
          return new Error(data.error || 'Sem permissão de administrador');
        case 404:
          return new Error('Usuário não encontrado');
        case 429:
          return new Error('Muitas tentativas. Aguarde 15 minutos.');
        default:
          return new Error(data.error || 'Erro ao autenticar');
      }
    }

    return new Error('Erro de conexão com o servidor');
  }
};
```

---

## 📦 Serviços da API

### Service de Processos

Crie `api/process.service.js`:

```javascript
import api from './config';

export const processService = {
  /**
   * Lista processos com paginação e filtros
   * @param {Object} params - Parâmetros de busca
   * @param {number} params.page - Página atual (padrão: 1)
   * @param {number} params.itemsPerPage - Itens por página (padrão: 10)
   * @param {string} params.search - Busca por nº do processo
   * @param {boolean} params.cumprido - Filtro de cumprido (true/false/null)
   * @param {Array} params.classe - Filtro de classe judicial
   * @param {Array} params.userId - Filtro por usuário (apenas admin_super)
   */
  async listProcesses(params = {}) {
    const { data } = await api.get('/admin/processes', { params });
    return data; // { rows: [], count: 150, totalPages: 15 }
  },

  /**
   * Busca processo por ID
   */
  async getProcess(id) {
    const { data } = await api.get(`/admin/processes/${id}`);
    return data;
  },

  /**
   * Atualiza observações de um processo
   */
  async updateObservacoes(processId, observacoes) {
    const { data } = await api.put(`/admin/processes/${processId}/observacoes`, {
      observacoes
    });
    return data;
  },

  /**
   * Marca processo como cumprido
   */
  async markAsCumprido(processId) {
    const { data } = await api.patch(`/admin/processes/${processId}/cumprir`);
    return data;
  },

  /**
   * Desfaz cumprimento de processo
   */
  async unmarkAsCumprido(processId) {
    const { data } = await api.patch(`/admin/processes/${processId}/desfazer-cumprir`);
    return data;
  },

  /**
   * Upload de CSV para importação em massa
   * @param {File} file - Arquivo CSV
   */
  async uploadCSV(file) {
    const formData = new FormData();
    formData.append('csvFile', file);

    const { data } = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  },

  /**
   * Atribuição manual de processo
   */
  async manualAssign(numeroProcesso, matricula) {
    const { data } = await api.post('/admin/manual-assign', {
      processo: numeroProcesso,
      matricula
    });
    return data;
  },

  /**
   * Atribuição em massa (até 100 processos)
   */
  async bulkAssign(matricula, processIds) {
    const { data } = await api.post('/admin/bulk-assign', {
      matricula,
      processIds
    });
    return data;
  },

  /**
   * Exclusão em massa (até 100 processos)
   */
  async bulkDelete(processIds) {
    const { data } = await api.post('/admin/bulk-delete', {
      processIds
    });
    return data;
  },

  /**
   * Marca múltiplos processos como cumpridos (até 100)
   */
  async bulkMarkCumprido(processIds) {
    const { data } = await api.post('/admin/bulk-cumprido', {
      processIds
    });
    return data;
  },

  /**
   * Atualiza contador de reiterações
   */
  async updateReiteracoes(processId, reiteracoes) {
    const { data } = await api.post('/admin/update-intim', {
      processId,
      reiteracoes
    });
    return data;
  }
};
```

### Service de Usuários

Crie `api/user.service.js`:

```javascript
import api from './config';

export const userService = {
  /**
   * Lista todos os usuários (com paginação)
   */
  async listUsers(limit = 1000, offset = 0) {
    const { data } = await api.get('/admin/users', {
      params: { limit, offset }
    });
    return data; // Array de { id, matricula, nome }
  },

  /**
   * Pré-cadastra um novo usuário
   * @param {string} matricula - Matrícula única
   * @param {string} nome - Nome completo
   * @param {string} tipoCadastro - 'admin_padrao' ou 'admin_super'
   */
  async preCadastro(matricula, nome, tipoCadastro) {
    const { data } = await api.post('/admin/pre-cadastro', {
      matricula,
      nome,
      tipoCadastro
    });
    return data;
  },

  /**
   * Reseta senha de um usuário para "12345678"
   */
  async resetPassword(matricula) {
    const { data } = await api.post('/admin/reset-password', {
      matricula
    });
    return data;
  },

  /**
   * Exclui usuário por matrícula
   */
  async deleteUser(matricula) {
    const { data } = await api.post('/admin/delete-matricula', {
      matricula
    });
    return data;
  }
};
```

### Service de Estatísticas

Crie `api/stats.service.js`:

```javascript
import api from './config';

export const statsService = {
  /**
   * Retorna estatísticas do dashboard
   */
  async getDashboardStats() {
    const { data } = await api.get('/admin/stats/dashboard');
    return data;
    /* Retorna:
    {
      totalProcessos: 150,
      totalNaoCumpridos: 80,
      totalCumpridos: 70,
      totalNaoAtribuidos: 15,
      totalVencidos: 10,
      totalAVencer: 70,
      processosCumpridos30Dias: 45
    }
    */
  },

  /**
   * Retorna contagem de processos não atribuídos
   */
  async getUnassignedCount() {
    const { data } = await api.get('/admin/stats/unassigned-count');
    return data; // { count: 15 }
  },

  /**
   * Verifica saúde da API
   */
  async healthCheck() {
    const { data } = await api.get('/health');
    return data;
  }
};
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Componente de Login (Vue.js)

```vue
<template>
  <div class="login-page">
    <h1>Login - Sistema Distribuidor</h1>

    <form @submit.prevent="handleLogin">
      <input
        v-model="form.matricula"
        type="text"
        placeholder="Matrícula"
        required
      />

      <input
        v-model="form.senha"
        type="password"
        placeholder="Senha"
        required
      />

      <select v-model="form.loginType" required>
        <option value="">Selecione o tipo</option>
        <option value="admin_padrao">Admin Padrão</option>
        <option value="admin_super">Admin Super</option>
      </select>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>

    <!-- Modal para primeiro login -->
    <div v-if="showFirstLoginModal" class="modal">
      <h2>Primeiro Acesso - Defina sua senha</h2>
      <input
        v-model="newPassword"
        type="password"
        placeholder="Nova senha (mín 8 caracteres)"
        minlength="8"
      />
      <button @click="handleFirstLogin">Confirmar</button>
    </div>
  </div>
</template>

<script>
import { authService } from '@/api/auth.service';

export default {
  data() {
    return {
      form: {
        matricula: '',
        senha: '',
        loginType: ''
      },
      loading: false,
      error: null,
      showFirstLoginModal: false,
      firstLoginData: null,
      newPassword: ''
    };
  },

  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = null;

      try {
        const result = await authService.login(
          this.form.matricula,
          this.form.senha,
          this.form.loginType
        );

        // Se é primeiro login
        if (result.firstLogin) {
          this.firstLoginData = result;
          this.showFirstLoginModal = true;
          return;
        }

        // Login completo, redireciona
        this.$router.push('/dashboard');

      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async handleFirstLogin() {
      if (this.newPassword.length < 8) {
        this.error = 'Senha deve ter no mínimo 8 caracteres';
        return;
      }

      try {
        await authService.firstLogin(
          this.firstLoginData.userId,
          this.newPassword,
          this.firstLoginData.loginType
        );

        this.showFirstLoginModal = false;
        this.$router.push('/dashboard');

      } catch (error) {
        this.error = error.message;
      }
    }
  }
};
</script>
```

### Exemplo 2: Listagem de Processos (React)

```javascript
import React, { useState, useEffect } from 'react';
import { processService } from '../api/process.service';

function ProcessList() {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: 10,
    totalPages: 1,
    count: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    cumprido: null
  });

  useEffect(() => {
    loadProcesses();
  }, [pagination.page, filters]);

  async function loadProcesses() {
    setLoading(true);
    try {
      const data = await processService.listProcesses({
        page: pagination.page,
        itemsPerPage: pagination.itemsPerPage,
        search: filters.search,
        cumprido: filters.cumprido
      });

      setProcesses(data.rows);
      setPagination(prev => ({
        ...prev,
        count: data.count,
        totalPages: data.totalPages
      }));
    } catch (error) {
      console.error('Erro ao carregar processos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkCumprido(processId) {
    try {
      await processService.markAsCumprido(processId);
      loadProcesses(); // Recarrega lista
    } catch (error) {
      alert('Erro ao marcar processo como cumprido');
    }
  }

  return (
    <div className="process-list">
      <h1>Processos</h1>

      {/* Filtros */}
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nº do processo"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          value={filters.cumprido ?? ''}
          onChange={(e) => setFilters({
            ...filters,
            cumprido: e.target.value === '' ? null : e.target.value === 'true'
          })}
        >
          <option value="">Todos</option>
          <option value="false">Não cumpridos</option>
          <option value="true">Cumpridos</option>
        </select>
      </div>

      {/* Tabela */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nº Processo</th>
              <th>Classe</th>
              <th>Prazo</th>
              <th>Usuário</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {processes.map(proc => (
              <tr key={proc.id}>
                <td>{proc.numero_processo}</td>
                <td>{proc.classe_principal}</td>
                <td>{proc.prazo_processual} dias</td>
                <td>{proc.User?.nome || 'Não atribuído'}</td>
                <td>{proc.cumprido ? 'Cumprido' : 'Pendente'}</td>
                <td>
                  {!proc.cumprido && (
                    <button onClick={() => handleMarkCumprido(proc.id)}>
                      Marcar Cumprido
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Paginação */}
      <div className="pagination">
        <button
          disabled={pagination.page === 1}
          onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
        >
          Anterior
        </button>

        <span>Página {pagination.page} de {pagination.totalPages}</span>

        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default ProcessList;
```

### Exemplo 3: Upload de CSV (Vue.js)

```vue
<template>
  <div class="csv-upload">
    <h2>Importar Processos via CSV</h2>

    <input
      type="file"
      ref="fileInput"
      accept=".csv"
      @change="handleFileSelect"
    />

    <button
      @click="uploadCSV"
      :disabled="!selectedFile || uploading"
    >
      {{ uploading ? 'Enviando...' : 'Enviar CSV' }}
    </button>

    <p v-if="result" class="success">{{ result }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { processService } from '@/api/process.service';

export default {
  data() {
    return {
      selectedFile: null,
      uploading: false,
      result: null,
      error: null
    };
  },

  methods: {
    handleFileSelect(event) {
      const file = event.target.files[0];

      // Validações
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) { // 5MB
        this.error = 'Arquivo muito grande. Máximo 5MB.';
        return;
      }

      if (!file.name.endsWith('.csv')) {
        this.error = 'Apenas arquivos CSV são permitidos.';
        return;
      }

      this.selectedFile = file;
      this.error = null;
    },

    async uploadCSV() {
      if (!this.selectedFile) return;

      this.uploading = true;
      this.error = null;
      this.result = null;

      try {
        const response = await processService.uploadCSV(this.selectedFile);
        this.result = `CSV importado com sucesso! ${response.totalRows || 0} processos importados.`;

        // Limpa seleção
        this.selectedFile = null;
        this.$refs.fileInput.value = '';

        // Emite evento para recarregar lista
        this.$emit('csv-imported');

      } catch (error) {
        this.error = error.response?.data?.error || 'Erro ao importar CSV';
      } finally {
        this.uploading = false;
      }
    }
  }
};
</script>
```

---

## ⚠️ Tratamento de Erros

### Códigos HTTP e Significados

| Código | Significado | Como Tratar |
|--------|-------------|-------------|
| **200** | Sucesso | Operação concluída |
| **201** | Criado | Recurso criado com sucesso |
| **400** | Dados inválidos | Mostrar erros de validação |
| **401** | Não autenticado | Redirecionar para login |
| **403** | Sem permissão | Mostrar mensagem de acesso negado |
| **404** | Não encontrado | Mostrar recurso não existe |
| **429** | Rate limit | Mostrar "muitas requisições, aguarde" |
| **500** | Erro servidor | Mostrar erro genérico |

### Exemplo de Tratamento

```javascript
async function handleApiCall() {
  try {
    const data = await processService.listProcesses();
    return data;

  } catch (error) {
    // Erro de validação (400)
    if (error.response?.status === 400) {
      const details = error.response.data.details;
      if (details) {
        details.forEach(err => {
          console.error(`${err.field}: ${err.message}`);
        });
      }
    }

    // Não autenticado (401)
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }

    // Rate limit (429)
    if (error.response?.status === 429) {
      alert('Você fez muitas requisições. Aguarde um momento.');
    }

    // Erro genérico
    throw error;
  }
}
```

---

## ✅ Boas Práticas

### 1. **Armazene o token de forma segura**
```javascript
// ✅ BOM - localStorage (adequado para SPAs)
localStorage.setItem('auth_token', token);

// ⚠️ EVITE - cookies sem HttpOnly (vulnerável a XSS)
document.cookie = `token=${token}`;
```

### 2. **Sempre use interceptors para adicionar o token**
```javascript
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. **Trate expiração de token automaticamente**
```javascript
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirou, redireciona para login
      authService.logout();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);
```

### 4. **Valide dados no frontend antes de enviar**
```javascript
function validatePassword(password) {
  // Mínimo 8 caracteres, letra maiúscula, minúscula e número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}
```

### 5. **Use loading states**
```javascript
const [loading, setLoading] = useState(false);

async function loadData() {
  setLoading(true);
  try {
    const data = await api.getData();
    setData(data);
  } finally {
    setLoading(false); // Sempre limpa loading
  }
}
```

### 6. **Implemente retry em operações críticas**
```javascript
async function retryOperation(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 7. **Use variáveis de ambiente**
```javascript
// .env.development
VITE_API_URL=http://localhost:3000/api

// .env.production
VITE_API_URL=https://api.producao.com/api

// Uso
const API_URL = import.meta.env.VITE_API_URL;
```

---

## 🎯 Checklist de Integração

Antes de ir para produção, verifique:

- [ ] Token JWT sendo enviado em todas as requisições protegidas
- [ ] Interceptor de resposta tratando 401 (logout automático)
- [ ] Loading states em todas as operações assíncronas
- [ ] Tratamento de erros amigável ao usuário
- [ ] Validação de formulários antes de enviar
- [ ] Variáveis de ambiente configuradas para dev/prod
- [ ] Headers `X-Requested-With` sendo enviados
- [ ] Upload de CSV validando tamanho (máx 5MB)
- [ ] Operações em massa limitadas a 100 itens
- [ ] Paginação implementada em listas grandes
- [ ] Timeout configurado nas requisições (10s recomendado)
- [ ] Retry implementado em operações críticas

---

## 📚 Recursos Adicionais

- **Documentação Interativa:** http://localhost:3000/api-docs
- **Healthcheck:** http://localhost:3000/health
- **Repositório:** [Link do GitHub]
- **Suporte:** [Email ou Slack]

---

## 🆘 Problemas Comuns

### Erro: "CORS policy"
**Solução:** Verifique se sua origem está na lista de permitidas no backend (`.env` → `FRONTEND_URL`)

### Erro: "Token inválido ou expirado"
**Solução:** Faça logout e login novamente. Token expira em 2h (configurável).

### Erro: "Muitas tentativas"
**Solução:** Aguarde 15 minutos. Rate limit: 5 tentativas de login / 15 min.

### Upload de CSV falha
**Solução:** Verifique:
- Arquivo é .csv
- Tamanho < 5MB
- Formato: `numero_processo,prazo_processual,classe_principal,assunto_principal,tarjas,data_intimacao`

---

**✨ Pronto! Sua integração está completa. Boa sorte com o desenvolvimento!**
