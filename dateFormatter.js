// Function to convert date from "DD-MM-YYYY" to "DD-MMM-YYYY" format
export function formatDate(dateString) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    // Split the date string into day, month, and year
    const [day, month, year] = dateString.split('-');
  
    // Validate the date
    if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
      return dateString; // Return the original string if it's not a valid date
    }
  
    // Convert month number to month name
    const monthName = months[parseInt(month, 10) - 1];
  
    // Return the formatted date
    return `${day}-${monthName}-${year}`;
  }
  
  // Function to process the data and format dates in columns 10 and 12
  export function formatDatesInData(data) {
    return data.map(row => {
      if (row.length > 10) { // Ensure the row has at least 11 columns (index 10 is column 11)
        row[9] = formatDate(row[9]); // Column 10 (index 9)
      }
      if (row.length > 12) { // Ensure the row has at least 13 columns (index 12 is column 13)
        row[11] = formatDate(row[11]); // Column 12 (index 11)
      }
      return row;
    });
  }