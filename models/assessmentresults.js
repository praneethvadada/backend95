'use strict';

module.exports = (sequelize, DataTypes) => {
  const AssessmentResults = sequelize.define('AssessmentResults', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // assessment_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'AssessmentResults',
    timestamps: true,
  });

  return AssessmentResults;
};
