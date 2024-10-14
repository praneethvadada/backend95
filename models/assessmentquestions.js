'use strict';
module.exports = (sequelize, DataTypes) => {
  const AssessmentQuestion = sequelize.define('AssessmentQuestion', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    round_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'AssessmentRounds',
        key: 'id'
      }
    },
    coding_question_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CodingQuestions',
        key: 'id'
      }
    },
    mcq_question_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'MCQQuestions',
        key: 'id'
      }
    },
  }, {});
  
  return AssessmentQuestion;
};
