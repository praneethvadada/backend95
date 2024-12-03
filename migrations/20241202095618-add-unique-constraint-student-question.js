'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the unique constraint already exists
    const [results] = await queryInterface.sequelize.query(`
      SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE TABLE_NAME = 'student_submissions' AND CONSTRAINT_NAME = 'unique_student_question'
    `);

    if (results.length === 0) {
      // Add unique constraint if it does not exist
      await queryInterface.addConstraint('student_submissions', {
        fields: ['student_id', 'question_id'],
        type: 'unique',
        name: 'unique_student_question'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the unique constraint
    await queryInterface.removeConstraint('student_submissions', 'unique_student_question');
  }
};
