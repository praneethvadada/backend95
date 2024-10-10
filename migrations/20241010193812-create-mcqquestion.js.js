'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MCQQuestions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      options: {
        type: Sequelize.JSON,
        allowNull: false
      },
      correct_answers: {
        type: Sequelize.JSON,
        allowNull: false
      },
      is_single_answer: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      mcqdomain_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'MCQDomains',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      code_snippets: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      question_type: {
        type: Sequelize.ENUM('practice', 'assessment'),
        allowNull: false
      },
      approval_status: {
        type: Sequelize.ENUM('Pending', 'Approved', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending'  // Default approval status set to 'Pending'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Trainers',  // References the trainer who created the question
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MCQQuestions');
  }
};


// 'use strict';
// module.exports = {
//   up: (queryInterface, Sequelize) => {
//     return queryInterface.createTable('MCQQuestions', {
//       id: {
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         type: Sequelize.INTEGER
//       },
//       title: {
//         type: Sequelize.STRING,
//         allowNull: false
//       },
//       options: {
//         type: Sequelize.JSON,
//         allowNull: false
//       },
//       correct_answers: {
//         type: Sequelize.JSON,
//         allowNull: false
//       },
//       is_single_answer: {
//         type: Sequelize.BOOLEAN,
//         allowNull: true,
//         defaultValue: true
//       },
//       mcqdomain_id: {
//         type: Sequelize.INTEGER,
//         allowNull: true,
//         references: {
//           model: 'MCQDomains',
//           key: 'id'
//         },
//         onUpdate: 'CASCADE',
//         onDelete: 'CASCADE'
//       },
//       code_snippets: {
//         type: Sequelize.TEXT,
//         allowNull: true  // Code snippets now of TEXT type
//       },
//       question_type: {
//         type: Sequelize.ENUM('practice', 'assessment'),
//         allowNull: false
//       },
//       createdAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
//       },
//       updatedAt: {
//         allowNull: false,
//         type: Sequelize.DATE,
//         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
//       }
//     });
//   },
//   down: (queryInterface, Sequelize) => {
//     return queryInterface.dropTable('MCQQuestions');
//   }
// };
