document.addEventListener("DOMContentLoaded", () =>{
/*         var swiper = new Swiper(".reviews-slider", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        direction: "vertical",
        navigation: {
          nextEl: '.reviews__nav--next',
          prevEl: '.reviews__nav--prev',
        },
        coverflowEffect: {
          rotate: 0,
          stretch: 215,
          depth: 150,
          modifier: 1,
          slideShadows: false,
        },
        breakpoints: {
          0: {
            direction: "horizontal"
          },
          1024: {
            direction: "vertical",
          }
        },
   
      }); */

/* let swiper;
let currentDirection;

function getDirection() {
  return window.innerWidth >= 1025 ? 'vertical' : 'horizontal';
}

function initSwiper() {
  currentDirection = getDirection();

  swiper = new Swiper('.reviews-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',

    direction: currentDirection,

    navigation: {
      nextEl: '.reviews__nav--next',
      prevEl: '.reviews__nav--prev',
    },

    coverflowEffect: {
      rotate: 0,
      stretch: 280,
      depth: 150,
      modifier: 1,
      slideShadows: false,
    },

    breakpoints: {
      0: {
        direction: 'horizontal',
        coverflowEffect: {
          stretch: 256,
          depth: 190,
        },
      },
      1025: {
        direction: 'vertical',
      },
    },
  });
}

initSwiper();

window.addEventListener('resize', () => {
  const newDirection = getDirection();

  if (newDirection !== currentDirection) {
    swiper.destroy(true, true);
    initSwiper();
  }
});
 */


/* let swiper;
let currentDirection;

const getDirection = () =>
  window.innerWidth >= 768 ? 'vertical' : 'horizontal';

const initSwiper = () => {
  currentDirection = getDirection();

  swiper = new Swiper('.reviews-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    direction: currentDirection,

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
          stretch: 256,
          depth: 179,
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

initSwiper();

window.addEventListener('resize', () => {
  const newDirection = getDirection();

  if (newDirection !== currentDirection) {
    swiper.destroy(true, true);
    initSwiper();
  }
});
 */

let swiper;
let currentRange;

const getRange = () => {
  const w = window.innerWidth;

  if (w >= 1025) return 'desktop';
  if (w >= 768) return 'tablet';
  return 'mobile';
};

const initSwiper = () => {
  currentRange = getRange();

  swiper = new Swiper('.reviews-slider', {
    effect: 'coverflow',
    initialSlide: 1,
    grabCursor: false,
    centeredSlides: true,
    slidesPerView: 'auto',
    direction: 'vertical', // фактически управляется breakpoints
    modifier: 1,
    mousewheel: false,
    keyboard: false,
    allowTouchMove: false,
    speed: 750,
    on: {
      init(swiper) {
        swiper.update();
      }
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
          stretch: 246,
          depth: 105,
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

initSwiper();

window.addEventListener('resize', () => {
  const newRange = getRange();

  if (newRange !== currentRange) {
    swiper.destroy(true, true);
    initSwiper();
  }
});



});