'use strict';
module.exports = (sequelize, DataTypes) => {
  const StudentMcqAnswer = sequelize.define('StudentMcqAnswer', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    domain_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    submitted_options: DataTypes.JSON,
    is_attempted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    points: DataTypes.INTEGER,
    marked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_reported: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reported_text: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'StudentMcqAnswer',
    tableName: 'student_mcq_answers',
    timestamps: true,
  });

  return StudentMcqAnswer;
};

// const StudentMcqAnswer = sequelize.define(
//   'StudentMcqAnswer',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0,
//     },
//     student_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//     },
//     domain_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//     },
//     question_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//     },
//     submitted_options: DataTypes.JSON,
//     is_attempted: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     points: DataTypes.INTEGER,
//     marked: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     is_reported: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     reported_text: DataTypes.TEXT,
//   },
//   {
//     sequelize,
//     modelName: 'StudentMcqAnswer',
//     tableName: 'student_mcq_answers',
//     timestamps: true,
//     indexes: [
//       { fields: ['student_id', 'domain_id', 'question_id'] }
//     ]
//   }
// );

// // // models/student_mcq_answers.js
// // 'use strict';
// // module.exports = (sequelize, DataTypes) => {
// //   const StudentMcqAnswer = sequelize.define('StudentMcqAnswer', {
// //     student_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     domain_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     question_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     submitted_options: {
// //       type: DataTypes.JSON,
// //       allowNull: true,
// //     },
// //     is_attempted: {
// //       type: DataTypes.BOOLEAN,
// //       allowNull: false,
// //       defaultValue: false,
// //     },
// //     points: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //     },
// //     marked: {
// //       type: DataTypes.BOOLEAN,
// //       allowNull: false,
// //       defaultValue: false,
// //     },
// //     is_reported: {
// //       type: DataTypes.BOOLEAN,
// //       allowNull: false,
// //       defaultValue: false,
// //     },
// //     reported_text: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //   }, {
// //     tableName: 'student_mcq_answers'
// //   });

// //   StudentMcqAnswer.associate = (models) => {
// //     StudentMcqAnswer.belongsTo(models.Student, {
// //       foreignKey: 'student_id',
// //       as: 'student',
// //     });
// //     StudentMcqAnswer.belongsTo(models.MCQDomain, {
// //       foreignKey: 'domain_id',
// //       as: 'domain',
// //     });
// //     StudentMcqAnswer.belongsTo(models.MCQQuestion, {
// //       foreignKey: 'question_id',
// //       as: 'question',
// //     });
// //   };

// //   return StudentMcqAnswer;
// // };

// // // 'use strict';
// // // const { Model } = require('sequelize');
// // // const Student = require('./student');        // Add explicit imports
// // // const McqDomain = require('./mcqdomain');
// // // const MCQQuestion = require('./mcqquestions');

// // // module.exports = (sequelize, DataTypes) => {
// // //   class StudentMcqAnswer extends Model {
// // //     static associate(models) {
// // //       // Ensure models are available before setting up associations
// // //       StudentMcqAnswer.belongsTo(models.Student, {
// // //         foreignKey: 'student_id',
// // //         as: 'student',
// // //       });
// // //       StudentMcqAnswer.belongsTo(models.McqDomain, {
// // //         foreignKey: 'domain_id',
// // //         as: 'domain',
// // //       });
// // //       StudentMcqAnswer.belongsTo(models.McqQuestion, {
// // //         foreignKey: 'question_id',
// // //         as: 'question',
// // //       });
// // //     }
// // //   }

// // //   StudentMcqAnswer.init(
// // //     {
// // //       student_id: {
// // //         type: DataTypes.INTEGER,
// // //         allowNull: false,
// // //       },
// // //       domain_id: {
// // //         type: DataTypes.INTEGER,
// // //         allowNull: false,
// // //       },
// // //       question_id: {
// // //         type: DataTypes.INTEGER,
// // //         allowNull: false,
// // //       },
// // //       submitted_options: {
// // //         type: DataTypes.JSON,
// // //         allowNull: true,
// // //       },
// // //       is_attempted: {
// // //         type: DataTypes.BOOLEAN,
// // //         allowNull: false,
// // //         defaultValue: false,
// // //       },
// // //       points: {
// // //         type: DataTypes.INTEGER,
// // //         allowNull: true,
// // //       },
// // //       marked: {
// // //         type: DataTypes.BOOLEAN,
// // //         allowNull: false,
// // //         defaultValue: false,
// // //       },
// // //       is_reported: {
// // //         type: DataTypes.BOOLEAN,
// // //         allowNull: false,
// // //         defaultValue: false,
// // //       },
// // //       reported_text: {
// // //         type: DataTypes.TEXT,
// // //         allowNull: true,
// // //       },
// // //     },
// // //     {
// // //       sequelize,
// // //       modelName: 'StudentMcqAnswer',
// // //       tableName: 'student_mcq_answers',
// // //     }
// // //   );

// // //   return StudentMcqAnswer;
// // // };

// // // // 'use strict';
// // // // const { Model } = require('sequelize');

// // // // module.exports = (sequelize, DataTypes) => {
// // // //   class StudentMcqAnswer extends Model {
// // // //     static associate(models) {
// // // //       StudentMcqAnswer.belongsTo(models.Student, {
// // // //         foreignKey: 'student_id',
// // // //         as: 'student',
// // // //       });
// // // //       StudentMcqAnswer.belongsTo(models.McqDomain, {
// // // //         foreignKey: 'domain_id',
// // // //         as: 'domain',
// // // //       });
// // // //       StudentMcqAnswer.belongsTo(models.McqQuestion, {
// // // //         foreignKey: 'question_id',
// // // //         as: 'question',
// // // //       });
// // // //     }
// // // //   }

// // // //   StudentMcqAnswer.init(
// // // //     {
// // // //       student_id: {
// // // //         type: DataTypes.INTEGER,
// // // //         allowNull: false,
// // // //       },
// // // //       domain_id: {
// // // //         type: DataTypes.INTEGER,
// // // //         allowNull: false,
// // // //       },
// // // //       question_id: {
// // // //         type: DataTypes.INTEGER,
// // // //         allowNull: false,
// // // //       },
// // // //       submitted_options: {
// // // //         type: DataTypes.JSON,
// // // //         allowNull: true,
// // // //       },
// // // //       is_attempted: {
// // // //         type: DataTypes.BOOLEAN,
// // // //         allowNull: false,
// // // //         defaultValue: false,
// // // //       },
// // // //       points: {
// // // //         type: DataTypes.INTEGER,
// // // //         allowNull: true,
// // // //       },
// // // //       marked: {
// // // //         type: DataTypes.BOOLEAN,
// // // //         allowNull: false,
// // // //         defaultValue: false,
// // // //       },
// // // //       is_reported: {
// // // //         type: DataTypes.BOOLEAN,
// // // //         allowNull: false,
// // // //         defaultValue: false,
// // // //       },
// // // //       reported_text: {
// // // //         type: DataTypes.TEXT,
// // // //         allowNull: true,
// // // //       },
// // // //     },
// // // //     {
// // // //       sequelize,
// // // //       modelName: 'StudentMcqAnswer',
// // // //       tableName: 'student_mcq_answers',
// // // //     }
// // // //   );

// // // //   return StudentMcqAnswer;
// // // // };

// // // // // 'use strict';
// // // // // const { Model } = require('sequelize');

// // // // // module.exports = (sequelize, DataTypes) => {
// // // // //   class StudentMcqAnswer extends Model {
// // // // //     static associate(models) {
// // // // //       // Ensure the models exist and are correctly referenced
// // // // //       StudentMcqAnswer.belongsTo(models.Student, {
// // // // //         foreignKey: 'student_id',
// // // // //         as: 'student',
// // // // //       });
// // // // //       StudentMcqAnswer.belongsTo(models.McqDomain, {
// // // // //         foreignKey: 'domain_id',
// // // // //         as: 'domain',
// // // // //       });
// // // // //       StudentMcqAnswer.belongsTo(models.McqQuestion, {
// // // // //         foreignKey: 'question_id',
// // // // //         as: 'question',
// // // // //       });
// // // // //     }
// // // // //   }

// // // // //   StudentMcqAnswer.init(
// // // // //     {
// // // // //       student_id: {
// // // // //         type: DataTypes.INTEGER,
// // // // //         allowNull: false,
// // // // //       },
// // // // //       domain_id: {
// // // // //         type: DataTypes.INTEGER,
// // // // //         allowNull: false,
// // // // //       },
// // // // //       question_id: {
// // // // //         type: DataTypes.INTEGER,
// // // // //         allowNull: false,
// // // // //       },
// // // // //       submitted_options: {
// // // // //         type: DataTypes.JSON,
// // // // //         allowNull: true,
// // // // //       },
// // // // //       is_attempted: {
// // // // //         type: DataTypes.BOOLEAN,
// // // // //         allowNull: false,
// // // // //         defaultValue: false,
// // // // //       },
// // // // //       points: {
// // // // //         type: DataTypes.INTEGER,
// // // // //         allowNull: true,
// // // // //       },
// // // // //       marked: {
// // // // //         type: DataTypes.BOOLEAN,
// // // // //         allowNull: false,
// // // // //         defaultValue: false,
// // // // //       },
// // // // //       is_reported: {
// // // // //         type: DataTypes.BOOLEAN,
// // // // //         allowNull: false,
// // // // //         defaultValue: false,
// // // // //       },
// // // // //       reported_text: {
// // // // //         type: DataTypes.TEXT,
// // // // //         allowNull: true,
// // // // //       },
// // // // //     },
// // // // //     {
// // // // //       sequelize,
// // // // //       modelName: 'StudentMcqAnswer',
// // // // //       tableName: 'student_mcq_answers',
// // // // //     }
// // // // //   );

// // // // //   return StudentMcqAnswer;
// // // // // };

// // // // // // 'use strict';
// // // // // // const { Model } = require('sequelize');
// // // // // // module.exports = (sequelize, DataTypes) => {
// // // // // //   class StudentMcqAnswer extends Model {
// // // // // //     static associate(models) {
// // // // // //       // Associations
// // // // // //       StudentMcqAnswer.belongsTo(models.Student, {
// // // // // //         foreignKey: 'student_id',
// // // // // //         as: 'student',
// // // // // //       });
// // // // // //       StudentMcqAnswer.belongsTo(models.McqDomain, {
// // // // // //         foreignKey: 'domain_id',
// // // // // //         as: 'domain',
// // // // // //       });
// // // // // //       StudentMcqAnswer.belongsTo(models.McqQuestion, {
// // // // // //         foreignKey: 'question_id',
// // // // // //         as: 'question',
// // // // // //       });
// // // // // //     }
// // // // // //   }

// // // // // //   StudentMcqAnswer.init(
// // // // // //     {
// // // // // //       student_id: {
// // // // // //         type: DataTypes.INTEGER,
// // // // // //         allowNull: false,
// // // // // //       },
// // // // // //       domain_id: {
// // // // // //         type: DataTypes.INTEGER,
// // // // // //         allowNull: false,
// // // // // //       },
// // // // // //       question_id: {
// // // // // //         type: DataTypes.INTEGER,
// // // // // //         allowNull: false,
// // // // // //       },
// // // // // //       submitted_options: {
// // // // // //         type: DataTypes.JSON,
// // // // // //         allowNull: true,
// // // // // //       },
// // // // // //       is_attempted: {
// // // // // //         type: DataTypes.BOOLEAN,
// // // // // //         allowNull: false,
// // // // // //         defaultValue: false,
// // // // // //       },
// // // // // //       points: {
// // // // // //         type: DataTypes.INTEGER,
// // // // // //         allowNull: true,
// // // // // //       },
// // // // // //       marked: {
// // // // // //         type: DataTypes.BOOLEAN,
// // // // // //         allowNull: false,
// // // // // //         defaultValue: false,
// // // // // //       },
// // // // // //       is_reported: {
// // // // // //         type: DataTypes.BOOLEAN,
// // // // // //         allowNull: false,
// // // // // //         defaultValue: false,
// // // // // //       },
// // // // // //       reported_text: {
// // // // // //         type: DataTypes.TEXT,
// // // // // //         allowNull: true,
// // // // // //       },
// // // // // //     },
// // // // // //     {
// // // // // //       sequelize,
// // // // // //       modelName: 'StudentMcqAnswer',
// // // // // //       tableName: 'student_mcq_answers',
// // // // // //     }
// // // // // //   );

// // // // // //   return StudentMcqAnswer;
// // // // // // };
