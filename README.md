# Wedding RSVP Website

A beautiful, mobile-optimized RSVP website for your wedding that saves responses to Google Sheets.

## 🌟 Features

- **Mobile-First Design**: Optimized for all screen sizes with elegant wedding-appropriate styling
- **Real-time Validation**: Form validation with helpful error messages
- **Google Sheets Integration**: Automatic saving of RSVP responses
- **Confirmation Emails**: Optional automated email confirmations for guests
- **Responsive Design**: Works perfectly on phones, tablets, and desktops

## 📁 Files

- `index.html` - Main RSVP form page
- `script.js` - Frontend JavaScript for form handling
- `google-apps-script.js` - Backend code for Google Apps Script
- `README.md` - This documentation file

## 🚀 Setup Instructions

### Step 1: Customize the HTML

1. Open `index.html` and replace the placeholder text:
   - `[Bride] & [Groom]` - Replace with your names
   - `[Wedding Date]` - Replace with your wedding date
   - `[Wedding Venue, City]` - Replace with your venue information
   - `[your-email@example.com]` - Replace with your contact email

### Step 2: Set Up Google Sheets Backend

#### Create a Google Sheet:
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it something like "Wedding RSVP Responses"
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example URL: `https://docs.google.com/spreadsheets/d/1ABC123xyz.../edit`
   - Sheet ID: `1ABC123xyz...`

#### Set Up Google Apps Script:
1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code and paste the contents of `google-apps-script.js`
4. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
5. Customize the bride and groom names in the email template (search for `[Bride] & [Groom]`)
6. Save the project with a name like "Wedding RSVP Backend"

#### Deploy the Web App:
1. In Apps Script, click "Deploy" → "New deployment"
2. Click the gear icon next to "Type" and select "Web app"
3. Set the following:
   - **Description**: "Wedding RSVP API"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click "Deploy"
5. Copy the web app URL (it will look like: `https://script.google.com/macros/s/ABC123.../exec`)
6. Click "Done"

#### Initialize the Google Sheet:
1. In Apps Script, click "Run" next to the `initializeSheet` function
2. Grant the necessary permissions when prompted
3. Check your Google Sheet - it should now have proper headers

#### Test the Setup:
1. In Apps Script, click "Run" next to the `testScript` function
2. Check your Google Sheet for a test entry
3. If successful, delete the test entry

### Step 3: Connect Frontend to Backend

1. Open `script.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL` with the web app URL you copied earlier
3. Save the file

### Step 4: Host Your Website

#### Option 1: GitHub Pages (Recommended)
1. Create a new GitHub repository
2. Upload your files (`index.html`, `script.js`, `README.md`)
3. Go to repository Settings → Pages
4. Select "Deploy from a branch" and choose "main"
5. Your site will be available at `https://yourusername.github.io/repository-name`

#### Option 2: Netlify
1. Go to [Netlify](https://netlify.com)
2. Drag and drop your project folder onto the deploy area
3. Your site will be live instantly with a random URL
4. You can customize the URL in site settings

#### Option 3: Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository or upload files
3. Deploy with one click

### Step 5: Test Everything

1. Open your hosted website
2. Fill out the RSVP form with test data
3. Check that the data appears in your Google Sheet
4. Verify that confirmation emails are sent (if enabled)

## 🎨 Customization

### Colors and Styling
The website uses a wedding-appropriate color scheme:
- **Wedding Gold**: `#d4af37`
- **Wedding Cream**: `#f8f6f0`
- **Wedding Sage**: `#87a96b`

You can customize these colors in the `tailwind.config` section of `index.html`.

### Fonts
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Email Notifications
To disable email confirmations:
1. In `google-apps-script.js`, comment out or remove the `sendConfirmationEmail(data);` line in the `doPost` function

To customize email content:
1. Edit the email template in the `sendConfirmationEmail` function

## 📊 Managing Responses

Your Google Sheet will automatically populate with:
- **Timestamp**: When the RSVP was submitted
- **Name**: Guest's full name
- **Attendance**: Yes/No
- **Number Attending**: Number of people in their party
- **Email**: Guest's email address
- **Message**: Any message they left

You can sort, filter, and analyze this data directly in Google Sheets.

## 🔒 Security Notes

- The Google Apps Script URL is public but only accepts POST requests with valid data
- Email addresses are validated before saving
- No sensitive information is stored in the frontend code
- All form data is transmitted securely over HTTPS

## 🐛 Troubleshooting

### Form submissions aren't working:
1. Check that you've updated the `SCRIPT_URL` in `script.js`
2. Verify that your Google Apps Script is deployed as a web app
3. Check the browser console for error messages
4. Test the Google Apps Script directly using the `testScript` function

### Google Sheet isn't updating:
1. Verify the Sheet ID is correct in the Apps Script
2. Make sure you've granted the necessary permissions
3. Run the `initializeSheet` function manually
4. Check the Apps Script execution log for errors

### Styling issues on mobile:
1. The website uses Tailwind CSS loaded from CDN
2. Test on actual devices, not just browser dev tools
3. Check that the viewport meta tag is present

## 💡 Additional Features

You can extend this RSVP system with:
- **Dietary restrictions field**
- **Song request field**
- **Photo upload for guest photos**
- **Integration with wedding planning tools**
- **Admin dashboard for managing responses**

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the browser console and Apps Script logs
3. Test each component individually
4. Ensure all placeholder text has been replaced with your actual information

---

**Created with ❤️ for your special day!**