'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add round_id column to mcqquestions table
    await queryInterface.addColumn('MCQQuestions', 'round_id', {
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
    // Remove round_id column from mcqquestions table
    await queryInterface.removeColumn('MCQQuestions', 'round_id');
  }
};
