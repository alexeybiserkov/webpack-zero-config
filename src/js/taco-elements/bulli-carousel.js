const Glider = require('glider-js');

const wbeCarousel = {
  init() {
    const bulliCarousels = document.querySelectorAll('.bulli-carousel');
    bulliCarousels.forEach((slider) => {
      this.setup(slider);
    });
  },

  setup(slider) {
    /* eslint-disable */
        new Glider(slider.querySelector('.glider'), {
            slidesToShow: 1,
            slidesToScroll: 1,
            draggable: false,
            dots: slider.querySelector('.dots'),
            arrows: {
                prev: slider.querySelector('.glider-prev'),
                next: slider.querySelector('.glider-next'),
            },
            responsive: [
                {
                    // screens greater than >= 992px
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    },
                },
                {
                    // screens greater than >= 776px
                    breakpoint: 776,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                    },
                },
            ],
        });
    },
};

wbeCarousel.init();
