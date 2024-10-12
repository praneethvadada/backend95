
// models/batchpracticequestion.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const BatchPracticeQuestion = sequelize.define('BatchPracticeQuestion', {
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Batches',
        key: 'id'
      }
    },
    coding_question_id: {
      type: DataTypes.INTEGER,
      allowNull: true,  // Coding questions can be nullable if it's an MCQ
      references: {
        model: 'CodingQuestions',
        key: 'id'
      }
    },
    mcq_question_id: {
      type: DataTypes.INTEGER,
      allowNull: true,  // MCQ questions can be nullable if it's a coding question
      references: {
        model: 'MCQQuestions',
        key: 'id'
      }
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Admins',
        key: 'id'
      }
    }
  }, {});

  BatchPracticeQuestion.associate = (models) => {
    BatchPracticeQuestion.belongsTo(models.CodingQuestion, { foreignKey: 'coding_question_id', as: 'codingQuestion' });
    BatchPracticeQuestion.belongsTo(models.MCQQuestion, { foreignKey: 'mcq_question_id', as: 'mcqQuestion' });
  };

  return BatchPracticeQuestion;
};

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const BatchPracticeQuestion = sequelize.define('BatchPracticeQuestion', {
//     batch_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'Batches',
//         key: 'id'
//       }
//     },
//     coding_question_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'CodingQuestions',
//         key: 'id'
//       }
//     },
//     mcq_question_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'MCQQuestions',
//         key: 'id'
//       }
//     },
//     created_by: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'Admins',
//         key: 'id'
//       }
//     }
//   }, {});

//   // Associations
//   // BatchPracticeQuestion.associate = (models) => {
//   //   BatchPracticeQuestion.belongsTo(models.Batch, { foreignKey: 'batch_id' });
//   //   BatchPracticeQuestion.belongsTo(models.CodingQuestion, { foreignKey: 'coding_question_id' });
//   //   BatchPracticeQuestion.belongsTo(models.MCQQuestion, { foreignKey: 'mcq_question_id' });
//   // };
//   BatchPracticeQuestion.associate = (models) => {
//     BatchPracticeQuestion.belongsTo(models.CodingQuestion, { foreignKey: 'coding_question_id', as: 'coding_question' });
//     BatchPracticeQuestion.belongsTo(models.MCQQuestion, { foreignKey: 'mcq_question_id', as: 'mcq_question' });
//   };

//   return BatchPracticeQuestion;
// };

// // 'use strict';
// // module.exports = (sequelize, DataTypes) => {
// //   const BatchPracticeQuestion = sequelize.define('BatchPracticeQuestion', {
// //     batch_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: 'Batches',
// //         key: 'id'
// //       }
// //     },
// //     coding_question_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       references: {
// //         model: 'CodingQuestions',
// //         key: 'id'
// //       }
// //     },
// //     mcq_question_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       references: {
// //         model: 'MCQQuestions',
// //         key: 'id'
// //       }
// //     },
// //     created_by: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: 'Admins',
// //         key: 'id'
// //       }
// //     }
// //   }, {});

// //   return BatchPracticeQuestion;
// // };

// // // // models/batchPracticeQuestions.js
// // // 'use strict';
// // // module.exports = (sequelize, DataTypes) => {
// // //   const BatchPracticeQuestions = sequelize.define('BatchPracticeQuestions', {
// // //     id: {
// // //       type: DataTypes.INTEGER,
// // //       autoIncrement: true,
// // //       primaryKey: true
// // //     },
// // //     batch_id: {
// // //       type: DataTypes.INTEGER,
// // //       allowNull: false,
// // //       references: {
// // //         model: 'Batches',
// // //         key: 'id'
// // //       },
// // //       onDelete: 'CASCADE',
// // //       onUpdate: 'CASCADE'
// // //     },
// // //     coding_question_id: {
// // //       type: DataTypes.INTEGER,
// // //       allowNull: true,
// // //       references: {
// // //         model: 'CodingQuestions',
// // //         key: 'id'
// // //       },
// // //       onDelete: 'SET NULL',
// // //       onUpdate: 'CASCADE'
// // //     },
// // //     mcq_question_id: {
// // //       type: DataTypes.INTEGER,
// // //       allowNull: true,
// // //       references: {
// // //         model: 'MCQQuestions',
// // //         key: 'id'
// // //       },
// // //       onDelete: 'SET NULL',
// // //       onUpdate: 'CASCADE'
// // //     },
// // //     created_by: {
// // //       type: DataTypes.INTEGER,
// // //       allowNull: true,
// // //       references: {
// // //         model: 'Admins',
// // //         key: 'id'
// // //       },
// // //       onDelete: 'SET NULL',
// // //       onUpdate: 'CASCADE'
// // //     }
// // //   }, {});

// // //   // Define relationships (if needed)
// // //   BatchPracticeQuestions.associate = function(models) {
// // //     BatchPracticeQuestions.belongsTo(models.Batch, { foreignKey: 'batch_id' });
// // //     BatchPracticeQuestions.belongsTo(models.CodingQuestion, { foreignKey: 'coding_question_id' });
// // //     BatchPracticeQuestions.belongsTo(models.MCQQuestion, { foreignKey: 'mcq_question_id' });
// // //     BatchPracticeQuestions.belongsTo(models.Admin, { foreignKey: 'created_by' });
// // //   };

// // //   return BatchPracticeQuestions;
// // // };
