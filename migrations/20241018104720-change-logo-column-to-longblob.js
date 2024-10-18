'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Colleges', 'logo', {
      type: Sequelize.BLOB('long'),
      allowNull: true, // Allow NULL if the logo is optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Colleges', 'logo', {
      type: Sequelize.BLOB, // Revert to the original BLOB type
      allowNull: true,
    });
  }
};
