'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('student_practice_progress', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Students',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      coding_question_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'CodingQuestions',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      mcq_question_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'MCQQuestions',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      test_cases_passed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_test_cases: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      completion_percentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('student_practice_progress');
  }
};
