'use strict';
module.exports = (sequelize, DataTypes) => {
  const Trainer = sequelize.define('Trainer', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Admins', // References the Admin table
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {});
  
  Trainer.associate = function(models) {
    // A trainer belongs to an Admin
    Trainer.belongsTo(models.Admin, { foreignKey: 'admin_id' });
  };
  
  return Trainer;
};
