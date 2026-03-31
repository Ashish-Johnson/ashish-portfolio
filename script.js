// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 1. Reveal Elements on Scroll
    const reveals = document.querySelectorAll('.reveal');

    function reveal() {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    // Trigger on load and on scroll
    window.addEventListener('scroll', reveal);
    reveal();

    // 2. Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Highlight active link (optional, for UX)
            navLinks.forEach(l => l.classList.remove('active-link'));
            this.classList.add('active-link');

            const targetId = this.getAttribute('href').substring(1);
            const targetBlock = document.getElementById(targetId);

            if (targetBlock) {
                // Adjust scroll position for fixed navbar
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const offsetPosition = targetBlock.offsetTop - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Navbar Background Effect on Scroll
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(11, 17, 32, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(11, 17, 32, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

});
