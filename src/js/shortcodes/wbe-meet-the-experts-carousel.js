const Glider = require('glider-js');

/* Experts carousel */
const expertsCarousel = {
  init() {
    const gliderContainers = document.querySelectorAll('.experts-glider-carousel');

    gliderContainers.forEach((container) => {
      this.initExeprtsCarousel(container);
    });
  },

  initExeprtsCarousel(container) {
    const carousel = container.querySelector('.meet-the-experts-carousel');
    const expertSlides = container.querySelectorAll('.wbe-meet-the-experts-item');

    new Glider(carousel, {
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: true,
      scrollLock: true,
      dots: container.querySelector('.dots-block'),
      arrows: {
        prev: container.querySelector('.glider-prev'),
        next: container.querySelector('.glider-next'),
      },
    });

    /* Hide prev-next buttons if there is only 1 slide */
    if (expertSlides.length === 1) {
      const buttons = container.querySelectorAll('.glider-prev, .glider-next');

      buttons.forEach((button) => {
        button.hidden = true; // eslint-disable-line no-param-reassign
      });
    }

    expertSlides.forEach((expertSlide) => {
      this.initExpertGalleryCarousel(expertSlide);
    });
  },

  initExpertGalleryCarousel(expertSlide) {
    /* Expert pop-up gallery */
    const carousel = expertSlide.querySelector('.experts-gallery-carousel');
    if (!carousel) return;

    const slider = new Glider(carousel, {
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: true,
      scrollLock: true,
      dots: expertSlide.querySelector('.inner-dots-block'),
      arrows: {
        prev: expertSlide.querySelector('.inner-glider-prev'),
        next: expertSlide.querySelector('.inner-glider-next'),
      },
    });

    /* Hide prev-next buttons if there is only 1 slide */
    const gallerySlides = expertSlide.querySelectorAll('.experts-gallery-carousel-item');

    if (gallerySlides.length === 1) {
      const buttons = expertSlide.querySelectorAll('.inner-glider-prev, .inner-glider-next');

      buttons.forEach((button) => {
        button.hidden = true; // eslint-disable-line no-param-reassign
      });
    }

    const galleryOpenBtn = expertSlide.querySelector('.expert-gallery-expand');
    const galleryCloseBtn = expertSlide.querySelector('.close-btn');

    galleryOpenBtn.addEventListener('click', (e) => {
      this.openGalleryCarousel(e, expertSlide, slider);
    });

    galleryCloseBtn.addEventListener('click', (e) => {
      this.closeGalleryCarousel(e, expertSlide, slider);
    });
  },

  openGalleryCarousel(e, expertSlide, slider) {
    expertSlide.querySelector('.experts-lightbox-section').classList.add('modal-gallery');
    document.body.classList.add('scroll-disabled');
    slider.refresh(true);
  },

  closeGalleryCarousel(e, expertSlide, slider) {
    expertSlide.querySelector('.experts-lightbox-section').classList.remove('modal-gallery');
    document.body.classList.remove('scroll-disabled');
    slider.refresh(true);
  },
};

expertsCarousel.init();
