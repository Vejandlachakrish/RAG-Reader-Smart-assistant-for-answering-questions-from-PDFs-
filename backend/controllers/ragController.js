const { exec } = require('child_process');
const path = require('path');

const runRAG = async (req, res) => {
  const { question, pdfFileName } = req.body;

  const scriptPath = path.join(__dirname, '../utils/rag_pipeline.py');
  const filePath = path.join(__dirname, '../uploads/', pdfFileName);

  const command = `python "${scriptPath}" --file "${filePath}" --question "${question}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: stderr || 'Error running RAG pipeline' });
    res.json({ answer: stdout.trim() });
  });
};

module.exports = { runRAG };
