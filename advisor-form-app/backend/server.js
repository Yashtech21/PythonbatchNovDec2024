const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const excelFilePath = path.join(dataDir, 'advisor_data.xlsx');

// Initialize Excel file if it doesn't exist
function initializeExcelFile() {
  if (!fs.existsSync(excelFilePath)) {
    const headers = [
      'Submission Date',
      'First Name',
      'Last Name', 
      'Email',
      'Phone',
      'Street Address',
      'City',
      'State',
      'ZIP Code',
      'Advisor ID',
      'Department',
      'Start Date',
      'Active'
    ];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.book_append_sheet(wb, ws, 'Advisor Data');
    XLSX.writeFile(wb, excelFilePath);
  }
}

// API endpoint to submit advisor data
app.post('/api/submit-advisor', (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      streetAddress,
      city,
      state,
      zipCode,
      advisorId,
      department,
      startDate,
      active
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !advisorId) {
      return res.status(400).json({ 
        error: 'Missing required fields: firstName, lastName, email, advisorId' 
      });
    }

    // Prepare data row
    const submissionDate = new Date().toISOString().split('T')[0];
    const newRow = [
      submissionDate,
      firstName,
      lastName,
      email,
      phone || '',
      streetAddress || '',
      city || '',
      state || '',
      zipCode || '',
      advisorId,
      department || '',
      startDate || '',
      active ? 'Yes' : 'No'
    ];

    // Read existing Excel file
    let workbook;
    if (fs.existsSync(excelFilePath)) {
      workbook = XLSX.readFile(excelFilePath);
    } else {
      initializeExcelFile();
      workbook = XLSX.readFile(excelFilePath);
    }

    const worksheet = workbook.Sheets['Advisor Data'];
    
    // Convert worksheet to array of arrays
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Add new row
    data.push(newRow);
    
    // Create new worksheet with updated data
    const newWorksheet = XLSX.utils.aoa_to_sheet(data);
    workbook.Sheets['Advisor Data'] = newWorksheet;
    
    // Write to file
    XLSX.writeFile(workbook, excelFilePath);

    console.log(`New advisor data saved: ${firstName} ${lastName} (${advisorId})`);
    
    res.status(200).json({ 
      message: 'Advisor data saved successfully',
      submissionDate,
      advisorId 
    });

  } catch (error) {
    console.error('Error saving advisor data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Get all advisor data (optional endpoint for viewing)
app.get('/api/advisors', (req, res) => {
  try {
    if (!fs.existsSync(excelFilePath)) {
      return res.status(200).json({ data: [] });
    }

    const workbook = XLSX.readFile(excelFilePath);
    const worksheet = workbook.Sheets['Advisor Data'];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error reading advisor data:', error);
    res.status(500).json({ error: 'Error reading data' });
  }
});

// Initialize Excel file on server start
initializeExcelFile();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Excel file will be saved to: ${excelFilePath}`);
});