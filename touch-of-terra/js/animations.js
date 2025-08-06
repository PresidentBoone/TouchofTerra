document.addEventListener('DOMContentLoaded', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');
    const scrollElements = document.querySelectorAll('.scroll');

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, options);

    fadeInElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-animate');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, options);

    scrollElements.forEach(element => {
        scrollObserver.observe(element);
    });
});