const { Batch } = require('../models');

exports.createBatch = async (req, res) => {
  try {
    const { name, college_id } = req.body;
    const batch = await Batch.create({ name, college_id });
    res.status(201).json({ message: 'Batch created successfully', batch });
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({ message: 'Error creating batch', error });
  }
};

exports.getBatches = async (req, res) => {
  try {
    const batches = await Batch.findAll();
    res.status(200).json({ message: 'Batches fetched successfully', batches });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Error fetching batches', error });
  }
};


exports.getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json({ message: 'Batch fetched successfully', batch });
  } catch (error) {
    console.error('Error fetching batch:', error);
    res.status(500).json({ message: 'Error fetching batch', error });
  }
};


exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, college_id } = req.body;
    const batch = await Batch.findByPk(id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    await batch.update({ name, college_id });
    res.status(200).json({ message: 'Batch updated successfully', batch });
  } catch (error) {
    console.error('Error updating batch:', error);
    res.status(500).json({ message: 'Error updating batch', error });
  }
};


exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    await batch.destroy();
    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({ message: 'Error deleting batch', error });
  }
};
// Fetch all batches by college_id
exports.getBatchesByCollegeId = async (req, res) => {
  try {
    const { college_id } = req.params;  // Get college_id from the route params
    
    // Find all batches for the given college_id
    const batches = await Batch.findAll({
      where: { college_id }  // Filter by college_id
    });

    if (!batches.length) {
      return res.status(404).json({ message: 'No batches found for this college' });
    }

    res.status(200).json({ message: 'Batches fetched successfully', batches });
  } catch (error) {
    console.error('Error fetching batches:', error);
    res.status(500).json({ message: 'Error fetching batches', error });
  }
};
