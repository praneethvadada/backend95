'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('student_assessment_marks', {
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
      assessment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Assessments',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      round_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'AssessmentRounds',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      marks_obtained: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      total_marks: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 100,
      },
      passed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('student_assessment_marks');
  }
};
