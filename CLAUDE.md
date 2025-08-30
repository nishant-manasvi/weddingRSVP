# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a mobile-optimized wedding RSVP website that collects guest responses and saves them to Google Sheets. The project consists of a static frontend and a Google Apps Script backend.

## Architecture

**Frontend**: Static HTML/CSS/JavaScript website using:
- Tailwind CSS for styling (loaded via CDN)
- Vanilla JavaScript for form handling
- Mobile-first responsive design
- Wedding-themed color palette (gold, cream, sage green)

**Backend**: Google Apps Script web app that:
- Accepts POST requests from the RSVP form
- Validates form data
- Saves responses to Google Sheets
- Sends optional confirmation emails
- Handles CORS for cross-origin requests

**Data Storage**: Google Sheets with columns:
- Timestamp, Name, Attendance, Number Attending, Email, Message

## Key Files

- `index.html`: Main RSVP form page with Tailwind CSS styling
- `script.js`: Frontend form handling and API communication
- `google-apps-script.js`: Backend API code for Google Apps Script
- `README.md`: Complete setup and deployment instructions

## Development Setup

This is a static website - no build process required:

1. **Local Development**: 
   - Open `index.html` in a browser
   - Use Live Server extension for auto-reload during development
   - Test form submission requires deployed Google Apps Script

2. **Customization**:
   - Update placeholder text in `index.html` (bride/groom names, date, venue)
   - Modify colors in Tailwind config section
   - Customize email template in Google Apps Script

## Deployment Process

1. **Backend Setup**:
   - Create Google Sheet for responses
   - Deploy `google-apps-script.js` as web app
   - Update `SHEET_ID` and customize email template
   - Copy web app URL

2. **Frontend Setup**:
   - Update `SCRIPT_URL` in `script.js` with web app URL
   - Customize all placeholder text in `index.html`

3. **Hosting**:
   - Deploy static files to GitHub Pages, Netlify, or Vercel
   - No server-side processing required

## Common Tasks

- **Test form submission**: Use `testScript()` function in Google Apps Script
- **Initialize Google Sheet**: Run `initializeSheet()` function once
- **View responses**: Check Google Sheet directly
- **Update styling**: Modify Tailwind classes in `index.html`
- **Customize form fields**: Update both HTML form and Google Apps Script validation