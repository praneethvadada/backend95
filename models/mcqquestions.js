'use strict';
module.exports = (sequelize, DataTypes) => {
  const MCQQuestion = sequelize.define('MCQQuestion', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false
    },
    correct_answers: {
      type: DataTypes.JSON,
      allowNull: false
    },
    is_single_answer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    mcqdomain_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'MCQDomains',
        key: 'id'
      }
    },
    code_snippets: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    question_type: {
      type: DataTypes.ENUM('practice', 'assessment'),
      allowNull: false
    },
    approval_status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      allowNull: false,
      defaultValue: 'Pending'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Trainers',
        key: 'id'
      }
    },
    difficulty: {  // Add the new difficulty field
      type: DataTypes.ENUM('Level1', 'Level2', 'Level3', 'Level4', 'Level5'),
      allowNull: false
    },
    round_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'AssessmentRounds',
        key: 'id'
      }
    }
  }, {});

  MCQQuestion.associate = (models) => {
    MCQQuestion.belongsTo(models.MCQDomain, { foreignKey: 'mcqdomain_id' });  // Association with MCQDomains
    MCQQuestion.belongsTo(models.AssessmentRound, { foreignKey: 'round_id' });  // Association with AssessmentRounds
    MCQQuestion.belongsTo(models.Trainer, { foreignKey: 'created_by' });  // Association with Trainers
  };

  return MCQQuestion;
};

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const MCQQuestion = sequelize.define('MCQQuestion', {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     options: {
//       type: DataTypes.JSON,
//       allowNull: false
//     },
//     correct_answers: {
//       type: DataTypes.JSON,
//       allowNull: false
//     },
//     is_single_answer: {
//       type: DataTypes.BOOLEAN,
//       allowNull: true,
//       defaultValue: true
//     },
//     mcqdomain_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'MCQDomains',
//         key: 'id'
//       }
//     },
//     code_snippets: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     question_type: {
//       type: DataTypes.ENUM('practice', 'assessment'),
//       allowNull: false
//     },
//     approval_status: {
//       type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),  // Added approval_status
//       allowNull: false,
//       defaultValue: 'Pending'  // Default value is 'Pending'
//     },
//     created_by: {
//       type: DataTypes.INTEGER,  // Added created_by
//       allowNull: false,
//       references: {
//         model: 'Trainers',  // This references the trainer who created the question
//         key: 'id'
//       }
//     },
//     round_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: 'AssessmentRounds',
//         key: 'id'
//       }
//     }

//   }, {});
//   MCQQuestion.associate = (models) => {
//     MCQQuestion.hasMany(models.BatchPracticeQuestion, { foreignKey: 'mcq_question_id' }),
//     MCQQuestion.belongsTo(models.AssessmentRound, { foreignKey: 'round_id' });  // Association with AssessmentRounds
  
//   };
//   return MCQQuestion;
// };