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
