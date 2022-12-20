const smoothScrolling = {
  init() {
    const anchorLinks = document.querySelectorAll('a[href*="#"]');
    anchorLinks.forEach((anchorLink) => {
      if (
        !this.isAnchorOnThisPage(anchorLink)
                || this.isScrollingPrevented(anchorLink)
      ) {
        return;
      }

      const scrollMargin = this.getScrollMargin(anchorLink);

      anchorLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (anchorLink.hash) {
          this.scrollTo(document.querySelector(anchorLink.hash), scrollMargin);
        } else {
          /* Scroll to the top */
          this.scrollTo(document.body, 0);
        }
      });
    });
  },

  isAnchorOnThisPage(anchorLink) {
    return (
      window.location.pathname.replace(/^\//, '') === anchorLink.pathname.replace(/^\//, '')
            && window.location.hostname === anchorLink.hostname
    );
  },

  isScrollingPrevented(anchorLink) {
    return anchorLink.dataset.scroll === 'prevent';
  },

  getScrollMargin(anchorLink) {
    let scrollMargin = Number.parseInt(anchorLink.dataset.tacoScrollMargin, 10);
    if (Number.isNaN(scrollMargin)) {
      scrollMargin = 0;
    }
    return scrollMargin;
  },

  scrollTo(target, scrollMargin) {
    // TODO: This is so horrible because the stupid Safari can't adopt the css scroll-behaviour property.
    // This is a monstrous port of the jQuery animation with steps. We should use browser APIs instead.
    // It's because the scroll distance needs to be rechecked because of potential layout shifts along the way,
    // so we can't use a simple .scrollTo({ ... behaviour: 'smooth' }).
    // If the folks at Apple decide to adopt that or el.scrollIntoView, we can remove this c̶r̶a̶p̶ complex method.
    // Either that or we stop caring about Safari

    if (!target) return;
    const originalTopDistance = this.distanceToTop(target) - scrollMargin;
    const animationDuration = 400;
    const fps = 60;
    const interval = setInterval(() => {
      const topDistance = this.distanceToTop(target) - scrollMargin;

      // Calculate the distance to move in an animation frame. It can't be larger than the remaining distance
      // Accounts for positive distances (scroll down) or negative (scroll up)
      let frameDistance = originalTopDistance / (animationDuration / (1000 / fps));
      if (originalTopDistance > 0) {
        frameDistance = topDistance > frameDistance ? frameDistance : topDistance;
      } else if (originalTopDistance < 0) {
        frameDistance = topDistance < frameDistance ? frameDistance : topDistance;
      }

      window.scrollBy({ top: frameDistance, left: 0, behavior: 'auto' });

      if (topDistance < 10 && topDistance > -10) {
        clearInterval(interval);
      }
    }, 1000 / fps);
  },

  distanceToTop(element) {
    return Math.floor(element.getBoundingClientRect().top);
  },
};

module.exports = smoothScrolling;
