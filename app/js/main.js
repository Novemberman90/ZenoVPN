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
  const menuBtn = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-menu]');

  const openMenu = () => {
    if (!menuBtn || !mobileMenu) return;
    const isOpen = mobileMenu.classList.toggle('is-open');
    menuBtn.classList.toggle('is-open', isOpen);
    mobileMenu.classList.toggle('blur-plate');
    menuBtn.setAttribute('aria-expanded', isOpen)
  }

    const closeMenu = () => {
      if (!menuBtn || !mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    menuBtn.classList.remove('is-open');
    mobileMenu.classList.remove('blur-plate');
    menuBtn.setAttribute('aria-expanded', 'false');
  };

  if(menuBtn && mobileMenu) {

    menuBtn.addEventListener('click', openMenu);
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
        (headerHeight + 100);

      window.scrollTo({ top, behavior: 'smooth' });
      closeMenu();
    });
  });

  /* ================= HEADER STATE (FIXED + ACTIVE) ================= */
  
  const header = document.querySelector('[data-header]');
  const goTop = document.querySelector('.go-top');
  const SCROLL_FIXED_THRESHOLD = 50;

  if (header || goTop) {
    const headerScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;

      if (header) {
        if (scrollPosition >= SCROLL_FIXED_THRESHOLD) {
          header.classList.add('active');
        } else {
          header.classList.remove('active');
        }
      }

      if (goTop) {
        if (scrollPosition >= SCROLL_FIXED_THRESHOLD) {
          goTop.classList.add('go-top--active');
        } else {
          goTop.classList.remove('go-top--active');
        }
      }
    };

    window.addEventListener('scroll', headerScroll);
    headerScroll();
  }

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


});