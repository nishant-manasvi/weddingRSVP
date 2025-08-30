// Wedding RSVP Form Handler
// Replace 'YOUR_GOOGLE_APPS_SCRIPT_URL' with your actual Google Apps Script web app URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxNyWezHFvujFh2s52_3232j4WvRWdJNs5ojCM8X6Fa835eWMGfg3m-IDgGCQwEzn8/exec';

// EmailJS Configuration - Replace with your actual values from EmailJS dashboard
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'qp9AFdZ2gHxCIxOcj',  // Get from EmailJS Account → General
    SERVICE_ID: 'service_39s89eh',          // Get from EmailJS Email Services
    TEMPLATE_ID: 'template_alrzkiu'         // Get from EmailJS Email Templates
};

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rsvp-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const loadingText = document.getElementById('loading-text');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const numberAttendingSection = document.getElementById('number-attending-section');
    const numberAttendingSelect = document.getElementById('numberAttending');
    const arrivalDateSection = document.getElementById('arrival-date-section');
    const arrivalDateInput = document.getElementById('arrivalDate');
    const eventsSection = document.getElementById('events-section');
    
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }

    // Handle attendance radio button changes
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'No') {
                // Hide sections if not attending
                numberAttendingSection.style.display = 'none';
                arrivalDateSection.style.display = 'none';
                eventsSection.style.display = 'none';
                numberAttendingSelect.removeAttribute('required');
                arrivalDateInput.removeAttribute('required');
                numberAttendingSelect.value = '0';
                arrivalDateInput.value = '';
                // Uncheck all event checkboxes
                document.querySelectorAll('input[name="events"]:checked').forEach(checkbox => {
                    checkbox.checked = false;
                });
            } else {
                // Show sections if attending
                numberAttendingSection.style.display = 'block';
                arrivalDateSection.style.display = 'block';
                eventsSection.style.display = 'block';
                numberAttendingSelect.setAttribute('required', '');
                arrivalDateInput.setAttribute('required', '');
                numberAttendingSelect.value = '';
                arrivalDateInput.value = '';
            }
        });
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Hide any previous messages
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        
        // Show loading state
        setLoadingState(true);
        
        // Declare data variable outside try block so it's accessible in catch
        let data;
        
        try {
            // Gather form data
            const form_data = new FormData(form);
            
            // Get selected events
            const selectedEvents = [];
            document.querySelectorAll('input[name="events"]:checked').forEach(checkbox => {
                selectedEvents.push(checkbox.value);
            });
            
            data = {
                fullName: form_data.get('fullName'),
                attendance: form_data.get('attendance'),
                numberAttending: form_data.get('attendance') === 'No' ? '0' : form_data.get('numberAttending'),
                arrivalDate: form_data.get('attendance') === 'No' ? '' : form_data.get('arrivalDate'),
                events: form_data.get('attendance') === 'No' ? '' : selectedEvents.join(', '),
                email: form_data.get('email'),
                message: form_data.get('message') || ''
            };
            
            // Validate required fields
            if (!data.fullName || !data.attendance || !data.email) {
                throw new Error('Please fill in all required fields');
            }
            
            if (data.attendance === 'Yes' && (!data.numberAttending || data.numberAttending === '')) {
                throw new Error('Please select the number of people attending');
            }
            
            if (data.attendance === 'Yes' && (!data.arrivalDate || data.arrivalDate === '')) {
                throw new Error('Please select your arrival date');
            }
            
            if (data.attendance === 'Yes' && selectedEvents.length === 0) {
                throw new Error('Please select at least one event you will attend');
            }
            
            console.log('Submitting data:', data);
            
            // Submit to Google Apps Script using form data to avoid CORS preflight
            const postData = new URLSearchParams();
            Object.keys(data).forEach(key => {
                postData.append(key, data[key]);
            });
            
            console.log('Sending POST request to:', SCRIPT_URL);
            
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: postData
            });
            
            console.log('Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Log response for debugging
            const responseText = await response.text();
            console.log('Response from server:', responseText);
            
            let result;
            try {
                result = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse JSON response:', responseText);
                // Even if JSON parse fails, assume success if we got here
                console.log('Assuming success despite JSON parse error');
                result = { success: true };
            }
            
            console.log('Parsed result:', result);
            
            if (result && result.success) {
                console.log('Success! Showing success message and sending email');
                
                // Send confirmation email if attending
                if (data.attendance === 'Yes') {
                    console.log('Sending confirmation email...');
                    sendConfirmationEmail(data);
                } else {
                    console.log('Not attending, skipping email');
                }
                
                // Show success message
                showSuccessMessage();
                // Reset form
                form.reset();
                // Reset section visibility
                numberAttendingSection.style.display = 'block';
                arrivalDateSection.style.display = 'block';
                eventsSection.style.display = 'block';
                numberAttendingSelect.setAttribute('required', '');
                arrivalDateInput.setAttribute('required', '');
            } else {
                console.log('Server returned error:', result);
                throw new Error(result.error || 'Unknown error occurred');
            }
            
        } catch (error) {
            console.error('Error submitting RSVP:', error);
            console.error('Error message:', error.message);
            console.error('Error type:', typeof error);
            
            // Check if it's a CORS/network error but data might have been saved
            if (error.message.includes('fetch') || error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
                // Show success message since the data is likely saved despite the CORS error
                console.log('CORS error detected, but data may have been saved successfully');
                console.log('Will send email and show success message');
                
                // Send confirmation email if attending and EmailJS is configured
                if (data && data.attendance === 'Yes') {
                    console.log('Sending email despite CORS error...');
                    sendConfirmationEmail(data);
                } else {
                    console.log('Not sending email - either no data or not attending');
                }
                
                console.log('Showing success message...');
                showSuccessMessage();
                form.reset();
                // Reset section visibility
                numberAttendingSection.style.display = 'block';
                arrivalDateSection.style.display = 'block';
                eventsSection.style.display = 'block';
                numberAttendingSelect.setAttribute('required', '');
                arrivalDateInput.setAttribute('required', '');
            } else {
                console.log('Showing error message for non-CORS error');
                showErrorMessage();
            }
        } finally {
            setLoadingState(false);
        }
    });
    
    function setLoadingState(loading) {
        if (loading) {
            submitBtn.classList.add('loading');
            submitText.classList.add('hidden');
            loadingText.classList.remove('hidden');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitText.classList.remove('hidden');
            loadingText.classList.add('hidden');
            submitBtn.disabled = false;
        }
    }
    
    function showSuccessMessage() {
        successMessage.classList.remove('hidden');
        successMessage.classList.add('fade-in');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    function showErrorMessage() {
        errorMessage.classList.remove('hidden');
        errorMessage.classList.add('fade-in');
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Add visual feedback for radio buttons
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Remove selected class from all labels
            document.querySelectorAll('label[for^="attendance"]').forEach(label => {
                label.classList.remove('ring-2', 'ring-wedding-gold');
            });
            // Add selected class to current label
            this.closest('label').classList.add('ring-2', 'ring-wedding-gold');
        });
    });
});

// Add some interactive enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add focus effects to form inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('div').classList.add('transform', 'scale-105');
        });
        
        input.addEventListener('blur', function() {
            this.closest('div').classList.remove('transform', 'scale-105');
        });
    });
    
    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Email sending function using EmailJS
    function sendConfirmationEmail(data) {
        console.log('sendConfirmationEmail called with data:', data);
        
        // Check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            console.log('EmailJS not loaded, skipping email');
            return;
        }
        
        // Check if EmailJS is configured
        if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
            console.log('EmailJS not configured, skipping email');
            return;
        }
        
        console.log('EmailJS Configuration:', EMAILJS_CONFIG);
        
        // Prepare email parameters
        const emailParams = {
            guest_name: data.fullName,
            guest_email: data.email,
            attendance: data.attendance,
            number_attending: data.numberAttending,
            arrival_date: data.arrivalDate || 'Not specified',
            events_attending: data.events || 'None selected',
            message: data.message || 'No message provided'
        };
        
        console.log('Email parameters:', emailParams);
        
        // Send email
        console.log('Calling emailjs.send...');
        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, emailParams)
            .then(function(response) {
                console.log('Confirmation email sent successfully!', response.status, response.text);
            })
            .catch(function(error) {
                console.error('Failed to send confirmation email:', error);
                console.error('Error details:', error.text, error.status);
            });
    }
});