'use strict';
module.exports = (sequelize, DataTypes) => {
  const MCQDomain = sequelize.define('MCQDomain', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'MCQDomains',
        key: 'id'
      }
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Admins',
        key: 'id'
      }
    }
  }, {});
  
  return MCQDomain;
};
