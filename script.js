// Wedding RSVP Form Handler
// Replace 'YOUR_GOOGLE_APPS_SCRIPT_URL' with your actual Google Apps Script web app URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzI5m2y-f1JnXyPOoGEui723YyagxMwN4xNaAvBaYkMOxdi0c-bDNSxzuUzSuuJWQs/exec';

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
        
        try {
            // Gather form data
            const formData = new FormData(form);
            
            // Get selected events
            const selectedEvents = [];
            document.querySelectorAll('input[name="events"]:checked').forEach(checkbox => {
                selectedEvents.push(checkbox.value);
            });
            
            const data = {
                fullName: formData.get('fullName'),
                attendance: formData.get('attendance'),
                numberAttending: formData.get('attendance') === 'No' ? '0' : formData.get('numberAttending'),
                arrivalDate: formData.get('attendance') === 'No' ? '' : formData.get('arrivalDate'),
                events: formData.get('attendance') === 'No' ? '' : selectedEvents.join(', '),
                email: formData.get('email'),
                message: formData.get('message') || ''
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
            
            // Submit to Google Apps Script
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
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
                throw new Error(result.error || 'Unknown error occurred');
            }
            
        } catch (error) {
            console.error('Error submitting RSVP:', error);
            showErrorMessage();
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
});