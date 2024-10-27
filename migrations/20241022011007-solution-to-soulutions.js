'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename the 'solution' column to 'solutions'
    await queryInterface.renameColumn('codingquestions', 'solution', 'solutions');
  },

  down: async (queryInterface, Sequelize) => {
    // Reverse the migration by renaming 'solutions' back to 'solution'
    await queryInterface.renameColumn('codingquestions', 'solutions', 'solution');
  }
};
