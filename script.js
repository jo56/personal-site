document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav a');
    const sections = document.querySelectorAll('.section');

    // Section navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });

            navLinks.forEach(navLink => {
                navLink.style.opacity = '0.5';
            });
            link.style.opacity = '1';
        });
    });

    // Email popup functionality
    const emailButtons = document.querySelectorAll('.email-icon');

    // Create popup and overlay elements
    const overlay = document.createElement('div');
    overlay.className = 'email-popup-overlay';
    document.body.appendChild(overlay);

    const popup = document.createElement('div');
    popup.className = 'email-popup';
    popup.textContent = 'contact me at johnofarrell12@gmail.com';
    document.body.appendChild(popup);

    // Show popup on click
    emailButtons.forEach(button => {
        button.addEventListener('click', () => {
            overlay.classList.add('show');
            popup.classList.add('show');
        });
    });

    // Hide popup when clicking overlay
    overlay.addEventListener('click', () => {
        overlay.classList.remove('show');
        popup.classList.remove('show');
    });
});
