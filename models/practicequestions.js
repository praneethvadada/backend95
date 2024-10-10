'use strict';
module.exports = (sequelize, DataTypes) => {
  const PracticeQuestion = sequelize.define('PracticeQuestion', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
    is_practice: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {});
  
  return PracticeQuestion;
};
