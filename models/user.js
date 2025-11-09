// /models/user.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    matricula: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true, // ✅ REATIVADO após correção de índices duplicados
      validate: {
        notEmpty: true,
        len: [1, 20]
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
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [8, 100]
      }
    },
    // Campo para identificar se é a senha padrão
    senha_padrao: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    admin_padrao: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    admin_super: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'usuarios',
    timestamps: false,  // ✅ HABILITADO para auditoria
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return User;
};
