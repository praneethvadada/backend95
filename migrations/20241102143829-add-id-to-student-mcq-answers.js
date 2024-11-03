module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('student_mcq_answers', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // or any default value that makes sense
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('student_mcq_answers', 'id');
  }
};
