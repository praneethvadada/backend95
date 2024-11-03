'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding Partitioning (Partitioned by `student_id`)
    await queryInterface.sequelize.query(`
      ALTER TABLE student_mcq_answers
      PARTITION BY HASH(student_id)
      PARTITIONS 32;  -- Adjust the number of partitions as necessary
    `);

    // Adding Indexes
    await queryInterface.addIndex('student_mcq_answers', ['student_id', 'question_id'], {
      name: 'idx_student_question'
    });
    await queryInterface.addIndex('student_mcq_answers', ['domain_id'], {
      name: 'idx_domain'
    });
    await queryInterface.addIndex('student_mcq_answers', ['is_attempted'], {
      name: 'idx_is_attempted'
    });
    await queryInterface.addIndex('student_mcq_answers', ['marked'], {
      name: 'idx_marked'
    });
    await queryInterface.addIndex('student_mcq_answers', ['is_reported'], {
      name: 'idx_is_reported'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Removing Indexes
    await queryInterface.removeIndex('student_mcq_answers', 'idx_student_question');
    await queryInterface.removeIndex('student_mcq_answers', 'idx_domain');
    await queryInterface.removeIndex('student_mcq_answers', 'idx_is_attempted');
    await queryInterface.removeIndex('student_mcq_answers', 'idx_marked');
    await queryInterface.removeIndex('student_mcq_answers', 'idx_is_reported');

    // Dropping Partitioning (if necessary, MySQL does not allow DROP PARTITION directly in ALTER)
    // Here, we can't remove partitioning via migration directly.
  },
};
