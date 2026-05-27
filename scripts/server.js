const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const generateInvoice = require('./generateInvoice');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.post('/api/generate-pdf', async (req, res) => {
  try {
    const invoiceData = req.body;
    
    // 1. Generate the .tex file from template
    const texFilePath = await generateInvoice(invoiceData);
    
    // 2. Compile LaTeX to PDF
    const outputDir = path.dirname(texFilePath);
    const fileName = path.basename(texFilePath, '.tex');
    const pdfPath = path.join(outputDir, `${fileName}.pdf`);
    
    // We run xelatex twice to resolve references/layout properly, though once might suffice for simple invoices
    const compileCmd = `xelatex -output-directory="${outputDir}" -interaction=nonstopmode "${texFilePath}"`;
    
    exec(compileCmd, (error, stdout, stderr) => {
      if (error) {
        console.error('LaTeX compilation error:', stderr);
        return res.status(500).json({ error: 'Failed to generate PDF', details: stderr });
      }
      
      // 3. Send PDF back to client
      if (fs.existsSync(pdfPath)) {
        res.download(pdfPath, 'invoice.pdf', (err) => {
          if (err) {
            console.error('Error sending file:', err);
          }
          // Optional: Clean up generated files (.tex, .pdf, .aux, .log) after sending
        });
      } else {
        res.status(500).json({ error: 'PDF file not found after compilation' });
      }
    });

  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
