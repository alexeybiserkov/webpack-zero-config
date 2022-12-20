//-------------------------------------------------------
// Scorecard expandable cards:
// Expand/collapse content cards,
// Close button for tooltips
//-------------------------------------------------------

const scorecardExpandingContent = {
  expandAdditionalContent() {
    const showMoreLinks = document.querySelectorAll('.show-more');

    showMoreLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('btn-clicked');
        e.currentTarget.closest('.taco-scorecard-content').classList.toggle('expandable-content');
      });
    });
  },

  closeTooltip() {
    const closeTooltipButtons = document.querySelectorAll('.close-tooltip-btn');

    closeTooltipButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.currentTarget.closest('.tooltip-message').style.display = 'none';
      });
    });
  },
};

scorecardExpandingContent.closeTooltip();
scorecardExpandingContent.expandAdditionalContent();
