/**
 * Wedding RSVP Google Apps Script Backend
 * 
 * This script handles RSVP form submissions and saves them to a Google Sheet.
 * 
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Create a new Google Sheet for your RSVPs
 * 5. Copy the Google Sheet ID from the URL and paste it in SHEET_ID below
 * 6. Set up the sheet headers (see setupSheet function)
 * 7. Deploy as web app (see deployment instructions in README)
 */

// CONFIGURATION - Replace with your Google Sheet ID
const SHEET_ID = '1ueG5iJX4i2RylXby6hlEkHMA2dIlkfI_bEE-_XbuDi0'; // Get this from your Google Sheet URL
const SHEET_NAME = 'RSVP Responses'; // Name of the sheet tab

/**
 * Main function to handle POST requests from the RSVP form
 */
function doPost(e) {
  try {
    // Log the incoming request for debugging
    console.log('doPost called');
    console.log('e.parameter:', e.parameter);
    console.log('e.postData:', e.postData);
    
    // Parse the incoming form data
    const data = e.parameter || {};
    
    console.log('Parsed data:', data);
    
    // Validate required fields
    if (!data.fullName || !data.attendance || !data.email) {
      console.log('Missing required fields:', {
        fullName: data.fullName,
        attendance: data.attendance, 
        email: data.email
      });
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Missing required fields',
          received: data
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
    
    // Validate arrival date for attending guests (temporarily disabled for debugging)
    // if (data.attendance === 'Yes' && !data.arrivalDate) {
    //   return ContentService
    //     .createTextOutput(JSON.stringify({
    //       success: false,
    //       error: 'Arrival date is required for attending guests'
    //     }))
    //     .setMimeType(ContentService.MimeType.JSON);
    // }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Invalid email format'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Save to Google Sheet
    console.log('About to save to sheet...');
    const result = saveToSheet(data);
    console.log('Save result:', result);
    
    if (result.success) {
      console.log('Successfully saved to sheet, returning success response');
      
      return ContentService
        .createTextOutput(JSON.stringify({
          success: true,
          message: 'RSVP saved successfully'
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: result.error
        }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders({
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
    }
    
  } catch (error) {
    console.error('Error in doPost:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Internal server error: ' + error.message,
        stack: error.stack
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'Wedding RSVP API is running!',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}


/**
 * Save RSVP data to Google Sheet
 */
function saveToSheet(data) {
  try {
    console.log('saveToSheet called with data:', data);
    
    // Open the spreadsheet
    console.log('Opening spreadsheet with ID:', SHEET_ID);
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    console.log('Spreadsheet opened successfully');
    
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    console.log('Sheet found:', sheet ? 'yes' : 'no');
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
      setupSheet(sheet);
    }
    
    // Prepare the row data
    const timestamp = new Date();
    const rowData = [
      timestamp.toLocaleString(), // Timestamp
      data.fullName,              // Name
      data.attendance,            // Attendance (Yes/No)
      data.numberAttending || 0,  // Number Attending
      data.arrivalDate || '',     // Arrival Date
      data.events || '',          // Events Attending
      data.email,                 // Email
      data.message || ''          // Message
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Log the submission
    console.log('RSVP saved:', {
      name: data.fullName,
      attendance: data.attendance,
      email: data.email,
      timestamp: timestamp.toISOString()
    });
    
    return { success: true };
    
  } catch (error) {
    console.error('Error saving to sheet:', error);
    return { 
      success: false, 
      error: 'Failed to save data: ' + error.message 
    };
  }
}

/**
 * Set up the Google Sheet with proper headers
 */
function setupSheet(sheet) {
  // Set up headers
  const headers = [
    'Timestamp',
    'Name', 
    'Attendance',
    'Number Attending',
    'Arrival Date',
    'Events Attending',
    'Email',
    'Message'
  ];
  
  // Add headers to the first row
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format the header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#f3f4f6');
  headerRange.setBorder(true, true, true, true, true, true);
  
  // Set column widths for better readability
  sheet.setColumnWidth(1, 150); // Timestamp
  sheet.setColumnWidth(2, 200); // Name
  sheet.setColumnWidth(3, 100); // Attendance
  sheet.setColumnWidth(4, 120); // Number Attending
  sheet.setColumnWidth(5, 120); // Arrival Date
  sheet.setColumnWidth(6, 300); // Events Attending
  sheet.setColumnWidth(7, 250); // Email
  sheet.setColumnWidth(8, 300); // Message
  
  // Freeze the header row
  sheet.setFrozenRows(1);
  
  console.log('Sheet setup completed with headers');
}

/**
 * Send confirmation email to the guest (optional feature)
 * You can customize this or remove it if you don't want to send emails
 */
function sendConfirmationEmail(data) {
  try {
    // Check if data exists and has required properties
    if (!data || !data.attendance || !data.fullName || !data.email) {
      console.log('Skipping email: missing required data');
      return;
    }
    
    // Only send if attending
    if (data.attendance !== 'Yes') {
      return;
    }
    
    const subject = 'RSVP Confirmation - [Bride] & [Groom] Wedding';
    const body = `
Dear ${data.fullName},

Thank you for your RSVP! We're thrilled that you'll be joining us for our special day.

RSVP Details:
- Name: ${data.fullName}
- Attending: ${data.attendance}
- Number of guests: ${data.numberAttending}
- Arrival date: ${data.arrivalDate}
- Events attending: ${data.events || 'None specified'}
- Email: ${data.email}
${data.message ? `- Message: ${data.message}` : ''}

We can't wait to celebrate with you!

With love,
[Bride] & [Groom]

---
If you need to make any changes to your RSVP, please contact us directly at [your-email@example.com]
    `;
    
    // Send the email
    MailApp.sendEmail({
      to: data.email,
      subject: subject,
      body: body
    });
    
    console.log('Confirmation email sent to:', data.email);
    
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw error here - we don't want email issues to break the RSVP
  }
}

/**
 * Test function to verify the script is working
 * Run this function manually to test your setup
 */
function testScript() {
  const testData = {
    fullName: 'Test Guest',
    attendance: 'Yes',
    numberAttending: '2',
    arrivalDate: '2024-06-15',
    events: 'Haldi Function, Reception',
    email: 'test@example.com',
    message: 'This is a test submission'
  };
  
  const result = saveToSheet(testData);
  console.log('Test result:', result);
  
  return result;
}

/**
 * Function to manually setup the sheet (run this once after creating your sheet)
 */
function initializeSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    setupSheet(sheet);
    console.log('Sheet initialized successfully');
    
  } catch (error) {
    console.error('Error initializing sheet:', error);
  }
}