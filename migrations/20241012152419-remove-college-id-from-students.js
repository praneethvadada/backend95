'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Students', 'college_id');
  },

  down: async (queryInterface, Sequelize) => {
    // In case you want to revert the migration
    await queryInterface.addColumn('Students', 'college_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Colleges',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
