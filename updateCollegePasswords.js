const bcrypt = require('bcrypt');
const { College } = require('./models'); // Adjust the path as per your project structure

async function updateCollegePasswords() {
  try {
    // Fetch all colleges from the database
    const colleges = await College.findAll();

    for (const college of colleges) {
      // Skip if the password is already hashed (assuming hashed passwords are longer than 20 characters)
      if (college.password.length > 20) {
        console.log(`College ${college.name} already has a hashed password.`);
        continue;
      }

      // Hash the plain-text password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(college.password, salt);

      // Update the college password in the database
      college.password = hashedPassword;
      await college.save();

      console.log(`Password updated for college: ${college.name}`);
    }

    console.log('All college passwords have been updated.');
  } catch (error) {
    console.error('Error updating college passwords:', error);
  }
}

updateCollegePasswords();
