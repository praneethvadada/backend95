// models/student.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Batches',
        key: 'id'
      }
    }
  }, {});

  Student.associate = (models) => {
    Student.belongsTo(models.Batch, { foreignKey: 'batch_id' });
  };

  return Student;
};

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   const Student = sequelize.define('Student', {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     batch_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'Batches',
//         key: 'id'
//       }
//     }
//   }, {});

//   Student.associate = (models) => {
//     Student.belongsTo(models.Batch, { foreignKey: 'batch_id' });
//   };

//   return Student;
// };

// // // models/student.js
// // 'use strict';
// // module.exports = (sequelize, DataTypes) => {
// //   const Student = sequelize.define('Student', {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       autoIncrement: true,
// //       primaryKey: true
// //     },
// //     name: {
// //       type: DataTypes.STRING,
// //       allowNull: false
// //     },
// //     email: {
// //       type: DataTypes.STRING,
// //       allowNull: false,
// //       unique: true
// //     },
// //     password: {
// //       type: DataTypes.STRING,
// //       allowNull: false
// //     },
// //     college_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: 'Colleges',
// //         key: 'id'
// //       }
// //     },
// //     batch_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: 'Batches',
// //         key: 'id'
// //       }
// //     }
// //   }, {});
  
// //   Student.associate = (models) => {
// //     Student.belongsTo(models.College, { foreignKey: 'college_id' });
// //     Student.belongsTo(models.Batch, { foreignKey: 'batch_id' });
// //   };
  
// //   return Student;
// // };
