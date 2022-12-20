// TODO merge this and sticky-top-bar together

const reviewStickyCta = {
  reviewBar: 0,
  entryElement: 0,
  reviewBarStickyOffset: 0,
  stickyLimit: 0,

  init() {
    this.staticSetup();

    if (!(this.reviewBar && this.entryElement)) {
      return;
    }

    this.dynamicSetup();

    window.addEventListener('resize', () => {
      this.dynamicSetup();
      this.switchStickyClass();
    });

    window.addEventListener('scroll', () => {
      if (window.innerWidth >= 576) {
        this.setStickyLimit();
        this.switchStickyClass();
      }
    });
  },

  staticSetup() {
    this.reviewBar = document.querySelector('#top-review-bar');
    this.entryElement = document.querySelector('#primary');
  },

  dynamicSetup() {
    this.reviewBarStickyOffset = this.reviewBar.offsetTop + 100;
    this.setStickyLimit();
  },

  setStickyLimit() {
    this.stickyLimit = this.entryElement.offsetTop
            + this.getElementHeight(this.entryElement, false, false, false)
            - window.innerHeight;
    if (!this.reviewBar.classList.contains('js-is-sticky')) {
      this.stickyLimit -= this.getElementHeight(this.reviewBar);
    }
  },

  switchStickyClass() {
    if (
      window.pageYOffset > this.reviewBarStickyOffset
            && window.pageYOffset < this.stickyLimit
    ) {
      this.reviewBar.classList.add('js-is-sticky');
    } else {
      this.reviewBar.classList.remove('js-is-sticky');
    }
  },

  getElementHeight(element, withPadding = true, withBorder = true, withMargin = false) {
    const style = window.getComputedStyle(element);
    let height = withBorder ? element.offsetHeight : element.clientHeight;

    if (!withPadding) {
      height -= parseInt(style['padding-top']) + parseInt(style['padding-bottom']);
    }
    if (withMargin) {
      height += parseInt(style['margin-top']) + parseInt(style['margin-bottom']);
    }

    return height;
  },
};

module.exports = reviewStickyCta;
