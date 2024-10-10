'use strict';
module.exports = (sequelize, DataTypes) => {
  const AllowedLanguage = sequelize.define('AllowedLanguage', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    language_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});

  return AllowedLanguage;
};


// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const AllowedLanguage = sequelize.define('AllowedLanguage', {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     language_name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     }
//   }, {});

//   AllowedLanguage.associate = (models) => {
//     AllowedLanguage.belongsToMany(models.CodingQuestion, {
//       through: 'CodingQuestionLanguages',
//       foreignKey: 'language_id',
//       otherKey: 'coding_question_id'
//     });
//   };

//   return AllowedLanguage;
// };

// // 'use strict';
// // module.exports = {
// //   up: (queryInterface, Sequelize) => {
// //     return queryInterface.createTable('AllowedLanguages', {
// //       id: {
// //         allowNull: false,
// //         autoIncrement: true,
// //         primaryKey: true,
// //         type: Sequelize.INTEGER
// //       },
// //       language_name: {
// //         type: Sequelize.STRING,
// //         allowNull: false
// //       },
// //       createdAt: {
// //         allowNull: false,
// //         type: Sequelize.DATE,
// //         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
// //       },
// //       updatedAt: {
// //         allowNull: false,
// //         type: Sequelize.DATE,
// //         defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
// //       }
// //     });
// //   },
// //   down: (queryInterface, Sequelize) => {
// //     return queryInterface.dropTable('AllowedLanguages');
// //   }
// // };
