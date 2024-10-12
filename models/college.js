// models/college.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const College = sequelize.define('College', {
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
    logo: {
      type: DataTypes.BLOB,
      allowNull: true
    }
  }, {});
  
  College.associate = (models) => {
    College.hasMany(models.Batch, { foreignKey: 'college_id' });
    College.hasMany(models.Student, { foreignKey: 'college_id' });
  };
  
  return College;
};
