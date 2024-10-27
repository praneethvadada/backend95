'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the batchpracticequestions table
    await queryInterface.dropTable('batchpracticequestions');
  },

  down: async (queryInterface, Sequelize) => {
    // Recreate the batchpracticequestions table in case of rollback
    await queryInterface.createTable('batchpracticequestions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      batch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Batches',
          key: 'id',
        },
      },
      coding_question_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'CodingQuestions',
          key: 'id',
        },
      },
      mcq_question_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'MCQQuestions',
          key: 'id',
        },
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
};
