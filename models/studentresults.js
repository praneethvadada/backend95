module.exports = (sequelize, DataTypes) => {
  const StudentResults = sequelize.define(
    "StudentResults",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      round_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question_type: {
        type: DataTypes.ENUM("coding", "mcq"),
        allowNull: false,
      },
      score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      question_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      solution_code: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      language: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      submitted_options: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "StudentResults",
      timestamps: false, // Disable automatic timestamps as we're manually managing them
    }
  );

  // Add hooks for timestamp management if needed
  StudentResults.beforeCreate((result) => {
    result.createdAt = new Date();
    result.updatedAt = new Date();
  });

  StudentResults.beforeUpdate((result) => {
    result.updatedAt = new Date();
  });

  return StudentResults;
};

// module.exports = (sequelize, DataTypes) => {
//   const StudentResults = sequelize.define('StudentResults', {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     round_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     question_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     student_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     question_type: {
//       type: DataTypes.ENUM('coding', 'mcq'),
//       allowNull: false,
//     },
//     score: {
//       type: DataTypes.FLOAT,
//       allowNull: true,
//     },
//     question_points: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     solution_code: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     language: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     submitted_options: {
//       type: DataTypes.JSON,
//       allowNull: true,
//     },
//     createdAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
//     },
//     updatedAt: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
//     },
//   }, {
//     tableName: 'StudentResults',
//     timestamps: true,
//   });

//   return StudentResults;
// };

// // 'use strict';

// // module.exports = (sequelize, DataTypes) => {
// //   const StudentResults = sequelize.define('StudentResults', {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       autoIncrement: true,
// //       primaryKey: true,
// //     },
// //     assessment_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     round_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     // question_id: {
// //     //   type: DataTypes.INTEGER,
// //     //   allowNull: false,
// //     // },
// //     student_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     question_type: {
// //       type: DataTypes.ENUM('coding', 'mcq'),
// //       allowNull: false,
// //     },
// //     score: {
// //       type: DataTypes.FLOAT,
// //       allowNull: true,
// //     },
// //     question_points: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     solution_code: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //     language: {
// //       type: DataTypes.STRING,
// //       allowNull: true,
// //     },
// //     submitted_options: {
// //       type: DataTypes.JSON,
// //       allowNull: true,
// //     },
// //     createdAt: {
// //       type: DataTypes.DATE,
// //       allowNull: false,
// //       defaultValue: DataTypes.NOW,
// //     },
// //     updatedAt: {
// //       type: DataTypes.DATE,
// //       allowNull: false,
// //       defaultValue: DataTypes.NOW,
// //     },
// //   }, {
// //     tableName: 'StudentResults',
// //     timestamps: true,
// //   });

// //   return StudentResults;
// // };
