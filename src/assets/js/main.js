/**
 * Main JavaScript Entry Point for BUCuC Website
 * Modern ES6+ implementation with enhanced features
 */

import { Navigation } from '../components/Navigation.js';
import { MemberCard, EventCard } from '../components/Cards.js';
import { 
  fetchData, 
  showNotification, 
  validateEmail, 
  validatePhone,
  debounce,
  animateCSS 
} from '../utils/helpers.js';

class BUCuCApp {
  constructor() {
    this.navigation = null;
    this.members = [];
    this.events = [];
    this.currentFilters = {
      department: 'all',
      search: ''
    };
    
    this.init();
  }

  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }

  async onDOMReady() {
    console.log('🚀 BUCuC App initializing...');
    
    try {
      // Initialize core components
      await this.initializeComponents();
      
      // Load data
      await this.loadData();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize animations
      this.initializeAnimations();
      
      // Setup search and filters
      this.setupSearchAndFilters();
      
      // Initialize form handlers
      this.initializeFormHandlers();
      
      console.log('✅ BUCuC App initialized successfully');
      showNotification('Welcome to BUCuC! 🎉', 'success', 3000);
      
    } catch (error) {
      console.error('❌ Error initializing app:', error);
      showNotification('Failed to initialize app. Please refresh the page.', 'danger');
    }
  }

  async initializeComponents() {
    // Initialize navigation
    this.navigation = new Navigation();
    
    // Initialize Swiper for members carousel
    this.initializeSwiper();
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
      });
    }
  }

  async loadData() {
    try {
      // Load members and events data
      const [membersData, eventsData] = await Promise.all([
        fetchData('./data/sb-members.json'),
        fetchData('./data/events.json')
      ]);

      if (membersData) {
        this.members = membersData;
        this.renderMembers(this.members);
      }

      if (eventsData) {
        this.events = eventsData;
        this.renderEvents(this.events);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Failed to load some content. Please try again.', 'warning');
    }
  }

  renderMembers(members) {
    const container = document.querySelector('#members-container');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Create search and filter bar
    this.createMemberFilterBar(container);

    // Create members grid
    const membersGrid = document.createElement('div');
    membersGrid.className = 'row g-4';
    membersGrid.id = 'members-grid';
    
    members.forEach(member => {
      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6';
      new MemberCard(member, col);
      membersGrid.appendChild(col);
    });

    container.appendChild(membersGrid);
  }

  renderEvents(events) {
    const container = document.querySelector('#events-container');
    if (!container) return;

    container.innerHTML = '';

    const eventsGrid = document.createElement('div');
    eventsGrid.className = 'row g-4';
    
    // Sort events by date
    const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedEvents.forEach(event => {
      const col = document.createElement('div');
      col.className = 'col-lg-6 col-md-6';
      new EventCard(event, col);
      eventsGrid.appendChild(col);
    });

    container.appendChild(eventsGrid);
  }

  createMemberFilterBar(container) {
    const filterBar = document.createElement('div');
    filterBar.className = 'search-filter-bar mb-4';
    filterBar.innerHTML = `
      <input 
        type="text" 
        id="member-search" 
        class="search-input" 
        placeholder="Search members by name, position, or skills..."
      >
      <select id="department-filter" class="filter-select">
        <option value="all">All Departments</option>
        <option value="Human Resource">Human Resource</option>
        <option value="Event Management & Logistics">Event Management & Logistics</option>
        <option value="Finance">Finance</option>
        <option value="Creative">Creative</option>
        <option value="Performance - Music">Performance - Music</option>
        <option value="Performance - Dance">Performance - Dance</option>
        <option value="Public Relations">Public Relations</option>
        <option value="Research & Development">Research & Development</option>
      </select>
      <button id="clear-filters" class="btn btn-outline-secondary">Clear Filters</button>
    `;
    container.appendChild(filterBar);
  }

  setupSearchAndFilters() {
    const searchInput = document.querySelector('#member-search');
    const departmentFilter = document.querySelector('#department-filter');
    const clearFiltersBtn = document.querySelector('#clear-filters');

    if (!searchInput || !departmentFilter) return;

    // Debounced search
    const debouncedSearch = debounce((query) => {
      this.currentFilters.search = query.toLowerCase();
      this.filterMembers();
    }, 300);

    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
    });

    departmentFilter.addEventListener('change', (e) => {
      this.currentFilters.department = e.target.value;
      this.filterMembers();
    });

    clearFiltersBtn?.addEventListener('click', () => {
      searchInput.value = '';
      departmentFilter.value = 'all';
      this.currentFilters = { department: 'all', search: '' };
      this.filterMembers();
    });
  }

  filterMembers() {
    const filteredMembers = this.members.filter(member => {
      const matchesDepartment = this.currentFilters.department === 'all' || 
                                member.department === this.currentFilters.department;
      
      const matchesSearch = this.currentFilters.search === '' ||
                           member.name.toLowerCase().includes(this.currentFilters.search) ||
                           member.position.toLowerCase().includes(this.currentFilters.search) ||
                           member.bio.toLowerCase().includes(this.currentFilters.search) ||
                           (member.skills && member.skills.some(skill => 
                             skill.toLowerCase().includes(this.currentFilters.search)
                           ));

      return matchesDepartment && matchesSearch;
    });

    this.renderFilteredMembers(filteredMembers);
  }

  renderFilteredMembers(members) {
    const grid = document.querySelector('#members-grid');
    if (!grid) return;

    // Animate out existing members
    const existingCards = grid.querySelectorAll('.col-lg-4');
    existingCards.forEach(card => {
      animateCSS(card, 'fadeOut', () => card.remove());
    });

    // Small delay then render new members
    setTimeout(() => {
      members.forEach(member => {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6';
        col.style.opacity = '0';
        new MemberCard(member, col);
        grid.appendChild(col);
        
        // Animate in new cards
        setTimeout(() => animateCSS(col, 'fadeIn'), 50);
      });

      // Show no results message if needed
      if (members.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'col-12 text-center py-5';
        noResults.innerHTML = `
          <div class="no-results">
            <i class="fas fa-search fa-3x text-muted mb-3"></i>
            <h4>No members found</h4>
            <p class="text-muted">Try adjusting your search criteria</p>
          </div>
        `;
        grid.appendChild(noResults);
        animateCSS(noResults, 'fadeIn');
      }
    }, 300);
  }

  setupEventListeners() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Back to top button
    this.createBackToTopButton();

    // Theme toggle (if implemented)
    this.setupThemeToggle();

    // Social share buttons
    this.setupSocialShare();
  }

  createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      border: none;
      cursor: pointer;
      opacity: 0;
      transform: translateY(100px);
      transition: all 0.3s ease;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    document.body.appendChild(backToTop);

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.style.opacity = '1';
        backToTop.style.transform = 'translateY(0)';
      } else {
        backToTop.style.opacity = '0';
        backToTop.style.transform = 'translateY(100px)';
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  setupThemeToggle() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.style.cssText = `
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--light-color);
      color: var(--dark-color);
      border: 1px solid var(--medium-gray);
      cursor: pointer;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    `;

    document.body.appendChild(themeToggle);

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      themeToggle.innerHTML = newTheme === 'dark' 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
        
      showNotification(`Switched to ${newTheme} theme`, 'info', 2000);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'dark' 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
  }

  setupSocialShare() {
    document.querySelectorAll('[data-share]').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = button.getAttribute('data-share');
        const url = window.location.href;
        const text = 'Check out BUCuC - BRAC University Cultural Club!';
        
        this.shareOnSocial(platform, url, text);
      });
    });
  }

  shareOnSocial(platform, url, text) {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText} ${encodedUrl}`,
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  }

  initializeSwiper() {
    // Enhanced Swiper configuration
    if (typeof Swiper !== 'undefined') {
      const swiper = new Swiper('.sb-swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        loop: true,
        initialSlide: 0,
        coverflowEffect: {
          rotate: 30,
          stretch: 0,
          depth: 120,
          modifier: 1,
          slideShadows: true,
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: 56,
          },
        }
      });

      // Pause autoplay on hover
      const swiperContainer = document.querySelector('.sb-swiper');
      if (swiperContainer) {
        swiperContainer.addEventListener('mouseenter', () => swiper.autoplay.stop());
        swiperContainer.addEventListener('mouseleave', () => swiper.autoplay.start());
      }
    }
  }

  initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__animated', 'animate__fadeInUp');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.artists-thumb, .event-card, .about-text-wrap').forEach(el => {
      observer.observe(el);
    });
  }

  initializeFormHandlers() {
    // Enhanced form validation
    const signupForm = document.querySelector('#signup-form');
    const loginForm = document.querySelector('#login-form');

    if (signupForm) {
      this.setupFormValidation(signupForm);
    }

    if (loginForm) {
      this.setupFormValidation(loginForm);
    }
  }

  setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        this.submitForm(form);
      } else {
        showNotification('Please fix the errors in the form', 'warning');
      }
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value && !validateEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }

    // Phone validation
    if (field.type === 'tel' && value && !validatePhone(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }

    // Password validation
    if (field.type === 'password' && value && value.length < 6) {
      isValid = false;
      errorMessage = 'Password must be at least 6 characters long';
    }

    this.showFieldError(field, isValid ? null : errorMessage);
    return isValid;
  }

  showFieldError(field, errorMessage) {
    this.clearFieldError(field);
    
    if (errorMessage) {
      field.classList.add('is-invalid');
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'invalid-feedback';
      errorDiv.textContent = errorMessage;
      field.parentNode.appendChild(errorDiv);
    } else {
      field.classList.add('is-valid');
    }
  }

  clearFieldError(field) {
    field.classList.remove('is-invalid', 'is-valid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  async submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    try {
      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification('Form submitted successfully! 🎉', 'success');
      form.reset();
      
      // Clear validation classes
      form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
        field.classList.remove('is-valid', 'is-invalid');
      });
      
    } catch (error) {
      console.error('Form submission error:', error);
      showNotification('Failed to submit form. Please try again.', 'danger');
    } finally {
      // Restore button state
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
}

// Initialize the app
const app = new BUCuCApp();

// Export for global access
window.BUCuCApp = app;
