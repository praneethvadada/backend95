const bcrypt = require('bcrypt');
const { Trainer } = require('./models'); // Adjust the path as per your project structure

async function updateCollegePasswords() {
  try {
    // Fetch all colleges from the database
    const Trainers = await Trainer.findAll();

    for (const Trainer of Trainers) {
      // Skip if the password is already hashed (assuming hashed passwords are longer than 20 characters)
      if (Trainer.password.length > 20) {
        console.log(`College ${Trainer.name} already has a hashed password.`);
        continue;
      }

      // Hash the plain-text password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Trainer.password, salt);

      // Update the college password in the database
      Trainer.password = hashedPassword;
      await Trainer.save();

      console.log(`Password updated for college: ${Trainer.name}`);
    }

    console.log('All college passwords have been updated.');
  } catch (error) {
    console.error('Error updating college passwords:', error);
  }
}

updateCollegePasswords();
