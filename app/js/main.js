document.addEventListener('DOMContentLoaded', () => {

  /* ================= LANGUAGE SWITCHER (HEADER) ================= */
  const langSwitcher = document.querySelector('[data-lang-switcher]');
  const langList = langSwitcher?.nextElementSibling;

  if (langSwitcher && langList) {
    langSwitcher.addEventListener('click', function (e) {
      e.stopPropagation();

      const isActive = langList.classList.toggle('active');
      this.classList.toggle('active', isActive);
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.switcher-lang')) {
        langList.classList.remove('active');
        langSwitcher.classList.remove('active');
      }
    });
  }

  /* ================= MOBILE MENU ================= */
  const menuBtnRef = document.querySelector('[data-menu-button]');
  const mobileMenuRef = document.querySelector('[data-menu]');

  const closeMenu = () => {
    if (!menuBtnRef || !mobileMenuRef) return;

    mobileMenuRef.classList.remove('is-open');
    menuBtnRef.classList.remove('is-open');
    menuBtnRef.setAttribute('aria-expanded', 'false');
  };

  if (menuBtnRef && mobileMenuRef) {
    menuBtnRef.addEventListener('click', () => {
      const expanded = menuBtnRef.getAttribute('aria-expanded') === 'true';
      menuBtnRef.classList.toggle('is-open');
      menuBtnRef.setAttribute('aria-expanded', String(!expanded));
      mobileMenuRef.classList.toggle('is-open');
    });
  }

  /* ================= SCROLL NAV ================= */
  const navLinks = document.querySelectorAll('a[href^="#"], [data-scroll]');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      if (link.classList.contains('go-top')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetId =
        link.dataset.scroll ||
        link.getAttribute('href')?.substring(1);

      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      const headerEl = document.getElementById('header');
      const headerHeight = headerEl ? headerEl.offsetHeight : 0;

      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        (headerHeight + 80);

      window.scrollTo({ top, behavior: 'smooth' });
      closeMenu();
    });
  });

  /* ================= HEADER STATE (FIXED + ACTIVE) ================= */
  const headerById = document.getElementById('header');
  const headerByData = document.querySelector('[data-header]');
  const headerEl = headerByData || headerById;

  const goTop = document.querySelector('.go-top');

  const SCROLL_FIXED_THRESHOLD = 50;  // is-fixed
  const SCROLL_ACTIVE_THRESHOLD = 50; // active

  const onHeaderScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;

    if (headerEl) {
      // fixed
      if (y >= SCROLL_FIXED_THRESHOLD) headerEl.classList.add('is-fixed');
      else headerEl.classList.remove('is-fixed');

      // active (your first code)
      if (y >= SCROLL_ACTIVE_THRESHOLD) headerEl.classList.add('active');
      else headerEl.classList.remove('active');
    }

    if (goTop) {
      if (y >= SCROLL_FIXED_THRESHOLD) goTop.classList.add('go-top--active');
      else goTop.classList.remove('go-top--active');
    }
  };

  window.addEventListener('scroll', onHeaderScroll);
  onHeaderScroll();

  /* ================= HELPERS ================= */
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  /* ================= METRICS: NUMBER ANIMATION ================= */
  const animateNumbers = (elements, duration = 2000) => {
    elements.forEach((item) => {
      const value = item.dataset.countNum;
      if (!value) return;

      const target = parseFloat(value);
      if (Number.isNaN(target)) return;

      const decimals = value.includes('.') ? value.split('.')[1].length : 0;
      let start = null;

      const step = (timestamp) => {
        if (!start) start = timestamp;

        const progress = clamp((timestamp - start) / duration, 0, 1);
        const current = target * progress;

        item.textContent =
          decimals > 0 ? current.toFixed(decimals) : Math.floor(current);

        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  };

  /* ================= FAQ ACCORDION ================= */
  const initAccordion = () => {
    const accordions = document.querySelectorAll('[data-accordion]');
    if (!accordions.length) return;

    accordions.forEach((item) => {
      const button = item.querySelector('.faq__button');
      const answer = item.querySelector('.faq__answer');
      const icon = item.querySelector('.faq__icon');

      if (!button || !answer || !icon) return;
      answer.style.maxHeight = null;

      button.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        accordions.forEach((acc) => {
          acc.classList.remove('is-open');

          const accAnswer = acc.querySelector('.faq__answer');
          const accIcon = acc.querySelector('.faq__icon');

          if (accAnswer) accAnswer.style.maxHeight = null;
          if (accIcon) accIcon.classList.remove('faq__icon--open');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          icon.classList.add('faq__icon--open');
        }
      });
    });
  };

  /* ================= METRICS: OBSERVER ================= */
  const initMetricsObserver = () => {
    const targets = document.querySelectorAll('.metrics, .metric-card');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animateNumbers(entry.target.querySelectorAll('[data-count-num]'));
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    targets.forEach((el) => observer.observe(el));
  };

  /* ================= SVG PATH DRAW ================= */
  const drawPath = (path, duration = 1500) => {
    if (!path || typeof path.getTotalLength !== 'function') return;

    const length = path.getTotalLength();

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.style.willChange = 'stroke-dashoffset';

    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;

      const progress = timestamp - start;
      const offset = Math.max(length - (length * progress) / duration, 0);

      path.style.strokeDashoffset = offset;

      if (progress < duration) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  const initProgressBars = () => {
    const bars = document.querySelectorAll('.metric-card__progress-bar');
    if (!bars.length) return;

    bars.forEach((path) => drawPath(path, 1500));
  };

  /* ================= REVIEWS SWIPER ================= */
  let swiper;
  let currentRange;

  const getRange = () => {
    const w = window.innerWidth;
    if (w >= 1025) return 'desktop';
    if (w >= 768) return 'tablet';
    return 'mobile';
  };

  const initSwiper = () => {
    if (typeof Swiper === 'undefined') return;

    const sliderEl = document.querySelector('.reviews-slider');
    if (!sliderEl) return;

    currentRange = getRange();

    swiper = new Swiper('.reviews-slider', {
      effect: 'coverflow',
      initialSlide: 1,
      centeredSlides: true,
      slidesPerView: 'auto',
      allowTouchMove: false,

      navigation: {
        nextEl: '.reviews__nav--next',
        prevEl: '.reviews__nav--prev',
      },

      coverflowEffect: {
        rotate: 0,
        stretch: 280,
        depth: 260,
        modifier: 1,
        slideShadows: false,
      },

      breakpoints: {
        0: {
          direction: 'vertical',
          coverflowEffect: {
            stretch: 248,
            depth: 204,
          },
        },
        768: {
          direction: 'horizontal',
          coverflowEffect: {
            stretch: 256,
            depth: 190,
          },
        },
        1025: {
          direction: 'vertical',
          coverflowEffect: {
            stretch: 280,
            depth: 260,
          },
        },
      },
    });
  };

  /* ================= GEO + LANGUAGE ================= */
  const LANG_KEY = 'siteLang';

  (function initGeo() {
    if (typeof fetch !== 'function') return;

    fetch('https://ipwho.is/')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data || data.success !== true || !data.country_code) return;

        const countryCode = data.country_code;

        const countryItem = document.querySelector(
          `.countries__item[data-country="${countryCode}"]`
        );

        const location = document.querySelector('.network__location');
        const locationBox = document.querySelector('.network__location-box');

        if (countryItem && location && locationBox) {
          location.classList.remove('hidden');
          locationBox.innerHTML = '';
          locationBox.appendChild(countryItem.cloneNode(true));
        }

        const savedLang = localStorage.getItem(LANG_KEY);
        if (savedLang) return;

        let targetLang = 'en';

        if (['RU', 'BY', 'KZ', 'UA'].includes(countryCode)) targetLang = 'ru';
        if (['SA', 'AE', 'EG', 'QA', 'KW', 'TR', 'IR', 'PK', 'OM'].includes(countryCode)) targetLang = 'ar';

        localStorage.setItem(LANG_KEY, targetLang);

        const path = window.location.pathname;

        if (targetLang === 'ru' && !path.startsWith('/ru/')) {
          window.location.replace('/ru/index.html');
        }

        if (targetLang === 'ar' && !path.startsWith('/ar/')) {
          window.location.replace('/ar/index.html');
        }
      })
      .catch(() => { });
  })();

  /* ================= NETWORK: SHOW ALL COUNTRIES ================= */
  const countries = document.querySelector('.countries__inner');
  const toggleBtn = document.querySelector('.countries__btn');

  if (countries && toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      countries.classList.toggle('is-open');
      toggleBtn.classList.toggle('is-open');
    });
  }

  /* ================= INIT ================= */
  initAccordion();
  initMetricsObserver();
  initProgressBars();
  initSwiper();

  window.addEventListener('resize', () => {
    if (!swiper) return;

    const newRange = getRange();
    if (newRange !== currentRange) {
      swiper.destroy(true, true);
      initSwiper();
    }
  });

  /* ================= COOKIE ================= */
  const cookie = document.getElementById('cookie');

  if (cookie) {
    const acceptBtn = cookie.querySelector('.cookie__accept');
    const closeBtn = cookie.querySelector('.cookie__close');
    const COOKIE_KEY = 'cookieConsent';

    if (localStorage.getItem(COOKIE_KEY) === null) {
      setTimeout(() => cookie.classList.add('is-visible'), 4000);
    }

    acceptBtn?.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'true');
      cookie.classList.remove('is-visible');
    });

    closeBtn?.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'false');
      cookie.classList.remove('is-visible');
    });
  }

  /* ================= LOGO: SCROLL TO TOP ================= */
  const HERO_ID = 'hero';
  const HEADER_SELECTOR = '.header';
  const header = HEADER_SELECTOR ? document.querySelector(HEADER_SELECTOR) : null;

  document.addEventListener('click', (e) => {
    const link = e.target.closest(`a[href="#${HERO_ID}"]`);
    if (!link) return;

    const hero = document.getElementById(HERO_ID);
    if (!hero) return;

    e.preventDefault();

    const headerOffset = header ? Math.ceil(header.getBoundingClientRect().height) : 0;

    const heroTop = hero.getBoundingClientRect().top + window.pageYOffset;
    const targetY = Math.max(0, heroTop - headerOffset);

    const supportsSmooth =
      'scrollBehavior' in document.documentElement.style;

    if (supportsSmooth) {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      return;
    }

    const startY = window.pageYOffset;
    const distance = targetY - startY;
    const duration = 500; // ms
    const startTime = performance.now();

    const easeInOutCubic = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
});