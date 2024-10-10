'use strict';
module.exports = (sequelize, DataTypes) => {
  const AssessmentRound = sequelize.define('AssessmentRound', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    assessment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Assessments',
        key: 'id'
      }
    },
    round_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    round_order: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {});
  
  return AssessmentRound;
};
