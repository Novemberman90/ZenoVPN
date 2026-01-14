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

        item.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);

        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  };

  /* ================= FAQ ACCORDION (NEW STRUCTURE) ================= */
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

    // стартово закрито
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

  // якщо відкритий пункт і змінюється ширина (переноси тексту) — підлаштувати висоту
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

  /* ================= INIT ================= */
  initAccordion();
  initMetricsObserver();
  initProgressBars();


  const LANG_KEY = 'siteLang';

  (function initGeo() {
    // Перевірка fetch
    if (typeof fetch !== 'function') {
      console.warn('Fetch is not supported');
      return;
    }

    fetch('https://ipwho.is/')
      .then(response => {
        if (!response.ok) {
          throw new Error('GeoIP request failed');
        }
        return response.json();
      })
      .then(data => {
        // Базова перевірка відповіді
        if (!data || data.success !== true || !data.country_code) {
          console.warn('GeoIP invalid data:', data);
          return;
        }

        const countryCode = data.country_code; // UA, PL, DE, SA...

        console.log('GeoIP country:', countryCode);

        /* ===== 1. ПІДСВІТКА КРАЇНИ НА МАПІ ===== */
        const flags = document.querySelectorAll(
          `.map-flag[data-country="${countryCode}"]`
        );

        if (flags.length) {
          flags.forEach(flag => flag.classList.add('is-active'));
        }

        /* ===== 2. ПЕРЕВІРКА ЗБЕРЕЖЕНОЇ МОВИ ===== */
        const savedLang = localStorage.getItem(LANG_KEY);
        if (savedLang) {
          // Мова вже вибрана — гео тільки для мапи
          return;
        }

        /* ===== 3. ВИЗНАЧЕННЯ МОВИ ПО РЕГІОНУ ===== */
        let targetLang = 'en';

        // RU-регіон
        if (['RU', 'BY', 'KZ', 'UA'].includes(countryCode)) {
          targetLang = 'ru';
        }

        // AR-регіон
        if (['SA', 'AE', 'EG', 'QA', 'KW'].includes(countryCode)) {
          targetLang = 'ar';
        }

        localStorage.setItem(LANG_KEY, targetLang);

        /* ===== 4. РЕДІРЕКТ (ЛИШЕ ЯКЩО НЕ ТАМ) ===== */
        const path = window.location.pathname;

        if (targetLang === 'ru' && !path.startsWith('/ru/')) {
          window.location.replace('/ru/index.html');
          return;
        }

        if (targetLang === 'ar' && !path.startsWith('/ar/')) {
          window.location.replace('/ar/index.html');
          return;
        }

        // EN — залишаємося на поточній сторінці
      })
      .catch(error => {
        console.warn('GeoIP error:', error);
      });
  })();

});
