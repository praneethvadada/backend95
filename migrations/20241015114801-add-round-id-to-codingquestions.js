'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add round_id column to codingquestions table
    await queryInterface.addColumn('CodingQuestions', 'round_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'AssessmentRounds',  // References the assessment rounds table
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove round_id column from codingquestions table
    await queryInterface.removeColumn('CodingQuestions', 'round_id');
  }
};
