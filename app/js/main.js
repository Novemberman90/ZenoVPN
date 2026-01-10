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

let swiper;
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




});