const wbeTabs = {
  init() {
    const tabSections = document.querySelectorAll('.tabgroup');

    tabSections.forEach((tabSection) => {
      this.tabsToggleHandler(tabSection);
    });
  },

  tabsToggleHandler(tabSection) {
    const tabButtons = tabSection.querySelectorAll('[data-tabgroup][data-toggletab]');

    tabButtons.forEach((tabBtn) => {
      tabBtn.addEventListener('click', (e) => {
        const clickedControl = e.currentTarget;
        const tabGroup = clickedControl.getAttribute('data-tabgroup');

        // Tab ID number
        const tab = clickedControl.getAttribute('data-toggletab');

        // Tab to show
        const activedTab = document.querySelector(`[data-tabgroup=${tabGroup}][data-tab=${tab}]`);

        // Toggle tabs
        tabSection.querySelector('.tab.active').classList.remove('active');
        tabSection.querySelector('.tabpanel.active').classList.remove('active');
        clickedControl.classList.add('active');
        activedTab.classList.add('active');
      });
    });
  },
};

wbeTabs.init();
