'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CodingQuestions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      input_format: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      output_format: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      test_cases: {
        type: Sequelize.JSON,
        allowNull: false
      },
      constraints: {
        type: Sequelize.TEXT,
        allowNull: true  // Constraints can be null
      },
      difficulty: {
        type: Sequelize.ENUM('Level1', 'Level2', 'Level3', 'Level4', 'Level5'),
        allowNull: true
      },
      solution: {
        type: Sequelize.JSON,
        allowNull: true
      },
      approval_status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: true,
        defaultValue: 'pending'  // Default approval status to 'pending'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Trainers',  // Trainer who created the question
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      allowed_languages: {
        type: Sequelize.JSON,
        allowNull: false  // Required field for allowed programming languages
      },
      codingquestiondomain_id: {
        type: Sequelize.INTEGER,
        allowNull: true,  // Nullable coding question domain reference
        references: {
          model: 'CodingQuestionDomains',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      question_type: {
        type: Sequelize.ENUM('practice', 'assessment'),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CodingQuestions');
  }
};
