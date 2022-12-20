const ChartsManager = {
  windowWidth: document.documentElement.clientWidth,
  windowHeight: window.innerHeight,
  charts: [],

  getElementWidth(element, withPadding = true, withBorder = true, withMargin = false) {
    const style = window.getComputedStyle(element);
    let width = withBorder ? element.offsetWidth : element.clientWidth;

    if (!withPadding) {
      width -= parseFloat(style['padding-left']) + parseFloat(style['padding-right']);
    }
    if (withMargin) {
      width += parseFloat(style['margin-left']) + parseFloat(style['margin-right']);
    }

    return width;
  },

  getElementHeight(element, withPadding = true, withBorder = true, withMargin = false) {
    const style = window.getComputedStyle(element);
    let height = withBorder ? element.offsetHeight : element.clientHeight;

    if (!withPadding) {
      height -= parseFloat(style['padding-top']) + parseFloat(style['padding-bottom']);
    }
    if (withMargin) {
      height += parseFloat(style['margin-top']) + parseFloat(style['margin-bottom']);
    }

    return height;
  },

  getElementOffsetTop(element) {
    let result = element.offsetTop;
    while (element.offsetParent !== document.body) {
      element = element.offsetParent;
      result += element.offsetTop;
    }
    return result;
  },

  getElementOffsetLeft(element) {
    let result = element.offsetLeft;
    while (element.offsetParent !== document.body) {
      element = element.offsetParent;
      result += element.offsetLeft;
    }
    return result;
  },

  getElementRealWidth(element) {
    element.style.width = '';
    element.classList.remove('sticky');
    return element.getBoundingClientRect().width;
  },

  getElementRealLeftPosition(element) {
    element.style.left = '';
    element.classList.remove('sticky');
    return this.getElementOffsetLeft(element);
  },

  slideUp(target, duration = 500, callback = null) {
    const height = target.offsetHeight;

    target.style.height = `${height}px`;
    // Timeout is here to make collapsing animation work
    setTimeout(() => {
      target.classList.add('collapsed');
      target.style.removeProperty('height');
    }, 0);

    setTimeout(() => {
      if (typeof callback === 'function') {
        callback();
      }
    }, duration);
  },

  slideDown(target, duration = 500, callback = null) {
    target.classList.remove('collapsed');
    const height = target.offsetHeight;

    target.style.height = '0px';
    // Timeout is here to make expanding animation work
    setTimeout(() => {
      target.style.height = `${height}px`;
    }, 0);

    setTimeout(() => {
      if (typeof callback === 'function') {
        callback();
      }
    }, duration);
  },

  slideToggle(target, duration = 500, callback = null) {
    if (target.classList.contains('collapsed')) {
      return this.slideDown(target, duration, callback);
    }
    return this.slideUp(target, duration, callback);
  },

  init() {
    const chartElements = document.querySelectorAll('.bulli-horizontal-comp-chart');

    chartElements.forEach((chart) => {
      this.initChart(chart);
    });

    window.addEventListener('scroll', () => {
      this.scrollEvents();
    });

    window.addEventListener('resize', () => {
      this.windowWidth = document.documentElement.clientWidth;
      this.windowHeight = window.innerHeight;
      this.resizeEvents();
    });
  },

  initChart(chart) {
    this.charts.push(new TacoHorizontalComparisonChart(chart));
  },

  scrollEvents() {
    this.charts.forEach((chart) => {
      chart.scrollManagement();
    });
  },

  resizeEvents() {
    this.charts.forEach((chart) => {
      chart.setModal();
      chart.updateTabsInfo();
    });
  },
};

class TacoHorizontalComparisonChart {
  el;

  chartOffsetTop;

  chartFooterBottomOffset;

  chartCtasBottomOffset;

  chartHead;

  chartheadHeight;

  ctasRow;

  mobileMenu;

  switchBuildersModal;

  // Builder positions manager
  chartOrder = bulliHccPositions;

  // Current builder positions in the selector modal
  modalMenuPositions = [];

  maxNumberOfBuilders = 0;

  // This var is used across the tab click handlers and the menu item click handler
  currentPosition = -1;

  constructor(chart) {
    this.el = chart;

    this.chartHead = chart.querySelector('.chart-head');
    this.ctasRow = chart.querySelector('.cta-row .feature-values');
    this.mobileMenu = chart.querySelector('#mobile-switch-builders-menu');

    this.setup();
  }

  // get the total number of currently shown columns
  getNumberOfActiveColumns() {
    let count = 0; let
      i = 0;
    for (const key in this.chartOrder) {
      if (!this.chartOrder[key].hidden && i < this.maxNumberOfBuilders) {
        count++;
      }
      i++;
    }
    return count;
  }

  // Get the position of a builder in the chart
  getPosition(builderName) {
    for (const key in this.chartOrder) {
      if (builderName === this.chartOrder[key].name) {
        return parseInt(key);
      }
    }
    return -1;
  }

  // Get the current position in the selector modal of a builder
  getModalMenuPosition(builderName) {
    for (let i = 0; i < this.modalMenuPositions.length; i++) {
      if (builderName === this.modalMenuPositions[i].name) {
        return i;
      }
    }
    return -1;
  }

  // Update the builder positions in the selector modal
  setModalMenuPositions() {
    this.modalMenuPositions = [];
    const chartOrderValues = Object.keys(this.chartOrder).map((e) => this.chartOrder[e]);

    for (let i = 0; i < chartOrderValues.length; i++) {
      if (!chartOrderValues[i].hidden) {
        this.modalMenuPositions.push(chartOrderValues[i]);
      }
      if (i >= this.maxNumberOfBuilders - 1) {
        break;
      }
    }
  }

  // Adding a builder to the selection
  addBuilderToModalMenuPositions(builderName) {
    if (this.getModalMenuPosition(builderName) === -1 && this.maxNumberOfBuilders > this.modalMenuPositions.length) {
      this.modalMenuPositions.push(this.chartOrder[this.getPosition(builderName)]);
      return true;
    }
    return false;
  }

  // Removing a builder from the selection
  removeBuilderFromModalMenuPositions(builderName) {
    const pos = this.getModalMenuPosition(builderName);

    this.modalMenuPositions.splice(pos, 1);
  }

  // Sets the builder in the desired position, swapping the order with its current occupant
  changeBuilderPosition(builderName, destPosition) {
    const orgPosition = this.getPosition(builderName);
    const orgBuilder = this.chartOrder[orgPosition];
    const destBuilder = this.chartOrder[destPosition];

    // Change the order in the positions object
    this.chartOrder[orgPosition] = destBuilder;
    this.chartOrder[destPosition] = orgBuilder;

    // Change the order in the DOM: chart
    const featureValuesRows = this.el.querySelectorAll('.feature-values');

    featureValuesRows.forEach((row) => {
      const builderCells = row.querySelectorAll('.builder-cell');

      // just a reminder: NodeList returns 'undefined' for a non-existing index, so no problems here
      row.insertBefore(builderCells[orgPosition], builderCells[destPosition + 1]);
      row.insertBefore(builderCells[destPosition], builderCells[orgPosition + 1]);
    });

    // Set desktop and tablet menu positions
    this.setModalMenuPositions();
  }

  // Modify the mobile tab with the new builder information
  changeTabInfo(builderName, index) {
    const builderIndex = this.getPosition(builderName);
    const builder = this.chartOrder[builderIndex];
    const titleCells = this.el.querySelectorAll('.title-cell');
    const cell = titleCells[index];

    cell.querySelector('.builder-name').innerHTML = builder.title;
    if (builder.topChoice) {
      cell.classList.add('top-choice');
    } else {
      cell.classList.remove('top-choice');
    }
  }

  updateTabsInfo() {
    let key; let
      i = 0;
    for (key in this.chartOrder) {
      this.changeTabInfo(this.chartOrder[key].name, i);
      i++;
      if (i >= 2) break;
    }
  }

  // Hide the mobile menu
  closeMobileMenu() {
    this.currentPosition = -1;
    this.mobileMenu.style.display = 'none';
    const titleCells = this.el.querySelectorAll('.title-cell');

    titleCells.forEach((cell) => {
      cell.classList.remove('active-switch-menu');
    });
  }

  // Clean the changes of setMobileMenu()
  unsetMobileMenu() {
    this.mobileMenu.querySelectorAll('li').forEach((li) => {
      li.classList.remove('disabled');
      li.classList.remove('selected');
    });
  }

  // Remove the active class from all the mobile tabs except one
  deactivateAllMobileTabsExcept(exceptionPosition) {
    const tabs = this.el.querySelectorAll('#builder-tabs .title-cell');

    for (let i = 0; i < tabs.length; i++) {
      if (i !== exceptionPosition) {
        tabs[i].classList.remove('active-switch-menu');
      }
    }
  }

  // Show the mobile menu
  openMobileMenu() {
    this.mobileMenu.style.display = 'block';
  }

  // Change the classes of the mobile menu items to display the current state
  setMobileMenu(position) {
    const navItems = this.mobileMenu.querySelectorAll('li');

    let i; let
      builderName;
    for (i = 0; i < navItems.length; i++) {
      builderName = navItems[i].dataset.builderName;

      if (builderName === this.chartOrder[position].name) {
        navItems[i].classList.add('selected');
      } else if (this.getPosition(builderName) < 2) {
        navItems[i].classList.add('disabled');
      }
    }
  }

  // Set the max number of builders
  setMaxNumberOfBuilders() {
    if (ChartsManager.windowWidth >= 992) {
      this.maxNumberOfBuilders = 5;
    } else {
      this.maxNumberOfBuilders = 3;
    }
  }

  // Insert the maximum number of builders (3 on tablet, 5 on desktop) in the selector modal title
  displayMaxNumberOfBuilders() {
    this.el.querySelector('#number-of-builders').innerText = this.maxNumberOfBuilders;
  }

  // print the html to display the current selection of builders
  printSelectedBuildersModalMenu() {
    const container = this.el.querySelector('.modal-builders-menu .selection-cells');

    let i; let builder; let
      html = '';
    for (i = 0; i < this.maxNumberOfBuilders; i++) {
      html += '<div class="selection-cell">';
      html += `<div class="empty-cell">Column ${i + 1}</div>`;

      if (typeof this.modalMenuPositions[i] !== 'undefined') {
        builder = this.modalMenuPositions[i];
        html += `<div class="builder-cell active-cell ${builder.postName}${builder.topChoice ? ' top-choice' : ''}" data-builder-name="${builder.name}">`;
        html += `<span class="builder-name">${builder.title}</span>`;
        if (builder.mainFeature !== '') {
          html += `<span class="comparison-feature">${builder.mainFeature}</span>`;
        }
        html += `<a class="builder-close" href="#close-builder-${i}" data-eventlabel="close-builder-column">`
                    + '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" x="0" y="0" version="1.1" viewBox="0 0 114 114">'
                    + '<path fill="#555555" d="M110 4c5 5 6 13 1 19l-1 1-33 33L110 90c6 6 6 15 0 20-5 5-13 6-19 1L90 110 57 77 24 110c-6 6-15 6-20 0-5-5-6-13-1-19L4 90l33-33L4 24C-2 18-2 9 4 4 9-1 17-2 23 3l1 1 33 33L90 4c5-5 14-5 20 0"/>'
                    + '</svg></a>';

        html += '</div>';
      }
      html += '</div>';
    }
    container.innerHTML = html;
  }

  // Able/disable the compare button depending on the required number of builders to perform a comparison (2)
  setCompareButtonClass() {
    const compareButton = this.el.querySelector('[href="#apply-modal-builder-changes"]');
    if (this.modalMenuPositions.length >= 2) {
      compareButton.classList.add('active');
      compareButton.classList.remove('disabled');
    } else {
      compareButton.classList.add('disabled');
      compareButton.classList.remove('active');
    }
  }

  // print the html for the selection buttons of the modal in their current state
  printSelectBuildersModalMenu() {
    const container = this.el.querySelector('.modal-builders-menu .select-cells');

    let key; let builder; let
      html = '';
    for (key in this.chartOrder) {
      builder = this.chartOrder[key];

      html += '<div class="select-cell">';
      html += `<div class="${
        builder.postName
      }${this.getModalMenuPosition(builder.name) === -1 ? ' active-cell' : ' inactive-cell'
      }${builder.topChoice ? ' top-choice' : ''
      }" data-builder-name="${builder.name}">`;

      html += `<span class="builder-name">${builder.title}</span>`;
      if (builder.mainFeature !== '') {
        html += `<span class="comparison-feature">${builder.mainFeature}</span>`;
      }

      html += '</div>';
      html += '</div>';
    }
    container.innerHTML = html;
  }

  // Get the width of a column in the current layout of the table
  calculateColumnWidth() {
    this.el.querySelector('#horizontal-comparison-chart-content').style.width = '';
    const maxWidth = this.el.querySelector('#horizontal-comparison-chart').getBoundingClientRect().width;
    const featureTitleWidth = this.el.querySelector('.feature-title').getBoundingClientRect().width;
    const columnWidth = (maxWidth - featureTitleWidth) / this.maxNumberOfBuilders;

    return columnWidth;
  }

  // get the total number of currently shown columns
  getNumberOfActiveColumns() {
    let key; let count = 0; let
      i = 0;
    for (key in this.chartOrder) {
      if (!this.chartOrder[key].hidden && i < this.maxNumberOfBuilders) {
        count++;
      }
      i++;
    }
    return count;
  }

  // reduce/expand the chart width depending on the number columns
  adjustChartWidthOnColumns() {
    if (ChartsManager.windowWidth < 768) {
      this.el.querySelector('#horizontal-comparison-chart-wrapper').style.width = '';
    } else {
      const columnWidth = this.calculateColumnWidth();
      const featureTitleWidth = this.el.querySelector('.feature-title').getBoundingClientRect().width;
      const chartWidth = featureTitleWidth + this.getNumberOfActiveColumns() * columnWidth;

      this.el.querySelector('#horizontal-comparison-chart-wrapper').style.width = `${chartWidth}px`;

      // Move the 'add builder' placeholder column accordingly
      const placeHolderColumn = this.el.querySelector('#chart-placeholder-column');
      const placeHolderColumnMarginLeft = chartWidth - parseFloat(window.getComputedStyle(placeHolderColumn.parentNode)['padding-left']);

      placeHolderColumn.style['margin-left'] = `${placeHolderColumnMarginLeft}px`;
      placeHolderColumn.querySelector('.header').style.width = `${columnWidth - 28}px`;
    }

    // Update the width of the sticky elements
    this.setDimensionsAndOffset();
    this.scrollManagement();
  }

  // Update the selector modal with the current state
  setModal() {
    this.setMaxNumberOfBuilders();
    this.setModalMenuPositions();
    this.displayMaxNumberOfBuilders();
    this.printSelectBuildersModalMenu();
    this.printSelectedBuildersModalMenu();
    this.setCompareButtonClass();
    this.adjustChartWidthOnColumns();
  }

  // Hide and display columns
  hideColumn(builderName) {
    this.el.querySelector(`.logo-chart-head-row .title-cell[data-builder-name="${builderName}"]`).classList.add('hidden-column');
    this.el.querySelectorAll(`.feature-values .builder-cell[data-builder-name="${builderName}"]`).forEach((col) => {
      col.classList.add('hidden-column');
    });

    this.chartOrder[this.getPosition(builderName)].hidden = true;
  }

  // Hide all the builder columns in the table
  hideAllColumns() {
    this.el.querySelectorAll('.feature-values .builder-cell').forEach((cell) => {
      cell.classList.add('hidden-column');
    });
    this.el.querySelectorAll('.logo-chart-head-row .title-cell').forEach((cell) => {
      cell.classList.add('hidden-column');
    });

    for (const key in this.chartOrder) {
      this.chartOrder[key].hidden = true;
    }
    for (let i = 0; i < this.modalMenuPositions.length; i++) {
      this.modalMenuPositions[i].hidden = true;
    }
  }

  // Show the column o a particular builder in the table
  showColumn(builderName) {
    this.el.querySelector(`.logo-chart-head-row .title-cell[data-builder-name="${builderName}"]`).classList.remove('hidden-column');
    this.el.querySelectorAll(`.feature-values .builder-cell[data-builder-name="${builderName}"]`).forEach((col) => {
      col.classList.remove('hidden-column');
    });

    this.chartOrder[this.getPosition(builderName)].hidden = false;
  }

  applyModalMenuChanges() {
    const originModalMenuPositions = this.modalMenuPositions;

    this.hideAllColumns();
    for (let i = 0; i < originModalMenuPositions.length; i++) {
      this.changeBuilderPosition(originModalMenuPositions[i].name, i);
      this.showColumn(originModalMenuPositions[i].name);
    }
    this.adjustChartWidthOnColumns();
  }

  setup() {
    /**
         * Mobile menu behaviour
         */
    const mobileHeads = this.el.querySelectorAll('.mobile-chart-head-row .title-cell');

    // Leave only the first two builder tabs
    for (let i = 2; i < mobileHeads.length; i++) {
      mobileHeads[i].remove();
    }

    // Handle the click on a menu item
    this.el.querySelectorAll('.builders-mobile-menu li').forEach((li) => {
      li.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.currentTarget;

        if (!target.classList.contains('selected') && !target.classList.contains('disabled')) {
          const { builderName } = target.dataset;

          this.changeBuilderPosition(builderName, this.currentPosition);
          this.changeTabInfo(builderName, this.currentPosition);
          this.closeMobileMenu();
          this.unsetMobileMenu();
        }
      });
    });

    // Handle the click on a tab
    this.el.querySelectorAll('.switch-mobile-menu-button').forEach((btn, i) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cell = e.currentTarget;

        cell.classList.toggle('active-switch-menu');
        this.unsetMobileMenu();
        if (cell.classList.contains('active-switch-menu')) {
          this.currentPosition = i;
          this.deactivateAllMobileTabsExcept(i);
          this.setMobileMenu(i);
          this.openMobileMenu();
        } else {
          this.closeMobileMenu();
        }
      });
    });

    /**
         * Tablet and desktop menu
         */
    // Click on close button in the modal menu
    this.el.querySelector('.modal-builders-menu .selection-cells').addEventListener('click', (e) => {
      if (!e.target.closest('.modal-builders-menu .selection-cells .builder-close')) return;
      e.preventDefault();

      const builderCell = e.target.closest('.builder-cell');
      const { builderName } = builderCell.dataset;
      const selectCell = this.el.querySelector(`.modal-builders-menu .select-cells [data-builder-name="${builderName}"]`);

      this.removeBuilderFromModalMenuPositions(builderName);

      this.printSelectedBuildersModalMenu();
      this.setCompareButtonClass();

      selectCell.classList.add('active-cell');
      selectCell.classList.remove('inactive-cell');
    });

    this.setModal();

    /* Toggle the menu */
    this.switchBuildersModal = this.el.querySelector('#modal-switch-builders-menu');

    // Click on an 'update builders' or 'add builder' button
    this.el.querySelectorAll('[href="#modal-switch-builders-menu"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchBuildersModal.style.display = 'block';
      });
    });

    // Click on the selector modal overlay
    this.switchBuildersModal.querySelector('.overlay').addEventListener('click', (e) => {
      e.preventDefault();
      this.switchBuildersModal.style.display = 'none';
      this.setModal();
    });

    // Click on a close modal button
    this.el.querySelectorAll('[href="#cancel-modal-builder-changes"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchBuildersModal.style.display = 'none';
        this.setModal();
      });
    });

    // Click on a builder button in the select list
    this.el.querySelector('.modal-builders-menu .select-cells').addEventListener('click', (e) => {
      const target = e.target.closest('.modal-builders-menu .select-cells .active-cell');

      if (!target) return;
      e.preventDefault();

      const { builderName } = target.dataset;

      if (this.addBuilderToModalMenuPositions(builderName)) {
        this.printSelectedBuildersModalMenu();
        this.setCompareButtonClass();
        target.classList.remove('active-cell');
        target.classList.add('inactive-cell');
      }
    });

    // Click on the 'Compare' button
    this.el.querySelector('[href="#apply-modal-builder-changes"]').addEventListener('click', (e) => {
      e.preventDefault();
      if (e.currentTarget.classList.contains('active')) {
        this.applyModalMenuChanges();
        this.switchBuildersModal.style.display = 'none';
        this.setModal();
      }
    });

    // Click on the column header close button
    this.el.querySelector('.logo-chart-head-row').addEventListener('click', (e) => {
      if (!e.target.closest('.logo-chart-head-row a[href="#close-builder-column"]')) return;
      e.preventDefault();

      const { builderName } = e.target.closest('.title-cell').dataset;

      this.hideColumn(builderName);
      this.setModal();
      this.adjustChartWidthOnColumns();
    });

    /**
         * Collapse table sections
         */
    this.el.querySelectorAll('.section-title').forEach((title) => {
      title.insertAdjacentHTML('beforeend', '<button class="collapse-button" data-eventlabel="collapse-expand"><span class="icon-minus"></span></button>');

      title.addEventListener('click', (e) => {
        this.contentSectionCollapseHandler(e);
      });
    });
  }

  contentSectionCollapseHandler(e) {
    const feature_category_id = e.currentTarget.dataset.featureCategoryId;
    const section = this.el.querySelector(`#section_content_${feature_category_id}`);
    const icon = e.currentTarget.querySelector('.collapse-button span') || e.currentTarget.querySelector('.collapse-button i');

    icon.classList.toggle('icon-minus');
    icon.classList.toggle('icon-plus');

    ChartsManager.slideToggle(section, 300, () => {
      // We need to calculate again the height of the chart so the sticky divs behave properly
      this.setDimensionsAndOffset();

      // This little trick solves an issue: sticky divs disappear after collapsing sections until the user scroll
      window.scrollTo(window.pageXOffset, window.pageYOffset + 1);
    });
  }

  setDimensionsAndOffset() {
    const chartContent = this.el.querySelector('.chart-content');

    this.chartheadHeight = ChartsManager.getElementHeight(this.chartHead, false, false, false);
    this.chartOffsetTop = ChartsManager.getElementOffsetTop(chartContent);
    this.chartFooterBottomOffset = this.chartOffsetTop
                + ChartsManager.getElementHeight(this.el.querySelector('#horizontal-comparison-chart'), true, true, true);
    this.chartCtasBottomOffset = this.chartOffsetTop
                + ChartsManager.getElementHeight(chartContent, true, true, true)
                + ChartsManager.getElementHeight(this.el.querySelector('.feature-and-ctas'), true, true, true);

    this.chartHead.style.width = `${ChartsManager.getElementRealWidth(this.chartHead)}px`;
    this.ctasRow.style.width = `${ChartsManager.getElementRealWidth(this.ctasRow)}px`;
    this.ctasRow.style.left = `${ChartsManager.getElementRealLeftPosition(this.ctasRow)}px`;
  }

  scrollManagement() {
    const scrollTop = window.pageYOffset;
    const ghostColumnHeader = this.el.querySelector('.ghost-column .header');

    // The chart head will be sticky when reaching the window top
    if (scrollTop >= this.chartOffsetTop && scrollTop <= (this.chartFooterBottomOffset - this.chartheadHeight)) {
      this.chartHead.classList.add('sticky');

      // Add stickyness to the 'add builder'  header only if the placeholder column is shown
      if (this.getNumberOfActiveColumns() < this.maxNumberOfBuilders && ChartsManager.windowWidth > 767) {
        ghostColumnHeader.classList.add('sticky');
      } else {
        ghostColumnHeader.classList.remove('sticky');
      }
    } else {
      this.chartHead.classList.remove('sticky');
      ghostColumnHeader.classList.remove('sticky');
    }

    // The footer CTAs will be sticky at the bottom, but it needs a few adjustments depending on window width
    if (ChartsManager.windowWidth < 768) {
      // Mobile
      if (scrollTop >= (this.chartOffsetTop - ChartsManager.windowHeight / 3) && scrollTop <= (this.chartCtasBottomOffset - ChartsManager.windowHeight)) {
        this.ctasRow.classList.add('sticky');
      } else {
        this.ctasRow.classList.remove('sticky');
      }
    } else if (ChartsManager.windowWidth > 767 && ChartsManager.windowWidth < 992) {
      // Tablet
      if (scrollTop >= (this.chartOffsetTop - ChartsManager.windowHeight / 3) && scrollTop <= (this.chartCtasBottomOffset - ChartsManager.windowHeight) + 33) {
        this.ctasRow.classList.add('sticky');
      } else {
        this.ctasRow.classList.remove('sticky');
      }
    } else {
      // Desktop
      if (scrollTop >= (this.chartOffsetTop - ChartsManager.windowHeight / 3) && scrollTop <= (this.chartCtasBottomOffset - ChartsManager.windowHeight)) {
        this.ctasRow.classList.add('sticky');
      } else {
        this.ctasRow.classList.remove('sticky');
      }
    }
  }
}

ChartsManager.init();
