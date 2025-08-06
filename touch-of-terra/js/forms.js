document.addEventListener('DOMContentLoaded', function() {
    const donateForm = document.getElementById('donate-form');
    const contactForm = document.getElementById('contact-form');
    const volunteerForm = document.getElementById('volunteer-form');

    if (donateForm) {
        donateForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = donateForm.elements['name'].value;
            const email = donateForm.elements['email'].value;
            const amount = donateForm.elements['amount'].value;
            const donationType = donateForm.elements['donation-type'].value;

            if (validateDonationForm(name, email, amount)) {
                // Process the donation (e.g., call to payment API)
                alert('Thank you for your donation!');
                donateForm.reset();
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const fullName = contactForm.elements['full-name'].value;
            const email = contactForm.elements['email'].value;
            const message = contactForm.elements['message'].value;

            if (validateContactForm(fullName, email, message)) {
                // Process the contact form (e.g., send email)
                alert('Your message has been sent!');
                contactForm.reset();
            }
        });
    }

    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const name = volunteerForm.elements['name'].value;
            const email = volunteerForm.elements['email'].value;
            const phone = volunteerForm.elements['phone'].value;
            const availability = volunteerForm.elements['availability'].value;

            if (validateVolunteerForm(name, email, phone, availability)) {
                // Process the volunteer form (e.g., send email)
                alert('Thank you for your interest in volunteering!');
                volunteerForm.reset();
            }
        });
    }

    function validateDonationForm(name, email, amount) {
        // Basic validation logic
        if (!name || !email || !amount) {
            alert('Please fill in all fields.');
            return false;
        }
        return true;
    }

    function validateContactForm(fullName, email, message) {
        // Basic validation logic
        if (!fullName || !email || !message) {
            alert('Please fill in all fields.');
            return false;
        }
        return true;
    }

    function validateVolunteerForm(name, email, phone, availability) {
        // Basic validation logic
        if (!name || !email || !phone || !availability) {
            alert('Please fill in all fields.');
            return false;
        }
        return true;
    }
});