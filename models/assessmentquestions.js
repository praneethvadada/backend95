'use strict';

module.exports = (sequelize, DataTypes) => {
  const AssessmentQuestion = sequelize.define(
    'AssessmentQuestion',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      round_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'AssessmentRounds',
          key: 'id',
        },
      },
      coding_question_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'CodingQuestions',
          key: 'id',
        },
      },
      mcq_question_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'MCQQuestions',
          key: 'id',
        },
      },
    },
    {
      tableName: 'assessmentquestions', // Explicit table name (optional)
      timestamps: true, // Add createdAt and updatedAt fields
    }
  );

  AssessmentQuestion.associate = (models) => {
    // Association with CodingQuestion model
    AssessmentQuestion.belongsTo(models.CodingQuestion, {
      foreignKey: 'coding_question_id',
      as: 'codingQuestion',
    });

    // Association with MCQQuestion model
    AssessmentQuestion.belongsTo(models.MCQQuestion, {
      foreignKey: 'mcq_question_id',
      as: 'mcqQuestion',
    });

    // Association with AssessmentRounds (if needed in the future)
    AssessmentQuestion.belongsTo(models.AssessmentRound, {
      foreignKey: 'round_id',
      as: 'round',
    });
  };

  return AssessmentQuestion;
};

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const AssessmentQuestion = sequelize.define('AssessmentQuestion', {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     round_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'AssessmentRounds',
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
//   }, {});
  
//   return AssessmentQuestion;
// };
