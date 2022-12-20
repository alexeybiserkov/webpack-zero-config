const accordion = {
  defaults: {
    accordionClass: '',
    accordionSectionClass: 'accordion-section',
    accordionCollapseControlClass: 'accordion-collapse-control',
  },
  init(options) {
    options = { ...this.defaults, ...options };
    const accordions = document.querySelectorAll(`.${options.accordionClass}`);

    accordions.forEach((accordion) => {
      accordion.classList.add('js-active');
    });

    const collapseControlButtons = document.querySelectorAll(`.${options.accordionCollapseControlClass}`);
    const buttonLabel = 'Expand / Collapse';
    const icon = `<span class="collapse-accordion" aria-label="${buttonLabel}"></span>`;

    collapseControlButtons.forEach((button) => {
      button.setAttribute('aria-label', buttonLabel);
      button.innerHTML += icon;
      button.addEventListener('click', (e) => {
        e.preventDefault();

        const thisSection = button.closest(`.${options.accordionSectionClass}`);
        const thisAccordionSections = button.closest(`.${options.accordionClass}`).querySelectorAll(`.${options.accordionSectionClass}`);

        if (thisSection.classList.contains('expanded')) {
          thisSection.classList.remove('expanded');
        } else {
          thisAccordionSections.forEach((section) => {
            section.classList.remove('expanded');
          });
          thisSection.classList.add('expanded');
        }
      });
    });
  },
};

module.exports = accordion;
