'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Students', 'college_id');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Students', 'college_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
