const path = require('path');
const PDF = require('../models/PDF');
const fs = require('fs');

const uploadPDF = async (req, res) => {
  try {
    if (!req.files || !req.files.pdf) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const pdfFile = req.files.pdf;
    const filename = `${Date.now()}_${pdfFile.name}`;
    const uploadPath = path.join(__dirname, '../uploads/', filename);

    await pdfFile.mv(uploadPath);

    const pdfDoc = await PDF.create({
      user: req.user._id,
      filename,
      originalName: pdfFile.name
    });

    res.status(201).json(pdfDoc);
  } catch (err) {
    res.status(500).json({ message: 'PDF upload failed', error: err.message });
  }
};

const getUserPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find({ user: req.user._id });
    res.json(pdfs);
  } catch (err) {
    res.status(500).json({ message: 'Could not retrieve PDFs' });
  }
};

module.exports = { uploadPDF, getUserPDFs };
