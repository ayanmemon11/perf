/**
 * ==============================================================================
 * PERFECT COMPUTER EDUCATION - MAIN INTERACTIVE JAVASCRIPT
 * Public Website Engine with Dynamic Live Backend API Sync
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initInstituteConfig();
  initNavigation();
  initCourses();
  initGallery();
  initTestimonials();
  initCounters();
  initForms();
  initModals();
  initUtilityButtons();
});

/* ==============================================================================
   1. CONFIGURATION HYDRATION (LIVE API WITH FALLBACK)
   ============================================================================== */
async function initInstituteConfig() {
  let config = window.INSTITUTE_CONFIG || {};

  try {
    const res = await fetch('/api/public/settings');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.settings) {
        config = Object.assign(config, data.settings);
      }
    }
  } catch (e) {}

  // Phone numbers
  document.querySelectorAll('[data-config="phone"]').forEach(el => {
    el.textContent = config.phone || '+91 98765 43210';
  });
  document.querySelectorAll('[data-config="phone-link"]').forEach(el => {
    el.setAttribute('href', `tel:${(config.phone || '+919876543210').replace(/[^0-9+]/g, '')}`);
  });

  // Alt phone
  document.querySelectorAll('[data-config="alt-phone"]').forEach(el => {
    el.textContent = config.altPhone || '+91 98765 43211';
  });

  // Email
  document.querySelectorAll('[data-config="email"]').forEach(el => {
    el.textContent = config.email || 'info@perfectcomputereducation.com';
  });
  document.querySelectorAll('[data-config="email-link"]').forEach(el => {
    el.setAttribute('href', `mailto:${config.email || 'info@perfectcomputereducation.com'}`);
  });

  // Address
  document.querySelectorAll('[data-config="address"]').forEach(el => {
    el.textContent = typeof config.address === 'object' ? config.address.fullAddress : config.address;
  });

  // Opening Hours
  document.querySelectorAll('[data-config="opening-weekdays"]').forEach(el => {
    el.textContent = typeof config.openingHours === 'object' ? config.openingHours.weekdays : config.openingHours;
  });

  // WhatsApp Button URLs
  const waNum = config.whatsappNumber || '919876543210';
  const waMsg = config.whatsappDefaultMsg || 'Hello Perfect Computer Education, I would like to know more about your courses.';
  const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waMsg)}`;
  document.querySelectorAll('[data-config="whatsapp-link"]').forEach(el => {
    el.setAttribute('href', waUrl);
  });
}

/* ==============================================================================
   2. NAVIGATION & STICKY HEADER
   ============================================================================== */
function initNavigation() {
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*="#${sectionId}"]`);

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (targetNavLink) targetNavLink.classList.add('active');
      }
    });
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==============================================================================
   3. COURSE CATALOG ENGINE (6 CORE COURSES)
   ============================================================================== */
let publicCoursesList = [];

async function initCourses() {
  const coursesContainer = document.getElementById('courses-container');
  const courseSelects = document.querySelectorAll('.course-select-dropdown');
  if (!coursesContainer) return;

  publicCoursesList = window.COURSES_DATA || [];

  // Attempt live API fetch
  try {
    const res = await fetch('/api/public/courses');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
        publicCoursesList = data.courses;
      }
    }
  } catch (e) {}

  // Populate Dropdowns
  courseSelects.forEach(select => {
    select.innerHTML = '<option value="">-- Choose a Course --</option>';
    publicCoursesList.forEach(course => {
      const opt = document.createElement('option');
      opt.value = course.name || course.title;
      opt.textContent = `${course.name || course.title} (₹${course.fees || 0} - ${course.duration})`;
      select.appendChild(opt);
    });
  });

  // Render Courses Cards
  coursesContainer.innerHTML = publicCoursesList.map((c, idx) => {
    const courseTitle = c.name || c.title;
    const courseId = c.id || courseTitle.toLowerCase().replace(/\s+/g, '-');
    const duration = c.duration || '2-3 Months';
    const fees = c.fees ? `₹${Number(c.fees).toLocaleString()}` : 'Affordable';
    const description = c.shortDesc || c.description || 'Comprehensive practical course.';
    const syllabusList = Array.isArray(c.syllabus) ? c.syllabus : (c.features || []);

    const syllabusPreview = syllabusList.slice(0, 4).map(s => `
      <li class="course-highlight-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${typeof s === 'string' ? s : s.module || 'Practical Module'}</span>
      </li>
    `).join('');

    return `
      <div class="course-card" style="animation: fadeInUp 0.4s ease forwards ${idx * 0.05}s;">
        <span class="course-badge-top">${c.badge || c.category || 'Professional Course'}</span>
        <div class="course-icon-box">
          <img src="images/courses/${courseId}.svg" alt="${courseTitle}" onerror="this.src='images/courses/ccc.svg'" width="68" height="68" loading="lazy" />
        </div>
        <h3 class="course-title">${courseTitle}</h3>
        <div class="course-meta-row">
          <span class="course-meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${duration}
          </span>
          <span class="course-meta-item" style="color: #059669; background: #ECFDF5; font-weight: 800;">
            💵 ${fees}
          </span>
        </div>
        <p class="course-desc">${description}</p>
        <div class="course-highlights-title">Key Syllabus Overview:</div>
        <ul class="course-highlights-list">
          ${syllabusPreview}
        </ul>
        <div class="course-actions-wrap">
          <button type="button" class="btn btn-outline btn-sm" onclick="openPublicCourseModal('${courseId}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            View Details
          </button>
          <button type="button" class="btn btn-primary btn-sm" onclick="openEnquiryModal('${courseTitle}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Enquire Now
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openPublicCourseModal(courseId) {
  const course = publicCoursesList.find(c => (c.id === courseId || (c.name && c.name.toLowerCase().replace(/\s+/g, '-') === courseId)));
  if (!course) return;

  const modal = document.getElementById('course-detail-modal');
  const courseTitle = course.name || course.title;
  document.getElementById('modal-course-title').textContent = courseTitle;
  document.getElementById('modal-course-category').textContent = `${course.category || 'Practical Course'} • Duration: ${course.duration}`;
  document.getElementById('modal-course-icon').innerHTML = `<img src="images/courses/${course.id || 'ccc'}.svg" alt="${courseTitle}" onerror="this.src='images/courses/ccc.svg'" width="36" height="36" />`;
  document.getElementById('modal-course-desc').textContent = course.shortDesc || course.description;
  document.getElementById('modal-course-dur').textContent = course.duration;
  document.getElementById('modal-course-fee').textContent = course.fees ? `₹${Number(course.fees).toLocaleString()}` : 'Contact Office';

  const syllabusBox = document.getElementById('modal-course-syllabus');
  const syllabusList = Array.isArray(course.syllabus) ? course.syllabus : (course.fullSyllabus || []);

  syllabusBox.innerHTML = `
    <ul class="syllabus-topics-list" style="background: #F8FAFC; padding: 18px 24px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
      ${syllabusList.map(item => `
        <li style="margin-bottom: 6px;">${typeof item === 'string' ? item : (item.module + ': ' + (item.topics ? item.topics.join(', ') : ''))}</li>
      `).join('')}
    </ul>
  `;

  document.getElementById('modal-enquire-action-btn').onclick = () => {
    closeModal(modal);
    openEnquiryModal(courseTitle);
  };

  const waBtn = document.getElementById('modal-whatsapp-action-btn');
  if (waBtn) {
    const waText = `Hello Perfect Computer Education, I want to enquire about the "${courseTitle}" course. Please share admission details.`;
    waBtn.href = `https://wa.me/919876543210?text=${encodeURIComponent(waText)}`;
  }

  openModal(modal);
}

/* ==============================================================================
   4. GALLERY & LIGHTBOX
   ============================================================================== */
let currentGalleryIdx = 0;

function initGallery() {
  const container = document.getElementById('gallery-container');
  const galleryItems = window.GALLERY_DATA || [];
  if (!container) return;

  container.innerHTML = galleryItems.map((item, idx) => `
    <div class="gallery-card" onclick="openLightbox(${idx})">
      <img src="${item.image}" alt="${item.title}" class="gallery-img" loading="lazy" />
      <div class="gallery-overlay">
        <span class="gallery-cat-pill">${item.categoryLabel || 'Institute'}</span>
        <h4 class="gallery-title">${item.title}</h4>
      </div>
    </div>
  `).join('');

  // Lightbox controls
  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) {
    document.getElementById('lightbox-close-btn').onclick = closeLightbox;
    document.getElementById('lightbox-prev-btn').onclick = (e) => { e.stopPropagation(); navigateLightbox(-1); };
    document.getElementById('lightbox-next-btn').onclick = (e) => { e.stopPropagation(); navigateLightbox(1); };
    lightbox.onclick = (e) => { if (e.target === lightbox) closeLightbox(); };
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }
}

function openLightbox(idx) {
  const galleryItems = window.GALLERY_DATA || [];
  if (idx < 0 || idx >= galleryItems.length) return;
  currentGalleryIdx = idx;

  const item = galleryItems[idx];
  const lightbox = document.getElementById('gallery-lightbox');
  document.getElementById('lightbox-img').src = item.image;
  document.getElementById('lightbox-title').textContent = item.title;
  document.getElementById('lightbox-desc').textContent = item.description;

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function navigateLightbox(dir) {
  const galleryItems = window.GALLERY_DATA || [];
  currentGalleryIdx = (currentGalleryIdx + dir + galleryItems.length) % galleryItems.length;
  openLightbox(currentGalleryIdx);
}

function closeLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

/* ==============================================================================
   5. TESTIMONIALS & STATS
   ============================================================================== */
function initTestimonials() {
  const container = document.getElementById('testimonials-container');
  const testimonials = window.TESTIMONIALS_DATA || [];
  if (!container) return;

  container.innerHTML = testimonials.map(t => `
    <div class="testimonial-card">
      <div class="testimonial-rating-row">
        <div class="star-rating">${'★'.repeat(t.rating)}</div>
        <span class="verified-pill">✓ Verified Student</span>
      </div>
      <p class="testimonial-text">"${t.review}"</p>
      <div class="testimonial-author-wrap">
        <img src="${t.avatar}" alt="${t.name}" class="testimonial-avatar" width="48" height="48" loading="lazy" />
        <div>
          <h4 class="testimonial-name">${t.name}</h4>
          <span class="testimonial-course">${t.course}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
          const duration = 1500;
          const start = performance.now();

          function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const val = Math.floor((1 - Math.pow(1 - progress, 3)) * target);
            counter.textContent = val;
            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = target;
          }
          requestAnimationFrame(update);
        });
      }
    });
  }, { threshold: 0.3 });

  const section = document.querySelector('.stats-section');
  if (section) observer.observe(section);
}

/* ==============================================================================
   6. FORMS & VALIDATION
   ============================================================================== */
function initForms() {
  const contactForm = document.getElementById('institute-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="fullName"]').value.trim();
      const phone = contactForm.querySelector('[name="mobileNumber"]').value.trim();
      const course = contactForm.querySelector('[name="selectCourse"]').value;

      if (!name || phone.length < 10 || !course) {
        showToast('Required Fields', 'Please complete all required fields with a valid 10-digit mobile number.', 'error');
        return;
      }

      showToast('Enquiry Received!', 'Thank you! Our admission counselor will contact you shortly.', 'success');
      contactForm.reset();
    });
  }

  const quickForm = document.getElementById('quick-enquiry-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = quickForm.querySelector('[name="fullName"]').value.trim();
      const phone = quickForm.querySelector('[name="mobileNumber"]').value.trim();
      const course = quickForm.querySelector('[name="selectCourse"]').value;

      if (!name || phone.length < 10 || !course) {
        showToast('Required Fields', 'Please enter your name, mobile, and course.', 'error');
        return;
      }

      showToast('Enquiry Submitted!', 'We have received your admission request.', 'success');
      quickForm.reset();
      const modal = document.getElementById('quick-enquiry-modal');
      if (modal) closeModal(modal);
    });
  }
}

/* ==============================================================================
   7. MODALS & UTILITY BUTTONS
   ============================================================================== */
function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.onclick = () => closeModal(modal);
    });
    modal.onclick = (e) => {
      if (e.target === modal) closeModal(modal);
    };
  });

  document.querySelectorAll('[data-open-enquiry]').forEach(btn => {
    btn.onclick = () => openEnquiryModal();
  });
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function openEnquiryModal(selectedCourse = '') {
  const modal = document.getElementById('quick-enquiry-modal');
  if (!modal) return;
  const select = modal.querySelector('select[name="selectCourse"]');
  if (select && selectedCourse) {
    select.value = selectedCourse;
  }
  openModal(modal);
}

function initUtilityButtons() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) backToTopBtn.classList.add('show');
      else backToTopBtn.classList.remove('show');
    });
    backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function showToast(title, message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${type === 'success' ? '✓' : '⚠️'}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 20);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}
