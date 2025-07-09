document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links and buttons
    document.querySelectorAll('.main-nav .nav-link, .btn[href^="#"], .logo[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Calculate offset for sticky header
                    const header = document.querySelector('.site-header');
                    const headerHeight = header.offsetHeight;
                    const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // Close mobile nav if open
            const nav = document.querySelector('.main-nav');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('.main-nav');
    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); // Prevent background scroll
    });

    // Custom Scroll Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-slide-left, .reveal-slide-right, .reveal-zoom-in, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust for slightly earlier trigger
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Sticky Header & Active Nav Link on Scroll
    const siteHeader = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const sections = document.querySelectorAll('section');

    const updateHeaderAndNav = () => {
        // Sticky Header
        if (window.scrollY > 50) { // Add 'scrolled' class after scrolling 50px
            siteHeader.classList.add('scrolled');
        } else {
            siteHeader.classList.remove('scrolled');
        }

        // Active Nav Link
        let currentActiveSectionId = 'hero'; // Default to hero if at top

        sections.forEach(section => {
            // Calculate section top, considering header height
            const headerHeight = siteHeader.offsetHeight;
            const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerHeight;
            const sectionBottom = sectionTop + section.offsetHeight;

            // Adjust the threshold to be slightly before the section fully enters the view
            const scrollOffset = window.scrollY + headerHeight + 50; // Add some offset for better active state

            if (scrollOffset >= sectionTop && scrollOffset < sectionBottom) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentActiveSectionId)) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateHeaderAndNav);
    window.addEventListener('resize', updateHeaderAndNav); // Update on resize
    updateHeaderAndNav(); // Initial call on load

    // Modal functionality (Certificates)
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-button');
    const openModalButtons = document.querySelectorAll('.btn[data-modal-id]');

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-id');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.classList.add('no-scroll'); // Prevent scrolling background
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-id');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                document.body.classList.remove('no-scroll'); // Restore scrolling
            }
        });
    });

    // Close modal if clicked outside of modal content or ESC key
    window.addEventListener('click', (event) => {
        modals.forEach(modal => {
            if (event.target === modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        }
    });

    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    const toggleScrollToTopButton = () => {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollToTopBtn.style.display = 'flex'; // Use flex to center icon
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    };

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Contact Form Submission (using Formspree)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.textContent = 'Sending message...';
            formStatus.className = 'form-status-message'; // Reset class

            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formStatus.textContent = 'Message sent successfully! Thank you for reaching out.';
                formStatus.classList.add('success');
                contactForm.reset();
            } else {
                const data = await response.json();
                let errorMessage = 'Oops! There was a problem sending your message.';
                if (data.errors && data.errors.length > 0) {
                    errorMessage = data.errors.map(error => error.message).join(', ');
                }
                formStatus.textContent = errorMessage;
                formStatus.classList.add('error');
            }
        });
    }
});
