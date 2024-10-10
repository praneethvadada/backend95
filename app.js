// Main server file
const express = require('express');
const app = express();
const adminRoutes = require('./routes/adminRoutes');
const trainerRoutes = require('./routes/trainerRoutes');

require('dotenv').config();

app.use(express.json());
app.use('/admin', adminRoutes);
app.use('/trainer', trainerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});