// server.js (Apenas Admin)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user'); // REMOVIDO

const app = express();


app.use(cors({
  origin: 'http://localhost:3001' // <-- 3. Coloque a URL do seu frontend
}));


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 1. ROTAS DE API ---
// Todas as suas rotas de API (agora apenas admin e auth)
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/user', userRoutes); // REMOVIDO

// --- 2. ROTA RAIZ ---
// Adiciona uma rota GET simples para a raiz do servidor
app.get('/', (req, res) => {
  res.send('Seu back está rodando');
});

// --- 3. INICIAR SERVIDOR ---
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Banco de dados sincronizado.');
    
    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`Servidor API rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar o banco de dados:', err);
  });