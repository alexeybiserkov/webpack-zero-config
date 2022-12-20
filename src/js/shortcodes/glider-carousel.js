const Glider = require('glider-js');

const gliderCarousel = {
  init() {
    if (document.querySelector('.glider') !== null) {
      this.setup();
    }
  },

  setup() {
    const gliderContainers = document.querySelectorAll('.glider-container');

    gliderContainers.forEach((slider) => {
      this.initCarouselTeam(slider);
      this.initCarouselTestimonials(slider);
      this.initCarouselLatestArticles(slider);
    });
  },

  initCarouselTeam(slider) {
    const carouselTeam = slider.querySelector('.team-carousel');
    const carouselTeamSlides = slider.querySelectorAll('.team-section-item');

    if (!carouselTeam) return;

    const carouselGliderTeam = new Glider(carouselTeam, {
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: true,
      dots: slider.querySelector('#dots'),
      arrows: {
        prev: slider.querySelector('.glider-prev'),
        next: slider.querySelector('.glider-next'),
      },
    });

    if (carouselTeamSlides.length === 1) {
      this.hideCarouselDisabledControls(slider);
    }

    if (carouselTeam.classList.contains('autoplay')) {
      this.slideAuto(carouselGliderTeam, 5000);
    }
  },

  initCarouselTestimonials(slider) {
    const carouselTestimonials = slider.querySelector('.testimonials-carousel');
    const carouselTestimonialsSlides = slider.querySelectorAll('.testimonials-item');

    if (!carouselTestimonials) return;

    const carouselGliderTestimonials = new Glider(carouselTestimonials, {
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: true,
      dots: slider.querySelector('#dots-testimonials'),
      arrows: {
        prev: slider.querySelector('.arrow-prev'),
        next: slider.querySelector('.arrow-next'),
      },
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
      ],
    });

    if (carouselTestimonialsSlides.length === 1) {
      this.hideCarouselDisabledControls(slider);
    }

    if (carouselTestimonials.classList.contains('autoplay')) {
      this.slideAuto(carouselGliderTestimonials, 5000);
    }
  },

  initCarouselLatestArticles(slider) {
    const carouselLatestArticles = slider.querySelector('.latest-articles-carousel');
    const carouselLatestArticleslides = slider.querySelectorAll('.latest-articles-item');

    if (!carouselLatestArticles) return;

    const carouselGliderLatestArticles = new Glider(carouselLatestArticles, {
      slidesToScroll: 1,
      slidesToShow: 1.3,
      draggable: true,
      dots: slider.querySelector('#dots-testimonials'),
      arrows: {
        prev: slider.querySelector('.glider-prev'),
        next: slider.querySelector('.glider-next'),
      },
      responsive: [
        {
          breakpoint: 576,
          settings: {
            slidesToShow: 'auto',
            slidesToScroll: 'auto',
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2.5,
          },
        },
        {
          breakpoint: 1240,
          settings: {
            slidesToShow: 3.5,
          },
        },
        {
          breakpoint: 1440,
          settings: {
            slidesToShow: 4.5,
          },
        },
      ],
    });

    if (carouselLatestArticleslides.length === 1) {
      this.hideCarouselDisabledControls(slider);
    }
  },

  /* Hide prev and next buttons if there is only 1 slide */
  hideCarouselDisabledControls(slider) {
    const navbuttons = slider.querySelectorAll('.glider-prev, .glider-next');

    navbuttons.forEach((button) => {
      button.hidden = true;
    });
  },

  /* Add automatic scroll to slider */
  slideAuto(slider, milliseconds) {
    const slidesPerPage = 1;
    const slideCount = slider.ele.querySelector('.glider-track').childElementCount;
    let slide = 0;

    window.setInterval(() => {
      if (slide < (slideCount - slidesPerPage)) {
        slide += slidesPerPage;
      } else {
        slide = 0;
      }
      slider.scrollItem(slide, false);
    }, milliseconds);
  },
};

gliderCarousel.init();
