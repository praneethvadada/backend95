// models/StudentSubmission.js
module.exports = (sequelize, DataTypes) => {
    const StudentSubmission = sequelize.define("StudentSubmission", {
        submission_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        domain_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        score: {
            type: DataTypes.FLOAT,
            allowNull: true,
            validate: { min: 0, max: 100 } 
        },
        question_points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { isIn: [[100, 200, 300, 400, 500]] }
        },
        solution_code: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { isIn: [["pass", "fail", "partial", "draft"]] }
        },
        submitted_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        last_updated: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        language: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_reported: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        report_text: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'Student_Submissions',
        timestamps: false 
    });

    return StudentSubmission;
};
