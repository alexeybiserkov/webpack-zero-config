const sidebarExtended = {
  contentSections: document.querySelectorAll('.taco-content-section'),
  sectionMenuLinks: document.querySelectorAll('.taco-section-menu a'),

  init() {
    const sidebarSections = document.querySelectorAll('.sidebar-section');

    sidebarSections.forEach((sidebarSection) => {
      if (typeof sidebarSection === 'undefined') { return; }

      this.toggleSidebarSection(sidebarSection);
    });

    this.checkSidebarNav();

    if (window.screen.width >= 768) {
      this.highlightActiveMenuItems();
    }
  },

  highlightActiveMenuItems() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.sectionMenuLinks.forEach((sectionMenuLink) => {
            sectionMenuLink.className = '';

            if (sectionMenuLink.hash === `#${entry.target.id}`) {
              sectionMenuLink.className = 'active';
            }
          });
        }
      });
    }, { rootMargin: '0px 0px -150px 0px' });

    this.contentSections.forEach((contentSection) => {
      observer.observe(contentSection);
    });
  },

  toggleSidebarSection(sidebarSection) {
    const btnShowMore = sidebarSection.querySelector('.btn-show-more');
    if (typeof btnShowMore === 'undefined') { return; }

    btnShowMore.addEventListener('click', () => {
      sidebarSection.classList.toggle('expanded');
    });
  },

  checkSidebarNav() {
    const sidebarMenu = document.querySelector('.taco-section-menu');

    if (typeof sidebarMenu !== 'undefined' && sidebarMenu !== null) {
      document.querySelector('.sidebar-content-menu').classList.add('has-navigation');
    }
  },
};

module.exports = sidebarExtended;
