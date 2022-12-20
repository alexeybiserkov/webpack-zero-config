//-------------------------------------------------------
// Expandable content cards:
// Expand/collapse content cards,
// Close button for tooltips
//-------------------------------------------------------
const expandingContentCard = {
  init() {
    const expandableContentCards = document.querySelectorAll('.taco-content-card');

    expandableContentCards.forEach((expandableCard) => {
      this.initExpandableCardHandler(expandableCard);
    });
  },

  initExpandableCardHandler(expandableCard) {
    const expandableButton = expandableCard.querySelector('.expandable-card-button');
    const tooltipBlock = expandableCard.querySelector('.trust-message');

    // Open/close Card content
    expandableButton.addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('btn-clicked');

      expandableCard.querySelector('.expandable-area').classList.toggle('area-opened');
    });

    if (expandableCard.contains(tooltipBlock)) {
      const closeBtn = tooltipBlock.querySelector('.close-tooltip-btn');

      // Show tooltip
      setTimeout(() => {
        tooltipBlock.classList.add('show');
      }, 2000);

      // Close tooltip
      closeBtn.addEventListener('click', () => {
        tooltipBlock.classList.remove('show');
      });
    }
  },
};

expandingContentCard.init();
