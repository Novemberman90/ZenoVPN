document.addEventListener("DOMContentLoaded", () =>{
        var swiper = new Swiper(".reviews-slider", {
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
   
      });
});