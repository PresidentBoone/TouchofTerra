document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for internal links
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // Toggle dark mode
    const toggleDarkMode = document.getElementById('dark-mode-toggle');
    if (toggleDarkMode) {
        toggleDarkMode.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    // Form validation example (for contact and volunteer forms)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('input, textarea');
            let valid = true;
            inputs.forEach(input => {
                if (!input.value) {
                    valid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            if (!valid) {
                e.preventDefault();
                alert('Please fill in all fields.');
            }
        });
    });
});