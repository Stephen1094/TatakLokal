/**
 * TatakLokal - Browse Page Interactive Logic & Transitions
 */

document.addEventListener('DOMContentLoaded', () => {
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    const deliveryInput = document.getElementById('deliveryOnly');
    const barangaySelect = document.getElementById('barangaySelect');
    const cards = Array.from(document.querySelectorAll('.business-card'));
    const resultsCount = document.querySelector('.results-count');
    const clearBtn = document.getElementById('clearFilters');
    const searchInput = document.getElementById('searchInput');

    let activeCategory = null;

    function applyFilters() {
        const deliveryOnly = deliveryInput ? deliveryInput.checked : false;
        const selectedBarangay = barangaySelect ? barangaySelect.value : '';
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

        let visibleCount = 0;

        cards.forEach((card) => {
            const cardCat = card.dataset.category;
            const cardBarangay = card.dataset.barangay;
            const cardDelivery = card.dataset.delivery === 'true';
            const cardText = card.textContent.toLowerCase();

            const matchesCategory = !activeCategory || cardCat === activeCategory;
            const matchesDelivery = !deliveryOnly || cardDelivery;
            const matchesBarangay = !selectedBarangay || cardBarangay === selectedBarangay;
            const matchesSearch = !searchTerm || cardText.includes(searchTerm);

            if (matchesCategory && matchesDelivery && matchesBarangay && matchesSearch) {
                card.classList.remove('hidden');
                card.classList.remove('animating');
                void card.offsetWidth; // Force CSS reflow to re-trigger smooth animation
                card.style.animationDelay = `${(visibleCount % 6) * 50}ms`;
                card.classList.add('animating');
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.classList.remove('animating');
            }
        });

        // Smooth pulse animation on the places counter
        if (resultsCount) {
            resultsCount.textContent = `${visibleCount} ${visibleCount === 1 ? 'place' : 'places'} found`;
            resultsCount.classList.remove('pulse');
            void resultsCount.offsetWidth;
            resultsCount.classList.add('pulse');
        }
    }

    // Category tap one by one
    categoryInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked) {
                // Focus on selected category
                categoryInputs.forEach(other => {
                    if (other !== input) other.checked = false;
                });
                activeCategory = input.value;
            } else {
                activeCategory = null;
            }
            applyFilters();
        });
    });

    // Delivery filter toggle
    if (deliveryInput) {
        deliveryInput.addEventListener('change', applyFilters);
    }

    // Barangay filter dropdown
    if (barangaySelect) {
        barangaySelect.addEventListener('change', applyFilters);
    }

    // Live search
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    // Clear all filters
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            categoryInputs.forEach(input => input.checked = false);
            if (deliveryInput) deliveryInput.checked = false;
            if (barangaySelect) barangaySelect.value = '';
            if (searchInput) searchInput.value = '';
            activeCategory = null;
            applyFilters();
        });
    }

    // Auto-select category if passed in URL (e.g. ?cat=food or ?category=food)
    const urlParams = new URLSearchParams(window.location.search);
    let catParam = urlParams.get('cat') || urlParams.get('category');
    if (catParam) {
        if (catParam === 'wellness') catParam = 'health';
        const targetInput = document.querySelector(`input[name="category"][value="${catParam}"]`);
        if (targetInput) {
            targetInput.checked = true;
            activeCategory = catParam;
        }
    }
    applyFilters();

    // Smooth page transitions for navigation links
    const navLinks = document.querySelectorAll('.nav-links a, .nav-actions a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetUrl = link.getAttribute('href');
            if (
                targetUrl &&
                !targetUrl.startsWith('#') &&
                !targetUrl.startsWith('javascript') &&
                !e.ctrlKey &&
                !e.metaKey &&
                link.target !== '_blank'
            ) {
                e.preventDefault();
                link.style.transform = 'scale(0.92)';
                document.body.classList.add('page-leaving');
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 220);
            }
        });
    });
});

// Handle browser back / forward cache (bfcache)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        document.body.classList.remove('page-leaving');
    }
});
