'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the constraints using the exact names from the database
    await queryInterface.removeConstraint('student_mcq_answers', 'student_mcq_answers_ibfk_1');
    await queryInterface.removeConstraint('student_mcq_answers', 'student_mcq_answers_ibfk_2');
    await queryInterface.removeConstraint('student_mcq_answers', 'student_mcq_answers_ibfk_3');
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add the constraints with the correct names
    await queryInterface.addConstraint('student_mcq_answers', {
      fields: ['student_id'],
      type: 'foreign key',
      name: 'student_mcq_answers_ibfk_1',
      references: {
        table: 'students',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('student_mcq_answers', {
      fields: ['domain_id'],
      type: 'foreign key',
      name: 'student_mcq_answers_ibfk_2',
      references: {
        table: 'mcqdomains',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addConstraint('student_mcq_answers', {
      fields: ['question_id'],
      type: 'foreign key',
      name: 'student_mcq_answers_ibfk_3',
      references: {
        table: 'mcqquestions',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
};

// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Dropping foreign key constraints (if they exist)
//     await queryInterface.sequelize.query(`
//       ALTER TABLE student_mcq_answers
//       DROP FOREIGN KEY fk_student_id,
//       DROP FOREIGN KEY fk_question_id,
//       DROP FOREIGN KEY fk_domain_id;
//     `);

//     // Adding Partitioning (Partitioned by student_id)
//     await queryInterface.sequelize.query(`
//       ALTER TABLE student_mcq_answers
//       PARTITION BY HASH(student_id)
//       PARTITIONS 32;  -- Adjust the number of partitions as necessary
//     `);

//     // Adding Indexes
//     await queryInterface.addIndex('student_mcq_answers', ['student_id', 'question_id'], {
//       name: 'idx_student_question'
//     });
//     await queryInterface.addIndex('student_mcq_answers', ['domain_id'], {
//       name: 'idx_domain'
//     });
//     await queryInterface.addIndex('student_mcq_answers', ['is_attempted'], {
//       name: 'idx_is_attempted'
//     });
//     await queryInterface.addIndex('student_mcq_answers', ['marked'], {
//       name: 'idx_marked'
//     });
//     await queryInterface.addIndex('student_mcq_answers', ['is_reported'], {
//       name: 'idx_is_reported'
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     // Removing Indexes
//     await queryInterface.removeIndex('student_mcq_answers', 'idx_student_question');
//     await queryInterface.removeIndex('student_mcq_answers', 'idx_domain');
//     await queryInterface.removeIndex('student_mcq_answers', 'idx_is_attempted');
//     await queryInterface.removeIndex('student_mcq_answers', 'idx_marked');
//     await queryInterface.removeIndex('student_mcq_answers', 'idx_is_reported');

//     // Dropping Partitioning
//     // Note: Partitioning cannot be simply dropped via ALTER in MySQL.
//   },
// };



// // 'use strict';
// // module.exports = {
// //   up: async (queryInterface, Sequelize) => {
// //     // Adding Partitioning (Partitioned by `student_id`)
// //     await queryInterface.sequelize.query(`
// //       ALTER TABLE student_mcq_answers
// //       PARTITION BY HASH(student_id)
// //       PARTITIONS 32;  -- Adjust the number of partitions as necessary
// //     `);

// //     // Adding Indexes
// //     await queryInterface.addIndex('student_mcq_answers', ['student_id', 'question_id'], {
// //       name: 'idx_student_question'
// //     });
// //     await queryInterface.addIndex('student_mcq_answers', ['domain_id'], {
// //       name: 'idx_domain'
// //     });
// //     await queryInterface.addIndex('student_mcq_answers', ['is_attempted'], {
// //       name: 'idx_is_attempted'
// //     });
// //     await queryInterface.addIndex('student_mcq_answers', ['marked'], {
// //       name: 'idx_marked'
// //     });
// //     await queryInterface.addIndex('student_mcq_answers', ['is_reported'], {
// //       name: 'idx_is_reported'
// //     });
// //   },

// //   down: async (queryInterface, Sequelize) => {
// //     // Removing Indexes
// //     await queryInterface.removeIndex('student_mcq_answers', 'idx_student_question');
// //     await queryInterface.removeIndex('student_mcq_answers', 'idx_domain');
// //     await queryInterface.removeIndex('student_mcq_answers', 'idx_is_attempted');
// //     await queryInterface.removeIndex('student_mcq_answers', 'idx_marked');
// //     await queryInterface.removeIndex('student_mcq_answers', 'idx_is_reported');

// //     // Dropping Partitioning (if necessary, MySQL does not allow DROP PARTITION directly in ALTER)
// //     // Here, we can't remove partitioning via migration directly.
// //   },
// // };
