document.addEventListener('DOMContentLoaded', () => {
  /* ================= HELPERS ================= */
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  /* ================= METRICS: NUMBER ANIMATION ================= */
  const animateNumbers = (elements, duration = 2000) => {
    elements.forEach((item) => {
      const value = item.dataset.countNum; // data-count-num
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

      // стартово закрито / відкрито
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

    // якщо відкритий пункт і змінюється ширина — підлаштувати висоту
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

          // Анімація чисел (лише data-count-num)
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
    // якщо Swiper не підключений — просто виходимо
    if (typeof Swiper === 'undefined') return;

    // якщо слайдера на сторінці немає — виходимо
    const sliderEl = document.querySelector('.reviews-slider');
    if (!sliderEl) return;

    currentRange = getRange();

    swiper = new Swiper('.reviews-slider', {
      effect: 'coverflow',
      initialSlide: 1,
      grabCursor: false,
      centeredSlides: true,
      slidesPerView: 'auto',
      direction: 'vertical', // фактично керується breakpoints
      modifier: 1,
      mousewheel: false,
      keyboard: false,
      allowTouchMove: false,

      on: {
        init(s) {
          s.update();
        },
      },

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

  /* ================= INIT ================= */
  initAccordion();
  initMetricsObserver();
  initProgressBars();
  initSwiper();

  window.addEventListener('resize', () => {
    // оновлення висоти акордеона вже є в initAccordion()

    // Swiper переініт тільки коли змінився "діапазон" (mobile/tablet/desktop)
    if (!swiper) return;

    const newRange = getRange();
    if (newRange !== currentRange) {
      swiper.destroy(true, true);
      initSwiper();
    }
  });
});
