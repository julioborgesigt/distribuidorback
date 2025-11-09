// /models/process.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Process = sequelize.define('Process', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    numero_processo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true, // ✅ REATIVADO após correção de índices duplicados
      validate: {
        notEmpty: true,
        len: [1, 50]
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
      type: DataTypes.DATEONLY
    },
    cumprido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    reiteracoes: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      defaultValue: 0 },

    cumpridoDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    observacoes: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: '',
      validate: {
        len: [0, 100]
      }
    }
    
  }, {
    tableName: 'processos',
    timestamps: true,  // ✅ HABILITADO para auditoria
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Process;
};
