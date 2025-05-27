const express = require('express');
const router = express.Router();
const { uploadPDF, getUserPDFs } = require('../controllers/pdfController');
const { protect } = require('../middleware/authMiddleware');
const fileUpload = require('express-fileupload');

router.use(fileUpload());

router.post('/upload', protect, uploadPDF);
router.get('/my-pdfs', protect, getUserPDFs);

module.exports = router;
