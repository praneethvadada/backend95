

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { College } = require('../models');
const multer = require('multer');
const storage = multer.memoryStorage(); // Store files in memory (as a buffer)
const upload = multer({ storage: storage });


// exports.createCollege = async (req, res) => {
//   try {
//     const { name, email, password, logo } = req.body;
//     const college = await College.create({ name, email, password, logo });
//     res.status(201).json({ message: 'College created successfully', college });
//   } catch (error) {
//     console.error('Error creating college:', error);
//     res.status(500).json({ message: 'Error creating college', error });
//   }
// };


// Create a new college
// exports.createCollege = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if the college already exists with the same email
//     const existingCollege = await College.findOne({ where: { email } });
//     if (existingCollege) {
//       return res.status(400).json({ message: 'College with this email already exists' });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create the college with the hashed password
//     const newCollege = await College.create({
//       name,
//       email,
//       password: hashedPassword
//     });

//     res.status(201).json({ message: 'College created successfully', college: newCollege });
//   } catch (error) {
//     console.error('Error creating college:', error);
//     res.status(500).json({ message: 'Error creating college', error });
//   }
// };




// Controller for handling image
// exports.createCollege = [
//   upload.single('logo'), // Multer middleware to handle single file upload with the field name 'logo'

//   async (req, res) => {
//     try {
//       const { name, email, password } = req.body;

//       // Check if the college already exists with the same email
//       const existingCollege = await College.findOne({ where: { email } });
//       if (existingCollege) {
//         return res.status(400).json({ message: 'College with this email already exists' });
//       }

//       // Hash the password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       // Handle the logo (if uploaded)
//       let logo = null;
//       if (req.file) {
//         logo = req.file.buffer; // Store the file buffer in the logo field
//       }

//       // Create the college with the hashed password and optional logo
//       const newCollege = await College.create({
//         name,
//         email,
//         password: hashedPassword,
//         logo // Store the logo as BLOB
//       });

//       res.status(201).json({ message: 'College created successfully', college: newCollege });
//     } catch (error) {
//       console.error('Error creating college:', error);
//       res.status(500).json({ message: 'Error creating college', error });
//     }
//   }
// ];
exports.createCollege = [
  upload.single('logo'), // Multer middleware to handle single file upload with the field name 'logo'

  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if the college already exists with the same email
      const existingCollege = await College.findOne({ where: { email } });
      if (existingCollege) {
        return res.status(400).json({ message: 'College with this email already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Handle the logo (if uploaded)
      let logo = null;
      if (req.file) {
        logo = req.file.buffer; // Store the file buffer in the logo field
      }

      // Create the college with the hashed password and optional logo
      const newCollege = await College.create({
        name,
        email,
        password: hashedPassword,
        logo // Store the logo as BLOB
      });

      res.status(201).json({ message: 'College created successfully', college: newCollege });
    } catch (error) {
      console.error('Error creating college:', error);
      res.status(500).json({ message: 'Error creating college', error });
    }
  }
];






// exports.createCollege = [
//   upload.single('logo'), // Multer middleware to handle single file upload with the field name 'logo'

//   async (req, res) => {
//     try {
//       const { name, email, password } = req.body;

//       // Check if the college already exists with the same email
//       const existingCollege = await College.findOne({ where: { email } });
//       if (existingCollege) {
//         return res.status(400).json({ message: 'College with this email already exists' });
//       }

//       // Hash the password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       // Handle the logo (if uploaded)
//       let logo = null;
//       if (req.file) {
//         logo = req.file.buffer; // Store the file buffer in the logo field
//       }

//       // Create the college with the hashed password and optional logo
//       const newCollege = await College.create({
//         name,
//         email,
//         password: hashedPassword,
//         logo // Store the logo as BLOB
//       });

//       res.status(201).json({ message: 'College created successfully', college: newCollege });
//     } catch (error) {
//       console.error('Error creating college:', error);
//       res.status(500).json({ message: 'Error creating college', error });
//     }
//   }
// ];

// exports.getColleges = async (req, res) => {
//   try {
//     const colleges = await College.findAll();
//     res.status(200).json({ message: 'Colleges fetched successfully', colleges });
//   } catch (error) {
//     console.error('Error fetching colleges:', error);
//     res.status(500).json({ message: 'Error fetching colleges', error });
//   }
// };

exports.getColleges = async (req, res) => {
  try {
    const colleges = await College.findAll();

    // Map through the colleges and convert the logo to Base64
    const collegesWithBase64Logo = colleges.map((college) => {
      const logoBase64 = college.logo ? college.logo.toString('base64') : null;
      return { ...college.toJSON(), logo: logoBase64 };
    });

    res.status(200).json({
      message: 'Colleges fetched successfully',
      colleges: collegesWithBase64Logo,
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ message: 'Error fetching colleges', error });
  }
};



// exports.getCollegeById = async (req, res) => {
//   try {
//     console.log("Hello");
//     const { id } = req.params;
//     const college = await College.findByPk(id);
//     if (!college) {
//       return res.status(404).json({ message: 'College not found' });
//     }
//     res.status(200).json({ message: 'College fetched successfully', college });
//   } catch (error) {
//     console.error('Error fetching college:', error);
//     res.status(500).json({ message: 'Error fetching college', error });
//   }
// };

exports.getCollegeById = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await College.findByPk(id);

    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    // Convert the logo to Base64 if it exists
    const logoBase64 = college.logo ? college.logo.toString('base64') : null;

    res.status(200).json({
      message: 'College fetched successfully',
      college: { ...college.toJSON(), logo: logoBase64 },
    });
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({ message: 'Error fetching college', error });
  }
};



// exports.updateCollege = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, email, password, logo } = req.body;
//     const college = await College.findByPk(id);
//     if (!college) {
//       return res.status(404).json({ message: 'College not found' });
//     }
//     await college.update({ name, email, password, logo });
//     res.status(200).json({ message: 'College updated successfully', college });
//   } catch (error) {
//     console.error('Error updating college:', error);
//     res.status(500).json({ message: 'Error updating college', error });
//   }
// };
exports.updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    let logo = req.file ? req.file.buffer : null; // Handle logo upload if any

    const college = await College.findByPk(id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    // If the password is provided, hash it before saving
    let updatedFields = { name, email, logo };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedFields.password = hashedPassword;
    }

    await college.update(updatedFields);
    res.status(200).json({ message: 'College updated successfully', college });
  } catch (error) {
    console.error('Error updating college:', error);
    res.status(500).json({ message: 'Error updating college', error });
  }
};


exports.deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const college = await College.findByPk(id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    await college.destroy();
    res.status(200).json({ message: 'College deleted successfully' });
  } catch (error) {
    console.error('Error deleting college:', error);
    res.status(500).json({ message: 'Error deleting college', error });
  }
};


// // Controller for College Login
// exports.collegeLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find the college by email
//     const college = await College.findOne({ where: { email } });
//     if (!college) {
//       return res.status(404).json({ message: 'College not found' });
//     }

//     // Check password
//     const passwordIsValid = bcrypt.compareSync(password, college.password);
//     if (!passwordIsValid) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: college.id, email: college.email, role: 'college' },
//       process.env.COLLEGE_JWT_SECRET,
//       { expiresIn: '1h' } // Token expires in 1 hour
//     );

//     res.status(200).json({
//       message: 'College login successful',
//       token,
//     });
//   } catch (error) {
//     console.error('Error during college login:', error);
//     res.status(500).json({ message: 'Internal server error', error });
//   }
// };



exports.collegeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the college by email
    const college = await College.findOne({ where: { email } });
    if (!college) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Check password
    const passwordIsValid = await bcrypt.compare(password, college.password);
    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: college.id, email: college.email, role: 'college' },
      process.env.COLLEGE_JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({
      message: 'College login successful',
      token,
    });
  } catch (error) {
    console.error('Error during college login:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
