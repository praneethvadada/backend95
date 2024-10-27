'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Students', 'roll_no', {
      type: Sequelize.STRING,
      allowNull: false, // Ensuring that roll_no is not null
      unique: true,     // Ensuring that roll_no is unique
      after: 'email'    // Adding roll_no after the 'email' field
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Students', 'roll_no');
  }
};
