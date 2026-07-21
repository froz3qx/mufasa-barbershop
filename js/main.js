document.addEventListener('DOMContentLoaded', () => {

  // ─── SCROLL PROGRESS BAR ───
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  });

  // ─── HEADER SCROLL EFFECT ───
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = current;
  });

  // ─── BURGER MENU ───
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.nav-overlay');

  if (burger && nav) {
    const openMenu = () => {
      burger.classList.add('active');
      nav.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    burger.addEventListener('click', () => {
      nav.classList.contains('open') ? closeMenu() : openMenu();
    });

    if (overlay) overlay.addEventListener('click', closeMenu);

    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
  }

  // ─── ACTIVE NAV LINK ───
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
    if (path === '' && href === 'index.html') a.classList.add('active');
  });

  // ─── FAQ ACCORDION ───
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item.active').forEach(i => {
        i.classList.remove('active');
        const answer = i.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = '0';
      });

      if (!isActive) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        if (answer) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      }
    });
  });

  // ─── SCROLL REVEAL (Intersection Observer) ───
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── STAGGER ANIMATIONS ───
  const staggerGrids = document.querySelectorAll('.services-grid, .team-grid, .advantages-grid, .reviews-grid, .price-cards, .values-grid');

  staggerGrids.forEach(grid => {
    const items = grid.querySelectorAll('.service-card, .team-card, .advantage-card, .review-card, .price-card, .value-card');
    items.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 0.08) + 's';
      revealObserver.observe(el);
    });
  });

  // ─── HERO STATS COUNTERS ───
  const countUp = (el, target, suffix = '') => {
    let current = 0;
    const duration = 2000;
    const step = Math.max(1, Math.floor(target / 60));
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 16);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stat = entry.target;
        const numberEl = stat.querySelector('.hero-stat-number');
        if (numberEl && !stat.dataset.counted) {
          stat.dataset.counted = 'true';
          const text = numberEl.textContent;
          const num = parseFloat(text.replace(/[^0-9.]/g, ''));
          const suffix = text.replace(/[0-9.]/g, '');
          if (!isNaN(num)) countUp(numberEl, num, suffix);
        }
        statsObserver.unobserve(stat);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero-stat').forEach(stat => statsObserver.observe(stat));

  // ─── ANALYSIS BARS ANIMATION ───
  document.querySelectorAll('.analysis-bar-fill').forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';

    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => { bar.style.width = targetWidth; }, 300);
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    barObserver.observe(bar);
  });

  // ─── HERO PARALLAX ───
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      heroBg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    });
  }

  // ─── GALLERY LIGHTBOX ───
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button class="lightbox-close">&times;</button><img src="" alt="">';
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const src = img.getAttribute('src') || img.src;
      lightboxImg.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ─── GALLERY FILTER ───
  document.querySelectorAll('.gallery-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ─── MODAL ───
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modal = document.querySelector('.modal');
  const modalClose = modal?.querySelector('.modal-close');

  if (modal) {
    const openModal = (id) => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      const form = modal.querySelector('form');
      if (form) form.setAttribute('data-service', id || '');
    };

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    modalTriggers.forEach(t => {
      t.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(t.dataset.modal);
      });
    });

    modalClose?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Modal form
    const mForm = modal.querySelector('form');
    if (mForm) {
      mForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        const orig = btn.textContent;
        btn.textContent = 'Отправка...';
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = 'Запись отправлена!';
          btn.style.background = '#27AE60';

          showToast('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');

          setTimeout(() => {
            btn.textContent = orig;
            btn.disabled = false;
            btn.style.background = '';
            this.reset();
            closeModal();
          }, 2000);
        }, 1500);
      });
    }
  }

  // ─── CONTACT FORM ───
  const cForm = document.querySelector('.contact-form form');
  if (cForm && !cForm.closest('.modal')) {
    cForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = 'Отправка...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Сообщение отправлено!';
        btn.style.background = '#27AE60';

        showToast('Сообщение отправлено! Мы ответим вам в ближайшее время.', 'success');

        setTimeout(() => {
          btn.textContent = orig;
          btn.disabled = false;
          btn.style.background = '';
          this.reset();
        }, 2000);
      }, 1500);
    });
  }

  // ─── TOAST SYSTEM ───
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type} show`;
    toast.innerHTML = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // ─── SMOOTH ANCHOR SCROLL ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── CUSTOM CURSOR ───
  if (window.innerWidth > 1024) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border: 1px solid rgba(212, 168, 85, 0.4);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transition: width 0.3s, height 0.3s, border-color 0.3s, transform 0.15s;
      transform: translate(-50%, -50%);
      mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.1;
      cursorY += (mouseY - cursorY) * 0.1;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animate);
    };
    animate();

    document.querySelectorAll('a, button, .btn, .service-card, .gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.borderColor = 'rgba(212, 168, 85, 0.8)';
        cursor.style.background = 'rgba(212, 168, 85, 0.05)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.borderColor = 'rgba(212, 168, 85, 0.4)';
        cursor.style.background = 'transparent';
      });
    });
  }

  // ─── COUNTER ANIMATION FOR HERO INNER PAGES ───
  document.querySelectorAll('.page-stats .hero-stat').forEach(stat => statsObserver.observe(stat));

  // ─── PARALLAX ON SCROLL ───
  const parallaxElements = document.querySelectorAll('.parallax');
  if (parallaxElements.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxElements.forEach(el => {
        const speed = el.dataset.speed || 0.3;
        el.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }

  console.log('%c MUFASA ', 'background: #D4A855; color: #0A0A0F; font-size: 14px; font-weight: bold; padding: 8px 12px; border-radius: 4px;');
  console.log('%c ÐŸÑ€ÐµÐ¼Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ð¹ Ð±Ð°Ñ€Ð±ÐµÑ€ÑˆÐ¾Ð¿ Ð² ÐšÐ°Ð·Ð°Ð½Ð¸ ', 'color: #88849B; font-size: 12px;');
});
