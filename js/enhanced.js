// Enhanced JavaScript for BUCuC Website - Phase 1
(function() {
    'use strict';

    // Performance monitoring
    const performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime, 'ms');
            }
            if (entry.entryType === 'first-input') {
                console.log('FID:', entry.processingStart - entry.startTime, 'ms');
            }
        }
    });
    
    if ('PerformanceObserver' in window) {
        performanceObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    }

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Lazy Loading Implementation
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // Accessibility Improvements
    function enhanceAccessibility() {
        // Add skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only sr-only-focusable';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            z-index: 1000;
            color: white;
            background: #e76f2c;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 4px;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content landmark
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.id = 'main-content';
            mainContent.setAttribute('role', 'main');
        }

        // Enhance form accessibility
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (!input.id && input.name) {
                    input.id = input.name;
                }
                if (input.type === 'text' || input.type === 'email' || input.type === 'tel') {
                    input.setAttribute('autocomplete', 'on');
                }
            });
        });

        // Add ARIA labels to interactive elements
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (!button.textContent.trim()) {
                button.setAttribute('aria-label', 'Button');
            }
        });
    }

    // Smooth Scrolling Enhancement
    function enhanceSmoothScrolling() {
        const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
        smoothScrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update URL without page jump
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // Mobile Navigation Enhancement
    function enhanceMobileNavigation() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileSidebar = document.getElementById('mobileSidebar');
        const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');

        if (sidebarToggle && mobileSidebar) {
            function toggleSidebar() {
                const isOpen = mobileSidebar.classList.contains('open');
                
                if (isOpen) {
                    mobileSidebar.classList.remove('open');
                    mobileSidebarOverlay.classList.remove('open');
                    sidebarToggle.classList.remove('open');
                    document.body.style.overflow = '';
                } else {
                    mobileSidebar.classList.add('open');
                    mobileSidebarOverlay.classList.add('open');
                    sidebarToggle.classList.add('open');
                    document.body.style.overflow = 'hidden';
                }
            }

            sidebarToggle.addEventListener('click', toggleSidebar);
            mobileSidebarOverlay.addEventListener('click', toggleSidebar);

            // Close sidebar on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileSidebar.classList.contains('open')) {
                    toggleSidebar();
                }
            });
        }
    }

    // Performance Optimizations
    function optimizePerformance() {
        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                // Handle scroll-based animations
                const scrolledElements = document.querySelectorAll('.scroll-animate');
                scrolledElements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    const elementVisible = 150;
                    
                    if (elementTop < window.innerHeight - elementVisible) {
                        element.classList.add('animate');
                    }
                });
            }, 10);
        });

        // Optimize images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
            if (!img.decoding) {
                img.decoding = 'async';
            }
        });
    }

    // Form Enhancement
    function enhanceForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Add form validation
            form.addEventListener('submit', function(e) {
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;

                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                        
                        // Add error message
                        let errorMsg = field.parentNode.querySelector('.error-message');
                        if (!errorMsg) {
                            errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message text-danger mt-1';
                            errorMsg.textContent = 'This field is required';
                            field.parentNode.appendChild(errorMsg);
                        }
                    } else {
                        field.classList.remove('error');
                        const errorMsg = field.parentNode.querySelector('.error-message');
                        if (errorMsg) {
                            errorMsg.remove();
                        }
                    }
                });

                if (!isValid) {
                    e.preventDefault();
                    // Focus first error field
                    const firstError = form.querySelector('.error');
                    if (firstError) {
                        firstError.focus();
                    }
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    if (this.hasAttribute('required') && !this.value.trim()) {
                        this.classList.add('error');
                    } else {
                        this.classList.remove('error');
                    }
                });
            });
        });
    }

    // Back to Top Button
    function addBackToTopButton() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #e76f2c;
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(231, 111, 44, 0.3);
        `;

        document.body.appendChild(backToTopBtn);

        // Show/hide button based on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });

        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initialize all enhancements when the DOM is ready
    function initialize() {
        enhanceAccessibility();
        enhanceSmoothScrolling();
        enhanceMobileNavigation();
        optimizePerformance();
        enhanceForms();
        addBackToTopButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // You can add error reporting here
    });

})();

// Enhanced JavaScript for BUCuC Website - Mobile Optimizations

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Sidebar Functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
    
    if (sidebarToggle && mobileSidebar && mobileSidebarOverlay) {
        // Toggle sidebar
        sidebarToggle.addEventListener('click', function() {
            mobileSidebar.classList.toggle('open');
            mobileSidebarOverlay.classList.toggle('open');
            sidebarToggle.classList.toggle('active');
            document.body.style.overflow = mobileSidebar.classList.contains('open') ? 'hidden' : '';
        });
        
        // Close sidebar when clicking overlay
        mobileSidebarOverlay.addEventListener('click', function() {
            mobileSidebar.classList.remove('open');
            mobileSidebarOverlay.classList.remove('open');
            sidebarToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close sidebar when clicking a link
        const sidebarLinks = mobileSidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileSidebar.classList.remove('open');
                mobileSidebarOverlay.classList.remove('open');
                sidebarToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Swipe to close sidebar (touch devices)
        let startX = 0;
        let currentX = 0;
        
        mobileSidebar.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        mobileSidebar.addEventListener('touchmove', function(e) {
            currentX = e.touches[0].clientX;
            const diffX = startX - currentX;
            
            if (diffX > 50) { // Swipe left to close
                mobileSidebar.classList.remove('open');
                mobileSidebarOverlay.classList.remove('open');
                sidebarToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Back to Top Button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopBtn);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Enhanced Mobile Navigation
    const mainHeader = document.getElementById('mainHeader');
    const mainNavbar = document.getElementById('mainNavbar');
    
    if (mainHeader && mainNavbar) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Hide/show header on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                mainHeader.classList.add('scrolled');
                mainNavbar.classList.add('scrolled');
            } else {
                // Scrolling up
                mainHeader.classList.remove('scrolled');
                mainNavbar.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // Mobile Form Enhancements
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        // Add floating label effect
        if (control.value) {
            control.classList.add('has-value');
        }
        
        control.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        control.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
        
        control.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
    
    // Mobile Touch Improvements
    const touchElements = document.querySelectorAll('.btn, .nav-link, .sidebar-nav a');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
    
    // Mobile Image Lazy Loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Mobile Performance Optimizations
    let ticking = false;
    
    function updateOnScroll() {
        // Add any scroll-based animations here
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // Mobile Accessibility Improvements
    const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    // Trap focus in mobile sidebar when open
    function trapFocus(element) {
        const focusableContent = element.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    if (mobileSidebar) {
        trapFocus(mobileSidebar);
    }
    
    // Mobile Gesture Support
    let touchStartY = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diffY = touchStartY - touchEndY;
        
        if (Math.abs(diffY) > swipeThreshold) {
            if (diffY > 0) {
                // Swipe up - could trigger back to top
                if (window.pageYOffset > 500) {
                    backToTopBtn.classList.add('show');
                }
            } else {
                // Swipe down - could hide back to top
                if (window.pageYOffset < 300) {
                    backToTopBtn.classList.remove('show');
                }
            }
        }
    }
    
    // Mobile Error Handling
    window.addEventListener('error', function(e) {
        console.error('Mobile error:', e.error);
        // Could add error reporting here
    });
    
    // Mobile Network Status
    window.addEventListener('online', function() {
        console.log('Mobile device is online');
        // Could show online status indicator
    });
    
    window.addEventListener('offline', function() {
        console.log('Mobile device is offline');
        // Could show offline status indicator
    });
    
    // Mobile Battery Status (if supported)
    if ('getBattery' in navigator) {
        navigator.getBattery().then(function(battery) {
            battery.addEventListener('levelchange', function() {
                if (battery.level < 0.2) {
                    // Could show low battery warning
                    console.log('Low battery detected');
                }
            });
        });
    }
    
    // Mobile Device Orientation
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            // Could add orientation-based features
            const alpha = event.alpha;
            const beta = event.beta;
            const gamma = event.gamma;
        });
    }
    
    // Mobile Viewport Height Fix (for mobile browsers with dynamic toolbars)
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Mobile Loading States
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Remove loading spinner if exists
        const spinner = document.querySelector('.spinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    });
    
    // Mobile Form Validation Enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Show error message
                    let errorMsg = field.parentElement.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message text-danger mt-1';
                        errorMsg.textContent = 'This field is required';
                        field.parentElement.appendChild(errorMsg);
                    }
                } else {
                    field.classList.remove('error');
                    const errorMsg = field.parentElement.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                // Scroll to first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
    });
    
    // Mobile Keyboard Handling
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            // Scroll to input on mobile
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });
    
    console.log('Mobile enhancements loaded successfully!');
}); 