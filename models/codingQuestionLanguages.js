'use strict';
module.exports = (sequelize, DataTypes) => {
  const CodingQuestionLanguages = sequelize.define('CodingQuestionLanguages', {
    coding_question_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'CodingQuestions',
        key: 'id'
      },
      allowNull: false
    },
    language_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'AllowedLanguages',
        key: 'id'
      },
      allowNull: false
    }
  }, {});

  return CodingQuestionLanguages;
};

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const CodingQuestionLanguage = sequelize.define('CodingQuestionLanguage', {
//     coding_question_id: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: 'CodingQuestions',
//         key: 'id'
//       }
//     },
//     language_id: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: 'AllowedLanguages',
//         key: 'id'
//       }
//     }
//   }, {});

//   return CodingQuestionLanguage;
// };

// // 'use strict';
// // module.exports = (sequelize, DataTypes) => {
// //   const CodingQuestionLanguage = sequelize.define('CodingQuestionLanguage', {
// //     coding_question_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: 'CodingQuestions',
// //         key: 'id'
// //       }
// //     },
// //     language_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: 'AllowedLanguages',
// //         key: 'id'
// //       }
// //     }
// //   }, {});

// //   return CodingQuestionLanguage;
// // };
