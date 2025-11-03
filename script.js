document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav a');
    const sections = document.querySelectorAll('.section');

    // Get profile icon
    const profileIcon = document.getElementById('profile-icon');

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

            // Show/hide profile icon based on active section
            if (profileIcon) {
                if (targetId === 'home') {
                    profileIcon.style.display = 'block';
                } else {
                    profileIcon.style.display = 'none';
                }
            }
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

    // README popup functionality
    const readmeOverlay = document.createElement('div');
    readmeOverlay.className = 'readme-popup-overlay';
    document.body.appendChild(readmeOverlay);

    const readmePopup = document.createElement('div');
    readmePopup.className = 'readme-popup';
    document.body.appendChild(readmePopup);

    // Function to fetch and display README
    async function showReadme(repoFullName) {
        // Show popup with loading message
        readmePopup.innerHTML = '<div class="loading">Loading README...</div>';
        readmeOverlay.classList.add('show');
        readmePopup.classList.add('show');

        try {
            // Fetch README from GitHub API
            const response = await fetch(`https://api.github.com/repos/${repoFullName}/readme`, {
                headers: {
                    'Accept': 'application/vnd.github.html+json'
                }
            });

            if (!response.ok) {
                throw new Error('README not found');
            }

            const htmlContent = await response.text();

            // Create a temporary container to parse and clean the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            // Remove anchor link icons (typically found in headings)
            const anchorLinks = tempDiv.querySelectorAll('a.anchor, a[aria-hidden="true"], svg.octicon-link');
            anchorLinks.forEach(link => {
                // Remove the anchor element or its parent if it's just the icon
                if (link.classList.contains('anchor') || link.getAttribute('aria-hidden') === 'true') {
                    link.remove();
                } else if (link.parentElement && link.parentElement.classList.contains('anchor')) {
                    link.parentElement.remove();
                }
            });

            // Also remove any remaining octicon svgs that might be link icons
            const octicons = tempDiv.querySelectorAll('svg.octicon');
            octicons.forEach(icon => icon.remove());

            // Fix relative image URLs to point to GitHub's raw content
            const images = tempDiv.querySelectorAll('img');
            images.forEach(img => {
                const src = img.getAttribute('src');
                // If the src is a relative path (doesn't start with http:// or https://)
                if (src && !src.startsWith('http://') && !src.startsWith('https://')) {
                    // Convert to absolute GitHub URL
                    const newSrc = `https://raw.githubusercontent.com/${repoFullName}/main/${src}`;
                    img.setAttribute('src', newSrc);
                    // Also prevent the browser from trying to load the old relative URL
                    // by removing any srcset attributes that might interfere
                    img.removeAttribute('srcset');
                }
            });

            // Also fix any anchor tags that wrap images
            const imageLinks = tempDiv.querySelectorAll('a[href^="assets/"]');
            imageLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http://') && !href.startsWith('https://')) {
                    link.setAttribute('href', `https://raw.githubusercontent.com/${repoFullName}/main/${href}`);
                }
            });

            // Display the cleaned HTML content
            readmePopup.innerHTML = tempDiv.innerHTML;
        } catch (error) {
            readmePopup.innerHTML = `<p>Unable to load README: ${error.message}</p>`;
        }
    }

    // Add click handlers to project descriptions
    const projectItems = document.querySelectorAll('.project-list li[data-repo]');
    projectItems.forEach(item => {
        const description = item.querySelector('.project-description');
        const repoName = item.getAttribute('data-repo');

        if (description && repoName) {
            description.addEventListener('click', (e) => {
                e.preventDefault();
                showReadme(repoName);
            });
        }
    });

    // Hide README popup when clicking overlay
    readmeOverlay.addEventListener('click', () => {
        readmeOverlay.classList.remove('show');
        readmePopup.classList.remove('show');
    });

    // Image lightbox functionality
    const imageLightboxOverlay = document.createElement('div');
    imageLightboxOverlay.className = 'image-lightbox-overlay';
    document.body.appendChild(imageLightboxOverlay);

    const imageLightbox = document.createElement('div');
    imageLightbox.className = 'image-lightbox';
    const lightboxContainer = document.createElement('div');
    lightboxContainer.className = 'lightbox-container';
    const lightboxImage = document.createElement('img');
    lightboxImage.className = 'lightbox-image';
    lightboxContainer.appendChild(lightboxImage);
    imageLightbox.appendChild(lightboxContainer);
    document.body.appendChild(imageLightbox);

    // Open lightbox when clicking profile icon
    if (profileIcon) {
        profileIcon.addEventListener('click', () => {
            lightboxImage.src = profileIcon.src;
            lightboxImage.style.display = 'block';
            lightboxContainer.querySelector('video')?.remove(); // Remove any existing video
            imageLightboxOverlay.classList.add('show');
            imageLightbox.classList.add('show');
            lightboxImage.classList.remove('zoomed');
        });
        profileIcon.style.cursor = 'pointer';
    }

    // Open lightbox when clicking about video
    const aboutVideo = document.getElementById('about-video');
    if (aboutVideo) {
        aboutVideo.addEventListener('click', () => {
            // Hide the image and create video element
            lightboxImage.style.display = 'none';

            // Remove any existing video
            lightboxContainer.querySelector('video')?.remove();

            // Create new video element for lightbox
            const lightboxVideo = document.createElement('video');
            lightboxVideo.className = 'lightbox-image';
            lightboxVideo.autoplay = true;
            lightboxVideo.loop = true;
            lightboxVideo.muted = true;
            lightboxVideo.playsInline = true;
            lightboxVideo.controls = true; // Add controls in lightbox

            const source = document.createElement('source');
            source.src = 'compressed-recording-1-hq.webm';
            source.type = 'video/webm';
            lightboxVideo.appendChild(source);

            lightboxContainer.appendChild(lightboxVideo);

            imageLightboxOverlay.classList.add('show');
            imageLightbox.classList.add('show');
        });
        aboutVideo.style.cursor = 'pointer';
    }

    // Toggle zoom when clicking the lightbox image
    lightboxImage.addEventListener('click', (e) => {
        e.stopPropagation();

        if (!lightboxImage.classList.contains('zoomed')) {
            // Get image dimensions and position
            const rect = lightboxImage.getBoundingClientRect();
            const imgWidth = rect.width;
            const imgHeight = rect.height;

            // Calculate click position relative to the image
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // Calculate the zoomed dimensions
            const zoomedWidth = imgWidth * 1.75;
            const zoomedHeight = imgHeight * 1.75;

            // Set container size to accommodate zoomed image
            lightboxContainer.style.width = `${zoomedWidth}px`;
            lightboxContainer.style.height = `${zoomedHeight}px`;

            // Calculate scroll position to center clicked point
            const scrollX = (clickX * 1.75) - (imageLightbox.clientWidth / 2);
            const scrollY = (clickY * 1.75) - (imageLightbox.clientHeight / 2);

            lightboxImage.classList.add('zoomed');

            // Scroll to the clicked position
            setTimeout(() => {
                imageLightbox.scrollLeft = scrollX;
                imageLightbox.scrollTop = scrollY;
            }, 10);
        } else {
            // Zoom out - reset
            lightboxContainer.style.width = '';
            lightboxContainer.style.height = '';
            lightboxImage.classList.remove('zoomed');
            imageLightbox.scrollLeft = 0;
            imageLightbox.scrollTop = 0;
        }
    });

    // Helper function to close lightbox
    function closeLightbox() {
        imageLightboxOverlay.classList.remove('show');
        imageLightbox.classList.remove('show');
        lightboxImage.classList.remove('zoomed');
        lightboxContainer.style.width = '';
        lightboxContainer.style.height = '';
        imageLightbox.scrollLeft = 0;
        imageLightbox.scrollTop = 0;
        // Remove any video elements
        lightboxContainer.querySelector('video')?.remove();
        lightboxImage.style.display = 'block';
    }

    // Close lightbox when clicking outside the image
    imageLightbox.addEventListener('click', (e) => {
        if (e.target === imageLightbox || e.target === lightboxContainer) {
            closeLightbox();
        }
    });

    // Close lightbox when clicking overlay
    imageLightboxOverlay.addEventListener('click', () => {
        closeLightbox();
    });
});
