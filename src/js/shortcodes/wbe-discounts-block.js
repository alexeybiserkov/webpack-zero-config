const wbeDiscountsBlock = {
  init() {
    const copyDiscountItems = document.querySelectorAll('.discount-coupon-code');

    copyDiscountItems.forEach((copyDiscountItem) => {
      this.initDiscountCopyHandlers(copyDiscountItem);
    });
  },

  initDiscountCopyHandlers(copyDiscountItem) {
    copyDiscountItem.addEventListener('click', (e) => {
      e.preventDefault();

      const body = document.querySelector('body');
      const currentDiscountBtn = e.currentTarget;
      const currentDiscountValue = currentDiscountBtn.querySelector('.discount-code').textContent;
      const tempInput = document.createElement('input');

      body.appendChild(tempInput);
      tempInput.value = currentDiscountValue;
      tempInput.select();

      // Method to copy the text content
      document.execCommand('copy');
      body.removeChild(tempInput);

      // show and hide the "copied" message
      currentDiscountBtn.classList.add('code-copied');

      if (currentDiscountBtn.classList.contains('code-copied')) {
        setTimeout(() => {
          currentDiscountBtn.classList.remove('code-copied');
        }, 5000);
      }
    });
  },
};

wbeDiscountsBlock.init();
