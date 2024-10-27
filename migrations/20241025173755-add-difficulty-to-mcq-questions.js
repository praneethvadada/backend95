'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('MCQQuestions', 'difficulty', {
      type: Sequelize.ENUM('Level1', 'Level2', 'Level3', 'Level4', 'Level5'),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('MCQQuestions', 'difficulty');
  }
};
