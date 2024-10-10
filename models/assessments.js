'use strict';
module.exports = (sequelize, DataTypes) => {
  const Assessment = sequelize.define('Assessment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    start_window: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_window: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {});
  
  return Assessment;
};
