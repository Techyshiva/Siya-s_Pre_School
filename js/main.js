/* ==========================================================================
   Siya's Pre-school — Site JS
   Handles: nav active state, navbar shadow on scroll,
   smooth interactions, simple form validation feedback.
   ========================================================================== */

(function () {
  'use strict';

  // --- Highlight active nav link based on current page ---
  const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.navbar-custom .nav-link').forEach(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Add shadow / shrink nav on scroll ---
  const nav = document.querySelector('.navbar-custom');
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Bootstrap form validation feedback ---
  document.querySelectorAll('form.needs-validation').forEach(form => {
    form.addEventListener('submit', e => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    });
  });

  // --- Update copyright year ---
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();
