// 'use strict';

// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.addConstraint('student_submissions', {
//       fields: ['question_id'], // Column in student_submissions
//       type: 'foreign key',
//       name: 'fk_student_submissions_question_id', // Name for the foreign key
//       references: {
//         table: 'codingquestions', // Referenced table
//         field: 'id', // Referenced column
//       },
//       onUpdate: 'CASCADE',
//       onDelete: 'CASCADE',
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.removeConstraint(
//       'student_submissions',
//       'fk_student_submissions_question_id' // Name of the constraint to remove
//     );
//   },
// };
