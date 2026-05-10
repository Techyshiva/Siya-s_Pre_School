/* ==========================================================================
   Siya's Pre-school — interactions.js
   All new interactive behaviour. Vanilla JS only.
   ========================================================================== */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ══════════════════════════════════════════════════════════════════════
     10. Announcement bar — scrolling ticker
  ══════════════════════════════════════════════════════════════════════ */
  (function initTicker() {
    const bar = document.querySelector('.announcement');
    if (!bar) return;
    const original = bar.innerHTML;
    // Duplicate content for seamless loop
    const inner = document.createElement('span');
    inner.className = 'announcement-inner';
    inner.innerHTML = original + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + original;
    bar.innerHTML = '';
    bar.appendChild(inner);
  })();

  /* ══════════════════════════════════════════════════════════════════════
     7. Hero floating SVG shapes
  ══════════════════════════════════════════════════════════════════════ */
  (function initHeroShapes() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const shapes = [
      // star
      `<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><polygon points="18,2 22,13 34,13 24,20 28,32 18,25 8,32 12,20 2,13 14,13" fill="#f5b301"/></svg>`,
      // circle
      `<svg width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="14" fill="#0e2148"/></svg>`,
      // A letter
      `<svg width="34" height="34" viewBox="0 0 34 34"><text x="4" y="27" font-family="Fredoka,sans-serif" font-size="26" font-weight="700" fill="#f5b301">A</text></svg>`,
      // B letter
      `<svg width="34" height="34" viewBox="0 0 34 34"><text x="4" y="27" font-family="Fredoka,sans-serif" font-size="26" font-weight="700" fill="#0e2148">B</text></svg>`,
      // crayon / pencil
      `<svg width="28" height="38" viewBox="0 0 28 38" fill="none"><rect x="6" y="3" width="16" height="24" rx="3" fill="#f5b301"/><polygon points="6,27 22,27 14,37" fill="#0e2148"/><rect x="6" y="2" width="16" height="5" rx="2" fill="#0e2148"/></svg>`,
      // small heart
      `<svg width="30" height="27" viewBox="0 0 30 27" fill="none"><path d="M15 25 C15 25 2 16 2 8 C2 4 5 1 9 1 C12 1 14 3 15 5 C16 3 18 1 21 1 C25 1 28 4 28 8 C28 16 15 25 15 25Z" fill="#f5b301"/></svg>`,
      // small cloud
      `<svg width="40" height="24" viewBox="0 0 40 24" fill="none"><ellipse cx="20" cy="16" rx="18" ry="8" fill="#0e2148"/><ellipse cx="13" cy="12" rx="9" ry="9" fill="#0e2148"/><ellipse cx="26" cy="13" rx="7" ry="7" fill="#0e2148"/></svg>`,
    ];

    const wrap = document.createElement('div');
    wrap.className = 'hero-float-shapes';
    shapes.forEach((svg, i) => {
      const el = document.createElement('span');
      el.className = 'hero-float-shape';
      el.innerHTML = svg;
      wrap.appendChild(el);
    });
    hero.insertBefore(wrap, hero.firstChild);
  })();

  /* ══════════════════════════════════════════════════════════════════════
     3. Scroll fade-up — IntersectionObserver
  ══════════════════════════════════════════════════════════════════════ */
  (function initScrollFade() {
    /*
     * SAFE elements to animate on scroll.
     * Rules:
     *  - NO 'section' (far too broad — catches carousels, hero, footer wrappers)
     *  - NO 'footer .col-lg-4' (footer should be static, not animated)
     *  - NO '.highlight-card' / '.value-card' inside carousels (carousel
     *    JS owns their transform; fade-up would fight it)
     *  - NO navbar, logo, or announcement bar
     *  - YES: standalone info/program/contact/step/method/press cards
     *  - YES: section headings + eyebrows inside content sections
     *  - YES: the CTA section block itself
     *  - YES: alt-row facility blocks on programs page
     */
    const selectors = [
      // Info cards below hero
      '.hero-cards .info-card',
      // Program cards
      '.program-card',
      // Contact page cards
      '.contact-card',
      // Admissions step cards
      '.step-card',
      // Press/gallery cards (not inside carousels)
      '.press-card',
      // Gallery grid items
      '.gallery-grid .gallery-item',
      // Facility alt-rows on programs page
      '.alt-row',
      // CTA section content
      '.cta-section h2',
      '.cta-section p',
      '.cta-section .btn',
      // Page hero headings (sub-pages)
      '.page-hero h1',
      '.page-hero .lead',
      // Section headings (only direct children of .section or known wrapper)
      '.section > .container > .text-center',
      '.section > .container > .row',
      // About page principal image block
      '.principal-img',
      // Testimonials section as a whole block
      '.testimonials-section .testi-carousel-wrap',
      '.testimonials-section .text-center',
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        // Skip elements that are inside a carousel track (they have JS-driven transforms)
        if (el.closest('.day-carousel-track, .pillars-carousel-track')) return;
        // Skip if already handled by method-step classes
        if (el.classList.contains('method-step-left') || el.classList.contains('method-step-right')) return;
        // Skip navbar, announcement bar, footer
        if (el.closest('.navbar-custom, .announcement, .footer')) return;

        if (!el.classList.contains('fade-up')) {
          el.classList.add('fade-up');
        }
      });
    });

    // Stagger sibling cards only for standalone card grids (not carousel slides)
    const cardParents = document.querySelectorAll(
      '.hero-cards .row, .section .row:not(.day-carousel-track):not(.pillars-carousel-track), .gallery-grid'
    );
    cardParents.forEach(row => {
      const cards = row.querySelectorAll(
        '.info-card, .program-card, .gallery-item, .contact-card, .step-card, .press-card'
      );
      cards.forEach((card, i) => {
        if (i > 0) card.setAttribute('data-delay', Math.min(i, 6));
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.fade-up, .method-step-left, .method-step-right').forEach(el => {
      observer.observe(el);
    });
  })();

  /* ══════════════════════════════════════════════════════════════════════
     4. Counter animation — About page stats
  ══════════════════════════════════════════════════════════════════════ */
  (function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 2000;
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.round(easeOut(progress) * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  })();

  /* ══════════════════════════════════════════════════════════════════════
     1. "A Day at Siya's" — Centre-Highlighted Carousel
  ══════════════════════════════════════════════════════════════════════ */
  (function initDayCarousel() {
    const wrap = document.querySelector('.day-carousel-wrap');
    if (!wrap) return;

    const track = wrap.querySelector('.day-carousel-track');
    const slides = Array.from(track.querySelectorAll('.day-carousel-slide'));
    const dots = wrap.querySelectorAll('.day-carousel-dot');
    const total = slides.length;
    let current = 0;
    let autoTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    const isMobile = () => window.innerWidth < 768;

    function updateCarousel(animate) {
      const slideWidth = isMobile() ? 85 : 33.333;
      const containerWidth = 100;
      // Center the current card
      // Offset: move so that current slide center aligns with container center
      const offset = (containerWidth / 2) - (slideWidth * current) - (slideWidth / 2);
      track.style.transform = `translateX(${offset}%)`;

      slides.forEach((slide, i) => {
        slide.classList.toggle('center', i === current);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = ((index % total) + total) % total;
      updateCarousel(true);
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    // Buttons
    const prevBtn = wrap.querySelector('.day-carousel-btn.prev');
    const nextBtn = wrap.querySelector('.day-carousel-btn.next');
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    // Dots
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Auto-rotate
    function startAuto() { autoTimer = setInterval(next, 3000); }
    function stopAuto() { clearInterval(autoTimer); }
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);

    // Touch / Swipe
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? next() : prev();
      }
    }, { passive: true });

    updateCarousel(false);
    startAuto();
    window.addEventListener('resize', () => updateCarousel(false));
  })();

  /* ══════════════════════════════════════════════════════════════════════
     2. "Our Pillars" — Custom Carousel (replaces Bootstrap carousel logic)
  ══════════════════════════════════════════════════════════════════════ */
  (function initPillarsCarousel() {
    const wrap = document.querySelector('.pillars-carousel-wrap');
    if (!wrap) return;

    const track = wrap.querySelector('.pillars-carousel-track');
    const slides = Array.from(track.querySelectorAll('.pillars-carousel-slide'));
    const dots = wrap.querySelectorAll('.pillars-carousel-dot');
    const total = slides.length;
    let current = 0;
    let autoTimer = null;
    let touchStartX = 0;

    const isMobile = () => window.innerWidth < 768;

    function updateCarousel() {
      const slideWidth = isMobile() ? 90 : 33.333;
      const containerWidth = 100;
      const offset = (containerWidth / 2) - (slideWidth * current) - (slideWidth / 2);
      track.style.transform = `translateX(${offset}%)`;

      slides.forEach((slide, i) => slide.classList.toggle('center', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }

    function goTo(index) {
      current = ((index % total) + total) % total;
      updateCarousel();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    // Wire existing Bootstrap prev/next buttons if present
    const bsPrev = document.querySelector('#valuesCarousel .carousel-control-prev, .pillars-prev-btn');
    const bsNext = document.querySelector('#valuesCarousel .carousel-control-next, .pillars-next-btn');
    if (bsPrev) { bsPrev.removeAttribute('data-bs-slide'); bsPrev.addEventListener('click', prev); }
    if (bsNext) { bsNext.removeAttribute('data-bs-slide'); bsNext.addEventListener('click', next); }

    // Dots
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // Auto-rotate
    function startAuto() { autoTimer = setInterval(next, 4000); }
    function stopAuto()  { clearInterval(autoTimer); }
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);

    // Touch
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    }, { passive: true });

    updateCarousel();
    startAuto();
    window.addEventListener('resize', updateCarousel);
  })();

  /* ══════════════════════════════════════════════════════════════════════
     12. Testimonials Carousel
  ══════════════════════════════════════════════════════════════════════ */
  (function initTestimonials() {
    const wrap = document.querySelector('.testi-carousel-wrap');
    if (!wrap) return;

    const cards = wrap.querySelectorAll('.testi-card');
    const dots  = wrap.querySelectorAll('.testi-dot');
    const total = cards.length;
    let current = 0;
    let timer = null;

    function show(index) {
      current = ((index % total) + total) % total;
      cards.forEach((c, i) => c.classList.toggle('active', i === current));
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { show(current + 1); }

    dots.forEach((dot, i) => dot.addEventListener('click', () => { clearInterval(timer); show(i); timer = setInterval(next, 4000); }));
    wrap.addEventListener('mouseenter', () => clearInterval(timer));
    wrap.addEventListener('mouseleave', () => { timer = setInterval(next, 4000); });

    show(0);
    timer = setInterval(next, 4000);
  })();

  /* ══════════════════════════════════════════════════════════════════════
     11. Gallery filter — animated pill + card fade
  ══════════════════════════════════════════════════════════════════════ */
  (function initGalleryFilter() {
    const filterBar = document.querySelector('.gallery-filter');
    if (!filterBar) return;

    const chips = filterBar.querySelectorAll('.chip');
    const items = document.querySelectorAll('.gallery-grid .gallery-item');

    // Animated pill
    const pill = document.createElement('span');
    pill.className = 'gallery-filter-pill';
    filterBar.style.position = 'relative';
    filterBar.insertBefore(pill, filterBar.firstChild);

    function movePill(activeChip) {
      const barRect = filterBar.getBoundingClientRect();
      const chipRect = activeChip.getBoundingClientRect();
      pill.style.left   = (chipRect.left - barRect.left) + 'px';
      pill.style.width  = chipRect.width + 'px';
      pill.style.height = chipRect.height + 'px';
      pill.style.top    = (chipRect.top - barRect.top) + 'px';
    }

    // Init pill on active chip
    const initActive = filterBar.querySelector('.chip.active');
    if (initActive) {
      // Wait for layout
      setTimeout(() => movePill(initActive), 50);
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        movePill(chip);

        const filter = chip.dataset.filter;

        // Fade out all visible items
        items.forEach(item => {
          item.classList.remove('showing');
          item.classList.add('hiding');
        });

        // Reflow, then show matching
        setTimeout(() => {
          let delay = 0;
          items.forEach(item => {
            const match = (filter === 'all') || (item.dataset.cat === filter);
            item.classList.remove('hiding');
            if (match) {
              item.style.display = '';
              item.style.animationDelay = delay + 's';
              item.classList.add('showing');
              delay += 0.06;
            } else {
              item.style.display = 'none';
            }
          });
        }, 300);
      });
    });
  })();

  /* ══════════════════════════════════════════════════════════════════════
     13. Mobile floating "Apply Now" FAB — slide up on load
  ══════════════════════════════════════════════════════════════════════ */
  (function initFAB() {
    const fab = document.querySelector('.mobile-apply-fab');
    if (!fab) return;
    setTimeout(() => fab.classList.add('visible'), 1000);
  })();

  /* ══════════════════════════════════════════════════════════════════════
     Gallery Lightbox (previously inline in gallery.html)
  ══════════════════════════════════════════════════════════════════════ */
  (function initLightbox() {
    const lb    = document.getElementById('lightbox');
    if (!lb) return;
    const lbImg = document.getElementById('lbImage');
    const lbCap = document.getElementById('lbCaption');
    const close = document.getElementById('lbClose');

    const open = (src, alt, caption) => {
      lbImg.src = src; lbImg.alt = alt || '';
      lbCap.textContent = caption || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const hide = () => {
      lb.classList.remove('open');
      lbImg.src = '';
      document.body.style.overflow = '';
    };

    document.querySelectorAll('.gallery-item').forEach(el => {
      el.addEventListener('click', () => {
        const img = el.querySelector('img');
        open(img.src, img.alt, el.dataset.caption);
      });
    });
    document.querySelectorAll('.press-thumb').forEach(el => {
      el.addEventListener('click', () => {
        const img = el.querySelector('img');
        open(img.src, img.alt, el.dataset.caption);
      });
    });
    if (close) close.addEventListener('click', hide);
    lb.addEventListener('click', e => { if (e.target === lb) hide(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
  })();

})();
