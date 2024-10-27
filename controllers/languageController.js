const { AllowedLanguage } = require('../models');



// Create a new language
exports.createLanguage = async (req, res) => {
    try {
      const { language_name } = req.body;
  
      if (!language_name) {
        return res.status(400).json({ message: 'Language name is required' });
      }
  
      const newLanguage = await AllowedLanguage.create({ language_name });
      res.status(201).json({ message: 'Language created successfully', newLanguage });
    } catch (error) {
      console.error('Error creating language:', error);
      res.status(500).json({ message: 'Error creating language', error });
    }
  };
// Get all languages
exports.getLanguages = async (req, res) => {
    try {
      const languages = await AllowedLanguage.findAll();
      res.status(200).json({ message: 'Languages fetched successfully', languages });
    } catch (error) {
      console.error('Error fetching languages:', error);
      res.status(500).json({ message: 'Error fetching languages', error });
    }
  };
// Update a language by ID
exports.updateLanguage = async (req, res) => {
    try {
      const { id } = req.params;
      const { language_name } = req.body;
  
      const language = await AllowedLanguage.findByPk(id);
      if (!language) {
        return res.status(404).json({ message: 'Language not found' });
      }
  
      language.language_name = language_name || language.language_name;
      await language.save();
  
      res.status(200).json({ message: 'Language updated successfully', language });
    } catch (error) {
      console.error('Error updating language:', error);
      res.status(500).json({ message: 'Error updating language', error });
    }
  };
// Delete a language by ID
exports.deleteLanguage = async (req, res) => {
    try {
      const { id } = req.params;
  
      const language = await AllowedLanguage.findByPk(id);
      if (!language) {
        return res.status(404).json({ message: 'Language not found' });
      }
  
      await language.destroy();
      res.status(200).json({ message: 'Language deleted successfully' });
    } catch (error) {
      console.error('Error deleting language:', error);
      res.status(500).json({ message: 'Error deleting language', error });
    }
  };
        



// const { Language } = require('../models');

// // Get all languages
// exports.getAllLanguages = async (req, res) => {
//   try {
//     const languages = await Language.findAll();
//     res.status(200).json({ message: 'Languages fetched successfully', languages });
//   } catch (error) {
//     console.error('Error fetching languages:', error);
//     res.status(500).json({ message: 'Error fetching languages', error });
//   }
// };

// // Add a new language
// exports.addLanguage = async (req, res) => {
//   try {
//     const { language_name } = req.body;

//     if (!language_name) {
//       return res.status(400).json({ message: 'Language name is required' });
//     }

//     const newLanguage = await Language.create({ language_name });
//     res.status(201).json({ message: 'Language added successfully', language: newLanguage });
//   } catch (error) {
//     console.error('Error adding language:', error);
//     res.status(500).json({ message: 'Error adding language', error });
//   }
// };

// // Edit an existing language
// exports.editLanguage = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { language_name } = req.body;

//     const language = await Language.findByPk(id);
//     if (!language) {
//       return res.status(404).json({ message: 'Language not found' });
//     }

//     language.language_name = language_name || language.language_name;
//     await language.save();
//     res.status(200).json({ message: 'Language updated successfully', language });
//   } catch (error) {
//     console.error('Error updating language:', error);
//     res.status(500).json({ message: 'Error updating language', error });
//   }
// };

// // Delete a language
// exports.deleteLanguage = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const language = await Language.findByPk(id);
//     if (!language) {
//       return res.status(404).json({ message: 'Language not found' });
//     }

//     await language.destroy();
//     res.status(200).json({ message: 'Language deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting language:', error);
//     res.status(500).json({ message: 'Error deleting language', error });
//   }
// };
