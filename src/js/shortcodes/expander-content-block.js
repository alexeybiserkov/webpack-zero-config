//----------------------------------------------------
// Expand/collapse content areas - Read more/less
//----------------------------------------------------

const expanderContentBlock = {
  init() {
    const buttons = document.querySelectorAll('.btn-trigger');
    buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.currentTarget.closest('.read-more-wrap').classList.toggle('active');
      });
    });
  },
};

expanderContentBlock.init();
