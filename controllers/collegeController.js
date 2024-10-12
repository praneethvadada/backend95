const { College } = require('../models');

exports.createCollege = async (req, res) => {
  try {
    const { name, email, password, logo } = req.body;
    const college = await College.create({ name, email, password, logo });
    res.status(201).json({ message: 'College created successfully', college });
  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({ message: 'Error creating college', error });
  }
};

exports.getColleges = async (req, res) => {
  try {
    const colleges = await College.findAll();
    res.status(200).json({ message: 'Colleges fetched successfully', colleges });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ message: 'Error fetching colleges', error });
  }
};


exports.getCollegeById = async (req, res) => {
  try {
    console.log("Hello");
    const { id } = req.params;
    const college = await College.findByPk(id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.status(200).json({ message: 'College fetched successfully', college });
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({ message: 'Error fetching college', error });
  }
};


exports.updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, logo } = req.body;
    const college = await College.findByPk(id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }
    await college.update({ name, email, password, logo });
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
