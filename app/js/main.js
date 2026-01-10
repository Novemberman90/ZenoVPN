

document.addEventListener('DOMContentLoaded', () => {

    /* ================= METRICS ================= */

  const animateNumbers = elements => {
  const duration = 2000;

  elements.forEach(item => {
    const value = item.dataset.countNum;
    if (!value) return;

    const target = parseFloat(value);
    if (isNaN(target)) return;

    const decimals = value.includes('.') ? value.split('.')[1].length : 0;
    let start = null;

    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = target * progress;

      item.textContent =
        decimals > 0 ? current.toFixed(decimals) : Math.floor(current);

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
};


const metricsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    animateNumbers(entry.target.querySelectorAll('[data-activeNum]'));
    metricsObserver.unobserve(entry.target);
  });
}, { threshold: 0.4 });

document
  .querySelectorAll('.metric-card, .metrics')
  .forEach(el => metricsObserver.observe(el));


  /* svg animate */
const drawPath = (path, duration = 1500) => {
  const length = path.getTotalLength();

  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;
  path.style.willChange = 'stroke-dashoffset';

  let start = null;

  const animate = timestamp => {
    if (!start) start = timestamp;

    const progress = timestamp - start;
    const offset = Math.max(
      length - (length * progress) / duration,
      0
    );

    path.style.strokeDashoffset = offset;

    if (progress < duration) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

const progressBar = document.querySelectorAll('.metric-card__progress-bar');
    progressBar.forEach(path => drawPath(path, 1500));
});


