const { Student, Batch } = require('../models');

// Add a new student
exports.createStudent = async (req, res) => {
  try {
    const { name, email, password, batch_id } = req.body;

    // Check if batch exists before creating a student
    const batch = await Batch.findByPk(batch_id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Create the student
    const student = await Student.create({ name, email, password, batch_id });
    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student', error });
  }
};

// Fetch all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [{ model: Batch, attributes: ['name'] }]
    });
    res.status(200).json({ message: 'Students fetched successfully', students });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error });
  }
};

// Fetch student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      include: [{ model: Batch, attributes: ['name'] }]
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json({ message: 'Student fetched successfully', student });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Error fetching student', error });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if batch exists
    // const batch = await Batch.findByPk(batch_id);
    // if (!batch) {
    //   return res.status(404).json({ message: 'Batch not found' });
    // }

    // Update student
    await student.update({ name, email, password });
    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student', error });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.destroy();
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error });
  }
};


// exports.getStudentsByBatchId = async (req, res) => {
//   try {
//     const { batch_id } = req.params;

//     // Find the batch by ID
//     const batch = await Batch.findByPk(batch_id);
//     if (!batch) {
//       return res.status(404).json({ message: 'Batch not found' });
//     }

//     // Find all students in the batch
//     const students = await Student.findAll({
//       where: { batch_id },
//       include: [{ model: Batch, attributes: ['name'] }]
//     });

//     res.status(200).json({ message: 'Students fetched successfully', students });
//   } catch (error) {
//     console.error('Error fetching students by batch:', error);
//     res.status(500).json({ message: 'Error fetching students by batch', error });
//   }
// };

// exports.getStudentsByBatchId = async (req, res) => {
//   try {
//     const { batch_id } = req.params;

//     // Find the batch by ID
//     const batch = await Batch.findByPk(batch_id);
//     if (!batch) {
//       return res.status(404).json({ message: 'Batch not found' });
//     }

//     // Find all students in the batch
//     const students = await Student.findAll({
//       where: { batch_id },
//       include: [{ model: Batch, attributes: ['name'] }]
//     });

//     res.status(200).json({ message: 'Students fetched successfully', students });
//   } catch (error) {
//     console.error('Error fetching students by batch:', error);
//     res.status(500).json({ message: 'Error fetching students by batch', error });
//   }
// };

// exports.getStudentsByBatchId = async (req, res) => {
//   try {
//     const { batch_id } = req.params;

//     // Ensure the batch exists
//     const batch = await Batch.findByPk(batch_id);
//     if (!batch) {
//       return res.status(404).json({ message: 'Batch not found' });
//     }

//     // Fetch all students belonging to the batch
//     const students = await Student.findAll({
//       where: { batch_id },
//       include: [{ model: Batch, attributes: ['name'] }]  // Include only the batch name, no college references
//     });

//     res.status(200).json({ message: 'Students fetched successfully', students });
//   } catch (error) {
//     console.error('Error fetching students by batch:', error);
//     res.status(500).json({ message: 'Error fetching students by batch', error });
//     logging: console.log  // This will log the generated SQL query

//   }
// };
exports.getStudentsByBatchId = async (req, res) => {
  try {
    const { batch_id } = req.params;

    // Find the batch by ID
    const batch = await Batch.findByPk(batch_id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    // Find all students in the batch
    const students = await Student.findAll({
      where: { batch_id },
      include: [{ model: Batch, attributes: ['name'] }]  // No reference to college_id here
    });

    res.status(200).json({ message: 'Students fetched successfully', students });
  } catch (error) {
    console.error('Error fetching students by batch:', error);
    res.status(500).json({ message: 'Error fetching students by batch', error });
  }
};


// const { Student } = require('../models');

// exports.createStudent = async (req, res) => {
//   try {
//     const { name, email, password, college_id, batch_id } = req.body;
//     const student = await Student.create({ name, email, password, college_id, batch_id });
//     res.status(201).json({ message: 'Student created successfully', student });
//   } catch (error) {
//     console.error('Error creating student:', error);
//     res.status(500).json({ message: 'Error creating student', error });
//   }
// };

// exports.getStudents = async (req, res) => {
//   try {
//     const students = await Student.findAll();
//     res.status(200).json({ message: 'Students fetched successfully', students });
//   } catch (error) {
//     console.error('Error fetching students:', error);
//     res.status(500).json({ message: 'Error fetching students', error });
//   }
// };
