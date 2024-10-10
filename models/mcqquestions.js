'use strict';
module.exports = (sequelize, DataTypes) => {
  const MCQQuestion = sequelize.define('MCQQuestion', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false
    },
    correct_answers: {
      type: DataTypes.JSON,
      allowNull: false
    },
    is_single_answer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    mcqdomain_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'MCQDomains',
        key: 'id'
      }
    },
    code_snippets: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    question_type: {
      type: DataTypes.ENUM('practice', 'assessment'),
      allowNull: false
    },
    approval_status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),  // Added approval_status
      allowNull: false,
      defaultValue: 'Pending'  // Default value is 'Pending'
    },
    created_by: {
      type: DataTypes.INTEGER,  // Added created_by
      allowNull: false,
      references: {
        model: 'Trainers',  // This references the trainer who created the question
        key: 'id'
      }
    }
  }, {});

  return MCQQuestion;
};