// Routes for admin API
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');


router.post('/register', adminController.createAdmin);
router.post('/login', adminController.adminLogin);
router.put('/edit/:id',verifyAdmin, adminController.updateAdmin);
router.delete('/delete/:id', verifyAdmin, adminController.deleteAdmin);

//Route to add a new programming languages
router.post('/add-language', verifyAdmin, adminController.addLanguage);


// //Domain Management
router.post('/add-mcq-domain', verifyAdmin, adminController.addMCQDomain);
router.post('/add-coding-domain', verifyAdmin, adminController.addCodingDomain);

router.put('/edit-mcq-domain/:id', verifyAdmin, adminController.editMCQDomain);
router.delete('/delete-mcq-domain/:id', verifyAdmin, adminController.deleteMCQDomain);

router.put('/edit-coding-domain/:id', verifyAdmin, adminController.editCodingDomain);
router.delete('/delete-coding-domain/:id', verifyAdmin, adminController.deleteCodingDomain);



module.exports = router;
