'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the `id` column entirely
    await queryInterface.removeColumn('student_mcq_answers', 'id');

    // Add composite primary key on (student_id, question_id)
    await queryInterface.sequelize.query(`
      ALTER TABLE student_mcq_answers 
      ADD PRIMARY KEY (student_id, question_id);
    `);

    // Apply Partitioning by student_id
    await queryInterface.sequelize.query(`
      ALTER TABLE student_mcq_answers
      PARTITION BY HASH(student_id)
      PARTITIONS 16;
    `);

    // Add additional indexes
    await queryInterface.addIndex('student_mcq_answers', ['domain_id'], {
      name: 'idx_domain'
    });
    await queryInterface.addIndex('student_mcq_answers', ['is_attempted'], {
      name: 'idx_is_attempted'
    });
    await queryInterface.addIndex('student_mcq_answers', ['marked'], {
      name: 'idx_marked'
    });
    await queryInterface.addIndex('student_mcq_answers', ['is_reported'], {
      name: 'idx_is_reported'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex('student_mcq_answers', 'idx_domain');
    await queryInterface.removeIndex('student_mcq_answers', 'idx_is_attempted');
    await queryInterface.removeIndex('student_mcq_answers', 'idx_marked');
    await queryInterface.removeIndex('student_mcq_answers', 'idx_is_reported');

    // Remove composite primary key
    await queryInterface.removeConstraint('student_mcq_answers', 'PRIMARY');

    // Add `id` column back with AUTO_INCREMENT as primary key
    await queryInterface.addColumn('student_mcq_answers', 'id', {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    });

    // Drop Partitioning (cannot directly unpartition in MySQL; table would need re-creation)
  },
};

// 'use strict';
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     // Drop current primary key on `id`
//     await queryInterface.removeConstraint('student_mcq_answers', 'PRIMARY');

//     // Remove AUTO_INCREMENT from `id` and make it a regular integer
//     await queryInterface.changeColumn('student_mcq_answers', 'id', {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//     });

//     // Add composite primary key on (id, student_id)
//     await queryInterface.sequelize.query(`
//       ALTER TABLE student_mcq_answers 
//       ADD PRIMARY KEY (id, student_id);
//     `);

//     // Apply Partitioning by student_id
//     await queryInterface.sequelize.query(`
//       ALTER TABLE student_mcq_answers
//       PARTITION BY HASH(student_id)
//       PARTITIONS 16;
//     `);

//     // Add indexes
//     await queryInterface.addIndex('student_mcq_answers', ['student_id', 'question_id'], {
//       name: 'idx_student_question'
//     });
//     await queryInterface.addIndex('student_mcq_answers', ['domain_id'], {
//       name: 'idx_domain'
//     });
//     await queryInterface.addIndex('student_mcq_answers', ['is_attempted'], {
//       name: 'idx_is_attempted'
//     });
//     await queryInterface.addIndex('student_mcq_answers', ['marked'], {
//       name: 'idx_marked'
//     });
//     await queryInterface.addIndex('student_mcq_answers', ['is_reported'], {
//       name: 'idx_is_reported'
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     // Remove indexes
//     await queryInterface.removeIndex('student_mcq_answers', 'idx_student_question');
//     await queryInterface.removeIndex('student_mcq_answers', 'idx_domain');
//     await queryInterface.removeIndex('student_mcq_answers', 'idx_is_attempted');
//     await queryInterface.removeIndex('student_mcq_answers', 'idx_marked');
//     await queryInterface.removeIndex('student_mcq_answers', 'idx_is_reported');

//     // Drop composite primary key and re-add single primary key on `id` with AUTO_INCREMENT
//     await queryInterface.removeConstraint('student_mcq_answers', 'PRIMARY');
//     await queryInterface.changeColumn('student_mcq_answers', 'id', {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//     });

//     // Drop Partitioning (cannot directly unpartition in MySQL; table would need re-creation)
//   },
// };

// // 'use strict';
// // module.exports = {
// //   up: async (queryInterface, Sequelize) => {
// //     // Drop current primary key on `id`
// //     await queryInterface.removeConstraint('student_mcq_answers', 'PRIMARY');

// //     // Remove AUTO_INCREMENT from `id`
// //     await queryInterface.changeColumn('student_mcq_answers', 'id', {
// //       type: Sequelize.INTEGER,
// //       allowNull: false,
// //     });

// //     // Add composite primary key on (id, student_id)
// //     await queryInterface.sequelize.query(`
// //       ALTER TABLE student_mcq_answers 
// //       ADD PRIMARY KEY (id, student_id);
// //     `);

// //     // Apply Partitioning by student_id
// //     await queryInterface.sequelize.query(`
// //       ALTER TABLE student_mcq_answers
// //       PARTITION BY HASH(student_id)
// //       PARTITIONS 16;
// //     `);

// //     // Add indexes
// //     await queryInterface.addIndex('student_mcq_answers', ['student_id', 'question_id'], {
// //       name: 'idx_student_question'
// //     });
// //     await queryInterface.addIndex('student_mcq_answers', ['domain_id'], {
// //       name: 'idx_domain'
// //     });
// //     await queryInterface.addIndex('student_mcq_answers', ['is_attempted'], {
// //       name: 'idx_is_attempted'
// //     });
// //     await queryInterface.addIndex('student_mcq_answers', ['marked'], {
// //       name: 'idx_marked'
// //     });
// //     await queryInterface.addIndex('student_mcq_answers', ['is_reported'], {
// //       name: 'idx_is_reported'
// //     });
// //   },

// //   down: async (queryInterface, Sequelize) => {
// //     // Remove indexes
// //     await queryInterface.removeIndex('student_mcq_answers', 'idx_student_question');
// //     await queryInterface.removeIndex('student_mcq_answers', 'idx_domain');
// //     await queryInterface.removeIndex('student_mcq_answers', 'idx_is_attempted');
// //     await queryInterface.removeIndex('student_mcq_answers', 'idx_marked');
// //     await queryInterface.removeIndex('student_mcq_answers', 'idx_is_reported');

// //     // Drop composite primary key and re-add single primary key on `id` with AUTO_INCREMENT
// //     await queryInterface.removeConstraint('student_mcq_answers', 'PRIMARY');
// //     await queryInterface.changeColumn('student_mcq_answers', 'id', {
// //       type: Sequelize.INTEGER,
// //       allowNull: false,
// //       autoIncrement: true,
// //       primaryKey: true,
// //     });

// //     // Drop Partitioning (cannot directly unpartition in MySQL; table would need re-creation)
// //   },
// // };

// // // 'use strict';
// // // module.exports = {
// // //   up: async (queryInterface, Sequelize) => {
// // //     // Drop current primary key on `id`
// // //     await queryInterface.removeConstraint('student_mcq_answers', 'PRIMARY');

// // //     // Add composite primary key on (id, student_id)
// // //     await queryInterface.sequelize.query(`
// // //       ALTER TABLE student_mcq_answers 
// // //       ADD PRIMARY KEY (id, student_id);
// // //     `);

// // //     // Apply Partitioning by student_id
// // //     await queryInterface.sequelize.query(`
// // //       ALTER TABLE student_mcq_answers
// // //       PARTITION BY HASH(student_id)
// // //       PARTITIONS 16;
// // //     `);

// // //     // Add indexes
// // //     await queryInterface.addIndex('student_mcq_answers', ['student_id', 'question_id'], {
// // //       name: 'idx_student_question'
// // //     });
// // //     await queryInterface.addIndex('student_mcq_answers', ['domain_id'], {
// // //       name: 'idx_domain'
// // //     });
// // //     await queryInterface.addIndex('student_mcq_answers', ['is_attempted'], {
// // //       name: 'idx_is_attempted'
// // //     });
// // //     await queryInterface.addIndex('student_mcq_answers', ['marked'], {
// // //       name: 'idx_marked'
// // //     });
// // //     await queryInterface.addIndex('student_mcq_answers', ['is_reported'], {
// // //       name: 'idx_is_reported'
// // //     });
// // //   },

// // //   down: async (queryInterface, Sequelize) => {
// // //     // Remove indexes
// // //     await queryInterface.removeIndex('student_mcq_answers', 'idx_student_question');
// // //     await queryInterface.removeIndex('student_mcq_answers', 'idx_domain');
// // //     await queryInterface.removeIndex('student_mcq_answers', 'idx_is_attempted');
// // //     await queryInterface.removeIndex('student_mcq_answers', 'idx_marked');
// // //     await queryInterface.removeIndex('student_mcq_answers', 'idx_is_reported');

// // //     // Drop composite primary key and re-add single primary key on `id`
// // //     await queryInterface.removeConstraint('student_mcq_answers', 'PRIMARY');
// // //     await queryInterface.sequelize.query(`
// // //       ALTER TABLE student_mcq_answers 
// // //       ADD PRIMARY KEY (id);
// // //     `);

// // //     // Drop Partitioning (cannot directly unpartition in MySQL; table would need re-creation)
// // //   },
// // // };

// // // // 'use strict';
// // // // module.exports = {
// // // //   up: async (queryInterface, Sequelize) => {
// // // //     // Partition the table by `student_id`
// // // //     await queryInterface.sequelize.query(`
// // // //       ALTER TABLE student_mcq_answers
// // // //       PARTITION BY HASH(student_id)
// // // //       PARTITIONS 16;
// // // //     `);

// // // //     // Add indexes
// // // //     await queryInterface.addIndex('student_mcq_answers', ['student_id', 'question_id'], {
// // // //       name: 'idx_student_question'
// // // //     });
// // // //     await queryInterface.addIndex('student_mcq_answers', ['domain_id'], {
// // // //       name: 'idx_domain'
// // // //     });
// // // //     await queryInterface.addIndex('student_mcq_answers', ['is_attempted'], {
// // // //       name: 'idx_is_attempted'
// // // //     });
// // // //     await queryInterface.addIndex('student_mcq_answers', ['marked'], {
// // // //       name: 'idx_marked'
// // // //     });
// // // //     await queryInterface.addIndex('student_mcq_answers', ['is_reported'], {
// // // //       name: 'idx_is_reported'
// // // //     });
// // // //   },

// // // //   down: async (queryInterface, Sequelize) => {
// // // //     await queryInterface.removeIndex('student_mcq_answers', 'idx_student_question');
// // // //     await queryInterface.removeIndex('student_mcq_answers', 'idx_domain');
// // // //     await queryInterface.removeIndex('student_mcq_answers', 'idx_is_attempted');
// // // //     await queryInterface.removeIndex('student_mcq_answers', 'idx_marked');
// // // //     await queryInterface.removeIndex('student_mcq_answers', 'idx_is_reported');

// // // //     // Dropping Partitioned Table (Note: Partitioning cannot be removed directly)
// // // //   },
// // // // };
