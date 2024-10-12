// models/batch.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Batch = sequelize.define('Batch', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Colleges',
        key: 'id'
      }
    }
  }, {});

  Batch.associate = (models) => {
    Batch.belongsTo(models.College, { foreignKey: 'college_id' });
    Batch.hasMany(models.Student, { foreignKey: 'batch_id' });
  };

  return Batch;
};

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Batch = sequelize.define('Batch', {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     }
//   }, {});

//   Batch.associate = (models) => {
//     Batch.hasMany(models.Student, { foreignKey: 'batch_id' });
//   };

//   return Batch;
// };

// // // models/batch.js
// // 'use strict';
// // module.exports = (sequelize, DataTypes) => {
// //   const Batch = sequelize.define('Batch', {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       autoIncrement: true,
// //       primaryKey: true
// //     },
// //     name: {
// //       type: DataTypes.STRING,
// //       allowNull: false,
// //       unique: true
// //     },
// //     college_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: 'Colleges',
// //         key: 'id'
// //       }
// //     }
// //   }, {});
  
// //   Batch.associate = (models) => {
// //     Batch.belongsTo(models.College, { foreignKey: 'college_id' });
// //     Batch.hasMany(models.Student, { foreignKey: 'batch_id' });
// //   };
  
// //   return Batch;
// // };
