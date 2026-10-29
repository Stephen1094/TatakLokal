/**
 * TatakLokal - Page Transitions & Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select all links navigating to Browse or between pages
    const navLinks = document.querySelectorAll('a.browse-btn, .nav-links a, a[href*="browse.html"]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');

            // Only transition for regular page navigation
            if (
                targetUrl &&
                !targetUrl.startsWith('#') &&
                !targetUrl.startsWith('javascript') &&
                !e.ctrlKey &&
                !e.metaKey &&
                link.target !== '_blank'
            ) {
                e.preventDefault();

                // Button tactile tap scale animation
                link.style.transform = 'scale(0.92)';

                // Page fade-out & slide transition
                document.body.classList.add('page-leaving');

                // Navigate smoothly after animation completes
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 220);
            }
        });
    });
});

// Handle browser back / forward cache (bfcache) so the page resets smoothly
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        document.body.classList.remove('page-leaving');
    }
});

