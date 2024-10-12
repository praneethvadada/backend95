'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Filter only files that end with .js and are not index.js
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    try {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    } catch (error) {
      console.error(`Error initializing model ${file}:`, error.message);
    }
  });

// Call the associate method on each model, if defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// db.BatchPracticeQuestion = require('./batch_practice_questions')(sequelize, Sequelize.DataTypes);

module.exports = db;




// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.js')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// // Filter only files that end with .js, are not the index.js, and are valid Sequelize model exports
// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file));
//     if (typeof model === 'function') {
//       db[model(sequelize, Sequelize.DataTypes).name] = model(sequelize, Sequelize.DataTypes);
//     }
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

// // 'use strict';

// // const fs = require('fs');
// // const path = require('path');
// // const Sequelize = require('sequelize');
// // const basename = path.basename(__filename);
// // const env = process.env.NODE_ENV || 'development';
// // const config = require(__dirname + '/../config/config.js')[env];
// // const db = {};

// // const sequelize = new Sequelize(config.database, config.username, config.password, config);

// // fs
// //   .readdirSync(__dirname)
// //   .filter(file => {
// //     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
// //   })
// //   .forEach(file => {
// //     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);  // Use require instead of sequelize.import
// //     db[model.name] = model;
// //   });

// // Object.keys(db).forEach(modelName => {
// //   if (db[modelName].associate) {
// //     db[modelName].associate(db);
// //   }
// // });

// // db.sequelize = sequelize;
// // db.Sequelize = Sequelize;

// // module.exports = db;

// // // // Sequelize initialization (auto-loads all models)
// // // 'use strict';

// // // const fs = require('fs');
// // // const path = require('path');
// // // const Sequelize = require('sequelize');
// // // const basename = path.basename(__filename);
// // // const env = process.env.NODE_ENV || 'development';
// // // const config = require(__dirname + '/../config/config.js')[env];
// // // const db = {};

// // // const sequelize = new Sequelize(config.database, config.username, config.password, config);

// // // fs
// // //   .readdirSync(__dirname)
// // //   .filter(file => {
// // //     return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
// // //   })
// // //   .forEach(file => {
// // //     const model = sequelize['import'](path.join(__dirname, file));
// // //     db[model.name] = model;
// // //   });

// // // Object.keys(db).forEach(modelName => {
// // //   if (db[modelName].associate) {
// // //     db[modelName].associate(db);
// // //   }
// // // });

// // // db.sequelize = sequelize;
// // // db.Sequelize = Sequelize;

// // // module.exports = db;
