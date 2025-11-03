// Enhanced Mobile-Optimized JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (!darkModeToggle) {
        console.error('Dark mode toggle button not found');
        return;
    }

    const toggleIcon = darkModeToggle.querySelector('i');
    const toggleText = darkModeToggle.querySelector('span');

    // Check for saved theme or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        enableDarkMode();
    }

    darkModeToggle.addEventListener('click', function () {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    function enableDarkMode() {
        document.body.classList.add('dark-mode');
        if (toggleIcon) toggleIcon.className = 'fas fa-sun';
        if (toggleText) toggleText.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    }

    function disableDarkMode() {
        document.body.classList.remove('dark-mode');
        if (toggleIcon) toggleIcon.className = 'fas fa-moon';
        if (toggleText) toggleText.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }

    // Mobile Navigation Functionality
    initMobileNavigation();

    // Resources Page Tab Functionality
    initResourcesTabs();

    // Active Navigation State
    setActiveNavigation();

    // System Theme Listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });
});

function initMobileNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const resourcesBtn = document.querySelector('.resources-btn');
    const dropdown = document.querySelector('.dropdown-content');

    // Create mobile menu button if it doesn't exist
    if (!mobileMenuBtn && window.innerWidth <= 768) {
        const newMobileBtn = document.createElement('button');
        newMobileBtn.className = 'mobile-menu-btn';
        newMobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.querySelector('.nav-container').appendChild(newMobileBtn);

        newMobileBtn.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    // Enhanced dropdown functionality for mobile
    if (resourcesBtn && dropdown) {
        const resourcesDropdown = resourcesBtn.closest('.resources-dropdown');

        resourcesBtn.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');

                // Close other dropdowns if open
                document.querySelectorAll('.dropdown-content.active').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                if (resourcesDropdown && !resourcesDropdown.contains(e.target)) {
                    dropdown.classList.remove('active');
                }
                if (navLinks && !e.target.closest('.nav-container')) {
                    navLinks.classList.remove('active');
                }
            }
        });

        // Close dropdown after link selection
        dropdown.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                setTimeout(() => {
                    dropdown.classList.remove('active');
                    if (navLinks) navLinks.classList.remove('active');
                }, 300);
            }
        });
    }

    // Handle window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            if (navLinks) navLinks.classList.remove('active');
            if (dropdown) dropdown.classList.remove('active');
        }
    });
}

function initResourcesTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const resourceSections = document.querySelectorAll('.resource-section');

    if (tabLinks.length === 0) return;

    // Check URL hash on page load
    const hash = window.location.hash;
    if (hash) {
        switchTab(hash.substring(1));
    }

    tabLinks.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            switchTab(target);
            history.pushState(null, null, `#${target}`);

            // Close mobile menu if open
            const navLinks = document.querySelector('.nav-links');
            if (navLinks && window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }
        });
    });

    function switchTab(target) {
        // Update active tab
        tabLinks.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('href') === `#${target}`) {
                tab.classList.add('active');
            }
        });

        // Show active section
        resourceSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === target) {
                section.classList.add('active');

                // Scroll to section on mobile
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        });
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', function () {
        const hash = window.location.hash.substring(1);
        if (hash) {
            switchTab(hash);
        }
    });
}

function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage ||
            (currentPage === 'index.html' && (linkPage === 'index.html' || linkPage === '/')) ||
            (currentPage === 'resources.html' && linkPage.includes('resources.html'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Handle resources dropdown active state
    const resourcesDropdown = document.querySelector('.resources-dropdown');
    if (resourcesDropdown && currentPage === 'resources.html') {
        const resourcesBtn = resourcesDropdown.querySelector('.resources-btn');
        if (resourcesBtn) {
            resourcesBtn.classList.add('active');
        }
    }
}

// Add touch event improvements for mobile
document.addEventListener('touchstart', function () { }, { passive: true });

// Prevent zoom on double-tap (iOS)
document.addEventListener('touchend', function (e) {
    if (e.touches && e.touches.length < 2) {
        return;
    }
    e.preventDefault();
}, { passive: false });
