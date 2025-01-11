import { formatDatesInData } from './dateFormatter.js'; // Import the function

let allData = []; // Store all data for filtering
let nationalityMapping = {}; // Store nationality code to description mapping

// Load the JSON file
async function loadNationalityMapping() {
  try {
    const response = await fetch('./nationality_mapping.json');
    nationalityMapping = await response.json();
  } catch (error) {
    console.error('Error loading nationality mapping:', error);
  }
}

// Function to map nationality code to description
function mapNationality(code) {
  return nationalityMapping[code] || code; // Return description if found, else return the code
}

// Function to display the data in a table
function displayTable(data) {
  const tableHeader = document.getElementById('tableHeader');
  const tableBody = document.getElementById('tableBody');

  // Clear existing table content
  tableHeader.innerHTML = '';
  tableBody.innerHTML = '';

  // Define column names
  const columnNames = [
    "Reg Number",
    "Reservation Status",
    "Confirmation Number",
    "Guest Name",
    "Category",
    "Date of Birth",
    "Identification",
    "Nationality",
    "Booking Method",
    "Arrival Date",
    "Arrival Time",
    "Departure Date",
    "Departure Time",
    "Travel Agents",
    "Rate Code Info"
  ];

  // Create table header
  if (data.length > 0) {
    const headerRow = document.createElement('tr');
    columnNames.forEach((name) => {
      const th = document.createElement('th');
      th.textContent = name;
      headerRow.appendChild(th);
    });
    tableHeader.appendChild(headerRow);
  }

  // Create table rows
  data.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach((cell, index) => {
      const td = document.createElement('td');
      // Map column 7 (index 6) to nationality description
      if (index === 7) {
        td.textContent = mapNationality(cell);
      } else {
        td.textContent = cell;
      }
      if (!cell) {
        td.style.backgroundColor = '#ffebee'; // Highlight empty cells
      }
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);
  });

  // Update row count
  document.getElementById('rowCount').textContent = `Total Rows: ${data.length}`;
}

// Function to handle file upload
function handleFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    const rows = content.trim().split('\n'); // Split the file content by new lines
    allData = rows.map(row => row.split(';')); // Split each row by the delimiter `;`

    // Format dates in columns 10 and 12
    allData = formatDatesInData(allData);

    // Display the table
    displayTable(allData);
  };
  reader.onerror = () => {
    alert("Error reading file. Please ensure the file is a valid text file.");
  };
  reader.readAsText(file);
}

// Event listeners for file input
document.getElementById('fileInput').addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

// Event listeners for drag and drop
const dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  if (e.dataTransfer.files.length > 0) {
    handleFile(e.dataTransfer.files[0]);
  }
});

// Search functionality
document.getElementById('searchButton').addEventListener('click', () => {
  const searchTerm = document.getElementById('searchBar').value.toLowerCase();
  if (searchTerm) {
    const filteredData = allData.filter(row => 
      row.some(cell => cell.toLowerCase().includes(searchTerm))
    );
    displayTable(filteredData);
  } else {
    displayTable(allData); // If search term is empty, show all data
  }
});

// Generate registration numbers for existing rows
document.getElementById('generateRegButton').addEventListener('click', () => {
  const startNumber = document.getElementById('regNumbersInput').value.trim();
  if (startNumber && !isNaN(startNumber)) {
    const start = parseInt(startNumber, 10); // Convert input to a number
    allData.forEach((row, index) => {
      row[0] = start + index; // Fill column 0 with sequential numbers
    });
    displayTable(allData); // Refresh the table
  } else {
    alert("Please enter a valid starting registration number (e.g., 201).");
  }
});

// Export to CSV
document.getElementById('exportCsvButton').addEventListener('click', () => {
  const csvContent = allData.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// Load nationality mapping when the page loads
loadNationalityMapping();