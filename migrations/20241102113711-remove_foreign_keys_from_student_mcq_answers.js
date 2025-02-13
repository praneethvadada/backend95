'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // No need to remove constraints since they're already missing
    console.log('Skipping constraint removal as they do not exist.');
  },
  down: async (queryInterface, Sequelize) => {
    // Re-adding constraints in the down migration
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
//     await queryInterface.removeConstraint('student_mcq_answers', 'student_mcq_answers_ibfk_1');
//     await queryInterface.removeConstraint('student_mcq_answers', 'student_mcq_answers_ibfk_2');
//     await queryInterface.removeConstraint('student_mcq_answers', 'student_mcq_answers_ibfk_3');
//   },
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.addConstraint('student_mcq_answers', {
//       fields: ['student_id'],
//       type: 'foreign key',
//       name: 'student_mcq_answers_ibfk_1',
//       references: {
//         table: 'students',
//         field: 'id',
//       },
//       onDelete: 'CASCADE',
//       onUpdate: 'CASCADE',
//     });
//     await queryInterface.addConstraint('student_mcq_answers', {
//       fields: ['domain_id'],
//       type: 'foreign key',
//       name: 'student_mcq_answers_ibfk_2',
//       references: {
//         table: 'mcqdomains',
//         field: 'id',
//       },
//       onDelete: 'CASCADE',
//       onUpdate: 'CASCADE',
//     });
//     await queryInterface.addConstraint('student_mcq_answers', {
//       fields: ['question_id'],
//       type: 'foreign key',
//       name: 'student_mcq_answers_ibfk_3',
//       references: {
//         table: 'mcqquestions',
//         field: 'id',
//       },
//       onDelete: 'CASCADE',
//       onUpdate: 'CASCADE',
//     });
//   },
// };
