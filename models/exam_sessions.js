'use strict';
module.exports = (sequelize, DataTypes) => {
  const ExamSession = sequelize.define('ExamSession', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    assessment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assessments', // Name of the table, not the model
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    remaining_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'paused', 'completed', 'expired', 'ended'),
      allowNull: true,
      defaultValue: 'active'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'exam_sessions', // Explicitly define the table name
    timestamps: true // Enable createdAt and updatedAt
  });

  ExamSession.associate = (models) => {
    // Define associations
    ExamSession.belongsTo(models.Assessment, {
      foreignKey: 'assessment_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return ExamSession;
};
