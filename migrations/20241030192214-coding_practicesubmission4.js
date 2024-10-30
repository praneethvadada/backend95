// migrations/YYYYMMDDHHMMSS-create-student-submissions.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
      // Create table with composite primary key (submission_id, student_id)
      await queryInterface.createTable('Student_Submissions', {
          submission_id: {
              type: Sequelize.INTEGER,
              autoIncrement: true,
              primaryKey: true
          },
          student_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              primaryKey: true // Part of the composite primary key for partitioning
          },
          domain_id: {
              type: Sequelize.INTEGER,
              allowNull: false
          },
          question_id: {
              type: Sequelize.INTEGER,
              allowNull: false
          },
          score: {
              type: Sequelize.FLOAT,
              allowNull: true,
              validate: { min: 0, max: 100 }
          },
          question_points: {
              type: Sequelize.INTEGER,
              allowNull: false,
              validate: { isIn: [[100, 200, 300, 400, 500]] }
          },
          solution_code: {
              type: Sequelize.TEXT,
              allowNull: true
          },
          status: {
              type: Sequelize.STRING,
              allowNull: false,
              validate: { isIn: [["pass", "fail", "partial", "draft"]] }
          },
          submitted_at: {
              type: Sequelize.DATE,
              allowNull: true
          },
          last_updated: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.NOW
          },
          language: {
              type: Sequelize.STRING,
              allowNull: true
          },
          is_reported: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: false
          },
          report_text: {
              type: Sequelize.TEXT,
              allowNull: true
          }
      });

      // Add partitioning on student_id
      await queryInterface.sequelize.query(`
          ALTER TABLE Student_Submissions
          PARTITION BY RANGE (student_id) (
              PARTITION p1 VALUES LESS THAN (101),
              PARTITION p2 VALUES LESS THAN (201),
              PARTITION p3 VALUES LESS THAN (301),
              PARTITION p4 VALUES LESS THAN (401),
              PARTITION p5 VALUES LESS THAN (501),
              PARTITION p6 VALUES LESS THAN (601),
              PARTITION p7 VALUES LESS THAN (701),
              PARTITION p8 VALUES LESS THAN (801),
              PARTITION p9 VALUES LESS THAN (901),
              PARTITION p10 VALUES LESS THAN (1001)
          );
      `);

      // Add indexes for efficient querying
      await queryInterface.addIndex('Student_Submissions', ['student_id', 'domain_id'], {
          name: 'idx_student_domain'
      });
      await queryInterface.addIndex('Student_Submissions', ['question_id'], {
          name: 'idx_question_in_domain'
      });
      await queryInterface.addIndex('Student_Submissions', ['status'], {
          name: 'idx_status'
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Student_Submissions');
  }
};
