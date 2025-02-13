'use strict';
module.exports = (sequelize, DataTypes) => {
  const CodingQuestion = sequelize.define('CodingQuestion', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    input_format: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    output_format: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    test_cases: {
      type: DataTypes.JSON,
      allowNull: false
    },
    constraints: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    difficulty: {
      type: DataTypes.ENUM('Level1', 'Level2', 'Level3', 'Level4', 'Level5'),
      allowNull: true
    },
    
    solutions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    approval_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: true,
      defaultValue: 'pending'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    allowed_languages: {
      type: DataTypes.JSON,
      allowNull: false
    },
    codingquestiondomain_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'CodingQuestionDomains',
        key: 'id'
      }
    },
    question_type: {
      type: DataTypes.ENUM('practice', 'assessment'),
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

  CodingQuestion.associate = (models) => {
    CodingQuestion.belongsToMany(models.AllowedLanguage, {
      through: 'CodingQuestionLanguages',
      foreignKey: 'coding_question_id',
      otherKey: 'language_id'
    });
    CodingQuestion.belongsTo(models.AssessmentRound, { foreignKey: 'round_id' });
    CodingQuestion.belongsTo(models.CodingQuestionDomain, { foreignKey: 'codingquestiondomain_id' });
  };

  return CodingQuestion;
};

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const CodingQuestion = sequelize.define('CodingQuestion', {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     title: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     input_format: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     output_format: {
//       type: DataTypes.TEXT,
//       allowNull: false
//     },
//     test_cases: {
//       type: DataTypes.JSON,
//       allowNull: false
//     },
//     constraints: {
//       type: DataTypes.TEXT,
//       allowNull: true
//     },
//     difficulty: {
//       type: DataTypes.ENUM('Level1', 'Level2', 'Level3', 'Level4', 'Level5'),
//       allowNull: true
//     },
//     solutions: {
//       type: DataTypes.JSON,
//       allowNull: true
//     },
//     approval_status: {
//       type: DataTypes.ENUM('pending', 'approved', 'rejected'),
//       allowNull: true,
//       defaultValue: 'pending'
//     },
//     created_by: {
//       type: DataTypes.INTEGER,
//       allowNull: true
//     },
//     allowed_languages: {
//       type: DataTypes.JSON,
//       allowNull: false
//     },
//     codingquestiondomain_id: {
//       allowNull: true, // Now nullable
//       type: DataTypes.INTEGER,
//       references: {
//         model: 'CodingQuestionDomains',
//         key: 'id'
//       }
//     },
//     question_type: {
//       type: DataTypes.ENUM('practice', 'assessment'),
//       allowNull: false
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

//   // CodingQuestion.associate = (models) => {
//   //   CodingQuestion.belongsToMany(models.AllowedLanguage, {
//   //     through: 'CodingQuestionLanguages',
//   //     foreignKey: 'coding_question_id',
//   //     otherKey: 'language_id'
//   //   },
//   //   CodingQuestion.hasMany(models.BatchPracticeQuestion, { foreignKey: 'coding_question_id' }),
//   //   CodingQuestion.belongsTo(models.AssessmentRound, { foreignKey: 'round_id' });  // Association with AssessmentRounds

//   // };
//   CodingQuestion.associate = (models) => {
//     CodingQuestion.belongsToMany(models.AllowedLanguage, {
//       through: 'CodingQuestionLanguages',
//       foreignKey: 'coding_question_id',
//       otherKey: 'language_id'
//     });
//     CodingQuestion.hasMany(models.BatchPracticeQuestion, { foreignKey: 'coding_question_id' });
//     CodingQuestion.belongsTo(models.AssessmentRound, { foreignKey: 'round_id' });  // Association with AssessmentRounds
//   };
  
//   return CodingQuestion;
// };


