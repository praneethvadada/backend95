const express = require('express');
const router = express.Router();
const languageController = require('../controllers/languageController');

router.get('/get-all-languages', languageController.getLanguages); // Get all languages
router.post('/add-language', languageController.createLanguage); // Add a new language
router.put('/edit-language/:id', languageController.updateLanguage); // Edit an existing language
router.delete('/delete-language/:id', languageController.deleteLanguage); // Delete a language

module.exports = router;
