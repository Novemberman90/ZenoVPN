document.addEventListener('DOMContentLoaded', () => {
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

    const close = (acc) => {
      acc.classList.remove('is-open');

      const answer = acc.querySelector('.faq__answer');
      if (answer) answer.style.maxHeight = null;

      const icon = acc.querySelector('.faq__icon');
      if (icon) icon.classList.remove('faq__icon--open');
    };

    const open = (acc) => {
      acc.classList.add('is-open');

      const answer = acc.querySelector('.faq__answer');
      if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;

      const icon = acc.querySelector('.faq__icon');
      if (icon) icon.classList.add('faq__icon--open');
    };

    accordions.forEach((item) => {
      const btn = item.querySelector('.faq__button');
      const answer = item.querySelector('.faq__answer');
      const icon = item.querySelector('.faq__icon');

      if (!btn || !answer) return;

      if (!item.classList.contains('is-open')) {
        answer.style.maxHeight = null;
        if (icon) icon.classList.remove('faq__icon--open');
      } else {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        if (icon) icon.classList.add('faq__icon--open');
      }

      btn.addEventListener('click', (e) => {
        e.preventDefault();

        const isOpening = !item.classList.contains('is-open');

        accordions.forEach(close);
        if (isOpening) open(item);
      });
    });

    window.addEventListener('resize', () => {
      accordions.forEach((acc) => {
        if (!acc.classList.contains('is-open')) return;
        const answer = acc.querySelector('.faq__answer');
        if (answer) answer.style.maxHeight = `${answer.scrollHeight}px`;
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

          animateNumbers(
            entry.target.querySelectorAll('[data-count-num]')
          );

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
      .then((res) => res.ok ? res.json() : null)
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

        if (['RU', 'BY', 'KZ', 'UA'].includes(countryCode)) {
          targetLang = 'ru';
        }

        if (['SA', 'AE', 'EG', 'QA', 'KW', 'TR', 'IR', 'PK', 'OM'].includes(countryCode)) {
          targetLang = 'ar';
        }

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
