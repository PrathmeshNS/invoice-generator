const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Register helpers if needed (e.g., formatting currency)
handlebars.registerHelper('formatCurrency', function (amount) {
  return Number(amount).toFixed(2);
});

async function generateInvoice(data) {
  const templateName = data.template || 'minimal';
  
  // Path to the selected LaTeX template
  const templatePath = path.join(__dirname, '..', 'latex-engine', 'templates', templateName, 'invoice.tex');
  
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const compiledTemplate = handlebars.compile(templateContent);
  
  // Inject JSON data into template
  const texOutput = compiledTemplate(data);

  // Ensure generated directory exists
  const generatedDir = path.join(__dirname, '..', 'latex-engine', 'generated');
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }

  // Save the generated .tex file with a timestamp or unique ID
  const timestamp = Date.now();
  const outputFileName = `invoice_${timestamp}.tex`;
  const outputPath = path.join(generatedDir, outputFileName);
  
  fs.writeFileSync(outputPath, texOutput);
  
  return outputPath;
}

module.exports = generateInvoice;
