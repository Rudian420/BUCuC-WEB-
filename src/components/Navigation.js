import { $, $$, throttle } from '../utils/helpers.js';

export class Navigation {
  constructor() {
    this.header = $('#mainHeader');
    this.navbar = $('#mainNavbar');
    this.sidebarToggle = $('#sidebarToggle');
    this.sidebar = $('#mobileSidebar');
    this.overlay = $('#mobileSidebarOverlay');
    this.lastScrollY = 0;
    this.isScrolling = false;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.highlightActiveSection();
    this.setupSmoothScrolling();
  }

  bindEvents() {
    // Throttled scroll handler for better performance
    window.addEventListener('scroll', throttle(() => {
      this.handleScroll();
      this.highlightActiveSection();
    }, 16)); // ~60fps

    // Mobile sidebar toggle
    if (this.sidebarToggle) {
      this.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
    }

    // Overlay click to close sidebar
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.closeSidebar());
    }

    // Close sidebar when clicking navigation links
    $$('.sidebar-nav a').forEach(link => {
      link.addEventListener('click', () => this.closeSidebar());
    });

    // Handle escape key to close sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.sidebar?.classList.contains('open')) {
        this.closeSidebar();
      }
    });

    // Handle resize events
    window.addEventListener('resize', throttle(() => {
      if (window.innerWidth > 768 && this.sidebar?.classList.contains('open')) {
        this.closeSidebar();
      }
    }, 100));
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Header hide/show logic
    if (currentScrollY > 50) {
      this.header?.classList.add('scrolled');
      this.navbar?.classList.add('scrolled');
    } else {
      this.header?.classList.remove('scrolled');
      this.navbar?.classList.remove('scrolled');
    }

    // Add scroll direction class for advanced animations
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      document.body.classList.add('scroll-down');
      document.body.classList.remove('scroll-up');
    } else {
      document.body.classList.add('scroll-up');
      document.body.classList.remove('scroll-down');
    }

    this.lastScrollY = currentScrollY;
  }

  highlightActiveSection() {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link[href^=\"#\"]');
    
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    // Update active nav links
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  setupSmoothScrolling() {
    $$('a[href^=\"#\"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = $(`#${targetId}`);
        
        if (targetSection) {
          const headerHeight = this.navbar?.offsetHeight || 80;
          const targetPosition = targetSection.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  toggleSidebar() {
    const isOpen = this.sidebar?.classList.toggle('open');
    this.overlay?.classList.toggle('open', isOpen);
    this.sidebarToggle?.classList.toggle('open', isOpen);
    
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
    
    // Focus management for accessibility
    if (isOpen) {
      this.sidebar?.focus();
    }
  }

  closeSidebar() {
    this.sidebar?.classList.remove('open');
    this.overlay?.classList.remove('open');
    this.sidebarToggle?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Public method to programmatically navigate to a section
  navigateToSection(sectionId) {
    const targetSection = $(`#${sectionId}`);
    if (targetSection) {
      const headerHeight = this.navbar?.offsetHeight || 80;
      const targetPosition = targetSection.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  // Public method to update navigation state
  updateNavigationState() {
    this.highlightActiveSection();
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.navigation = new Navigation();
});
