const Glider = require('glider-js');

/* Content Gallery carousel */
const galleryCarousel = {
  init() {
    const gliderContainers = document.querySelectorAll('.content-gallery');

    gliderContainers.forEach((gliderContainer) => {
      this.initGalleryCarousel(gliderContainer);
    });
  },

  initGalleryCarousel(gliderContainer) {
    const carousel = gliderContainer.querySelector('.content-gallery-carousel');
    const carouselSlides = gliderContainer.querySelectorAll('.content-gallery-carousel-item');
    const closeBtn = gliderContainer.closest('.gallery-lightbox-wrapper').querySelector('.close-btn');

    if (!carousel) return;

    const carouselGlider = new Glider(carousel, {
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: true,
      scrollLock: true,
      dots: gliderContainer.querySelector('.gallery-dots-block'),
      arrows: {
        prev: gliderContainer.querySelector('.glider-prev'),
        next: gliderContainer.querySelector('.glider-next'),
      },
    });

    /* Hide prev-next buttons if there is only 1 slide */
    if (carouselSlides.length === 1) {
      const buttons = gliderContainer.querySelectorAll('.glider-prev, .glider-next');

      buttons.forEach((button) => {
        button.hidden = true; // eslint-disable-line no-param-reassign
      });
    }

    if (window.screen.width >= 767) {
      carouselSlides.forEach((carouselSlide) => {
        const slideImage = carouselSlide.querySelector('.item-img-wrapper');

        slideImage.addEventListener('click', (e) => {
          this.openGalleryCarousel(e, carouselSlide, carouselGlider);
        });
      });

      closeBtn.addEventListener('click', (e) => {
        this.closeGalleryCarousel(e, carousel, carouselGlider);
      });
    }
  },

  openGalleryCarousel(e, slide, slider) {
    slide.closest('.gallery-lightbox-section').classList.add('modal-gallery');
    document.body.classList.add('scroll-disabled');
    slider.refresh(true);
  },

  closeGalleryCarousel(e, carousel, slider) {
    carousel.closest('.gallery-lightbox-section').classList.remove('modal-gallery');
    document.body.classList.remove('scroll-disabled');
    slider.refresh(true);
  },
};

galleryCarousel.init();
