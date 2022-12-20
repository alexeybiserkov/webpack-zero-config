const stickyCtaBar = {
  ctaBar: 0,
  entryElement: 0,
  ctaBarStickyOffset: 0,
  stickyLimit: 0,

  init() {
    this.ctaBar = document.getElementById('top-cta-bar');
    this.entryElement = document.getElementById('primary');

    if (this.ctaBar !== null && this.entryElement !== null) {
      this.dynamicSetup();

      window.addEventListener('resize', () => {
        this.dynamicSetup();
        this.switchStickyClass();
      });

      window.addEventListener('scroll', () => {
        this.setStickyLimit();
        this.switchStickyClass();
      });
    }
  },

  dynamicSetup() {
    this.ctaBarStickyOffset = this.ctaBar.offsetTop + 100;
    this.setStickyLimit();
  },

  setStickyLimit() {
    this.stickyLimit = this.entryElement.offsetTop
            + this.entryElement.clientHeight
            - window.innerHeight;
  },

  switchStickyClass() {
    if (
      window.pageYOffset > this.ctaBarStickyOffset
            && window.pageYOffset < this.stickyLimit
    ) {
      this.ctaBar.classList.add('js-is-sticky');
    } else {
      this.ctaBar.classList.remove('js-is-sticky');
    }
  },
};

module.exports = stickyCtaBar;
