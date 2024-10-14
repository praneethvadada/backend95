'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the is_coding and is_mcq columns from assessmentquestions table
    await queryInterface.removeColumn('assessmentquestions', 'is_coding');
    await queryInterface.removeColumn('assessmentquestions', 'is_mcq');
  },

  down: async (queryInterface, Sequelize) => {
    // Add the is_coding and is_mcq columns back in case of a rollback
    await queryInterface.addColumn('assessmentquestions', 'is_coding', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.addColumn('assessmentquestions', 'is_mcq', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    });
  }
};
