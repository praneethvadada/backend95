﻿// Main server file
const express = require('express');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const batchRoutes = require('./routes/batchRoutes');
const studentRoutes = require('./routes/studentRoutes');
const languageRoutes = require('./routes/languageRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes'); // Import the new assessment routes
const examsessionsRoutes = require('./routes/examsessionsRoutes'); // Import the new assessment routes

const cors = require('cors');

app.use(cors());

require('dotenv').config();

app.use(express.json());
app.use('/admin', adminRoutes);
app.use('/trainer', trainerRoutes);
app.use('/colleges', collegeRoutes);
app.use('/batches', batchRoutes);
app.use('/students', studentRoutes);
app.use('/languages', languageRoutes);
app.use('/assessments', assessmentRoutes); // Use the new assessment routes
app.use('/timer', examsessionsRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});