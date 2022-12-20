const featureDetailsModal = {
  openedFeatureID: null,

  doSetups() {
    const featureTitles = document.querySelectorAll('.feature-title');
    const closeModalButtons = document.querySelectorAll('[data-modal-close="true"]');
    const accordionSections = document.querySelectorAll('.modal-section-item');

    featureTitles.forEach((featureTitle) => {
      featureTitle.addEventListener('click', () => {
        this.openModal(featureTitle);
      });
    });

    closeModalButtons.forEach((closeModalBtn) => {
      closeModalBtn.addEventListener('click', () => {
        this.closeModal(closeModalBtn);
      });
    });

    accordionSections.forEach((section) => {
      this.collapseAccordion(section);
    });
  },

  openModal(openBtn) {
    const featureId = openBtn.getAttribute('data-feature-id');
    const thisFeature = document.querySelector(`#feature_details_${featureId}`);

    if (thisFeature) {
      // Show feature panel, Lock body scrolling, Focus exit button
      this.openedFeatureID = featureId;
      thisFeature.classList.add('active');
      document.body.classList.add('scroll-disabled');
      thisFeature.querySelector('.top-close-button').focus();
    }
  },

  closeModal(closeBtn) {
    // Hide modal feature panel, Unlock body scrolling
    closeBtn.closest('.feature-details-modal').classList.remove('active');
    document.body.classList.remove('scroll-disabled');

    // Focus related button within chart
    setTimeout(() => {
      document.querySelector(`.feature-title[data-feature-id="${featureDetailsModal.openedFeatureID}"]`).focus();
    }, 300);
  },

  collapseAccordion(section) {
    // Open/close Expandable area
    const expandArea = section.querySelector('.taco-expand-area');

    if (expandArea !== null) {
      const expandButton = section.querySelector('.taco-expand-button');

      expandButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.currentTarget.ariaExpanded = e.currentTarget.ariaExpanded === 'false' ? 'true' : 'false';
        expandArea.classList.toggle('closed');
      });
    }
  },
};

featureDetailsModal.doSetups();
