const ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key
const ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key
const TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key
const ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

const wbeMainMenu = {
  mainNav: document.querySelector('#main-nav'),
  mobile: window.matchMedia('only screen and (max-width: 767px)'),
  resizeTimer: false,
  items: [],
  setup: false,

  /**
     * Setup
     */
  init() {
    // Run it only when needed
    if (this.mainNav) {
      if (this.isMobile() !== true) {
        // Move items
        this.moveMenuItems();
      }
      // Events
      this.events();
    }
  },

  /**
     * Events
     */
  events() {
    const dropdowns = document.querySelectorAll('.dropdown');
    const dropdownMenuLinks = document.querySelectorAll('.dropdown-menu > li a');
    const navTogglers = document.querySelectorAll('#master-header .nav-toggle');

    dropdowns.forEach((dropdown) => {
      // Toggle dropdown menu on hover
      dropdown.addEventListener('mouseenter', (event) => {
        this.handleToggleDropdownMenu(event);
      });
      dropdown.addEventListener('mouseleave', (event) => {
        this.handleToggleDropdownMenu(event, true);
      });

      // Toggle dropdown menu on click
      dropdown.addEventListener('click', (event) => {
        this.handleToggleDropdownMenu(event);
      });

      // Open menu on key down
      dropdown.querySelector('.dropdown-toggle').addEventListener('keydown', (event) => {
        this.handleOpenMenuOnKeyDown(event);
      });
    });

    // Navigate menu UP/Down/Tab
    dropdownMenuLinks.forEach((link) => {
      link.addEventListener('keydown', (event) => {
        this.handleNavigationMenu(event);
      });
    });

    // Move menu items to More dropdown
    window.addEventListener('resize', (event) => {
      this.handleResizeScreen(event);
    });
    window.addEventListener('load', (event) => {
      this.handleResizeScreen(event);
    });

    // Mobile: Collapse main menus
    navTogglers.forEach((navToggle) => {
      navToggle.addEventListener('click', this.mobileToggleMainMenus);
    });
  },

  /**
     * Handle toggle dropdown menu
     */
  handleToggleDropdownMenu(event, force = false) {
    const dropdownButton = event.currentTarget.querySelector('.dropdown-toggle');

    this.toggleDropdown(dropdownButton, event, force);
  },

  /**
     * Handle open menu on key down for Web accessibility
     */
  handleOpenMenuOnKeyDown(event) {
    if (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const dropdownMenu = event.currentTarget.nextSibling;

    // Open menu
    if (event.currentTarget.getAttribute('aria-expanded') === 'false') {
      this.toggleDropdown(event.currentTarget);
      if (dropdownMenu) {
        if (!dropdownMenu.id) {
          dropdownMenu.id = `dropdown-menu-id-${Date.now()}`;
        }
        document.querySelector(`#${dropdownMenu.id} > li a`).focus();
      }
    }
  },

  /**
     * Handle Navigate menu UP/Down/Tab
     */
  handleNavigationMenu(event) {
    if (event.which !== ARROW_DOWN_KEYCODE
            && event.which !== ARROW_UP_KEYCODE
            && event.which !== TAB_KEYCODE
            && event.which !== ESCAPE_KEYCODE) {
      return;
    }

    const currentListItem = event.currentTarget.parentNode;

    if (!currentListItem.nextSibling && event.which === TAB_KEYCODE) {
      this.toggleDropdown(currentListItem.parentNode.previousSibling);
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.which === ARROW_DOWN_KEYCODE || event.which === TAB_KEYCODE) {
      if (currentListItem.nextSibling && currentListItem.nextSibling.firstChild) {
        currentListItem.nextSibling.firstChild.focus();
      }
    } else if (event.which === ARROW_UP_KEYCODE) {
      if (currentListItem.previousSibling && currentListItem.previousSibling.firstChild) {
        currentListItem.previousSibling.firstChild.focus();
      }
    } else if (event.which === ESCAPE_KEYCODE) {
      this.toggleDropdown(currentListItem.parentNode.previousSibling);
    }
  },

  /**
     * Handle resize event
     */
  handleResizeScreen() {
    if (this.isMobile() === false) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.moveMenuItems();
      }, 150);
    }
  },

  isMobile() {
    return this.mobile.matches;
  },

  /**
     * Toggle dropdown menu
     *
     * @param {object} event
     */
  toggleDropdown(dropdownButton, event, forceClose = false) {
    if (dropdownButton) {
      let expanded = dropdownButton.getAttribute('aria-expanded') === 'true';
      expanded = forceClose ? false : !expanded;
      // Toggle attribute
      dropdownButton.setAttribute('aria-expanded', expanded);
      if (expanded) {
        // Open the menu
        dropdownButton.nextSibling.classList.add('show');
      } else {
        // Close the menu
        dropdownButton.nextSibling.classList.remove('show');
      }
    }
  },

  /**
     * Mobile menu toggle
     */
  mobileToggleMainMenus() {
    const menu = document.querySelector(this.getAttribute('aria-controls'));
    const isExpanded = this.getAttribute('aria-expanded') === 'true' || false;
    const { defaultText } = this.dataset;
    const { collapsedText } = this.dataset;

    // Swap text on the Button toggle menu
    if (undefined !== collapsedText) {
      if (isExpanded) {
        this.querySelector('span').innerText = defaultText;
      } else {
        this.querySelector('span').innerText = collapsedText;
      }
    }

    if (menu) {
      // Force closing the secondary menu
      const secondaryMenuExpanded = document.querySelector('#sub-navigation .nav-toggle[aria-expanded="true"]');

      if (menu.id === 'navigation' && secondaryMenuExpanded) {
        secondaryMenuExpanded.click();
      }

      // Open navigation menu
      menu.classList.toggle('expanded');
    }
    this.setAttribute('aria-expanded', !isExpanded);
    document.body.classList.toggle('menu-expanded');
  },

  /**
     * Show / Hide elements of main navigation
     */
  moveMenuItems() {
    if (this.setup === false) {
      this.setMenuItems();
    }

    const mainNavMoreItem = this.mainNav.querySelector('.more');
    if (!mainNavMoreItem) {
      return;
    }

    let navWidth = this.getNavWidth();
    const availableSpace = this.getHeaderAvailableSpace();

    if (navWidth > availableSpace) {
      this.moveItemIntoMore();
      this.moveMenuItems();
    } else {
      let i; const
        itemsMovedIndices = [];
      for (i = 0; i < this.items.length; i++) {
        if (!this.items[i].visible) {
          itemsMovedIndices.push(i);
        }
      }

      for (i = 0; i < itemsMovedIndices.length; i += 1) {
        const index = itemsMovedIndices[i];
        const elementToMove = this.items[index];

        if (navWidth + elementToMove.width < availableSpace) {
          mainNavMoreItem.parentNode.insertBefore(elementToMove.object, mainNavMoreItem);
          navWidth += elementToMove.width;
          elementToMove.visible = true;
        }
      }
    }
  },

  /**
     * Move item into More dropdown
     *
     * @return {number}
     */
  moveItemIntoMore() {
    const indexLastElement = this.getIndexLastMenuItem();

    this.mainNav.querySelector('.more ul').prepend(this.items[indexLastElement].object);
    this.items[indexLastElement].visible = false;
  },

  /**
     * Get the last menu item to move into the More dropdown
     *
     * @return {number}
     */
  getIndexLastMenuItem() {
    let i;
    for (i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i].visible) {
        break;
      }
    }
    return i;
  },

  getElementWidth(element, withPadding = true, withBorder = true, withMargin = false) {
    const style = window.getComputedStyle(element);
    let width = withBorder ? element.offsetWidth : element.clientWidth;

    if (!withPadding) {
      width -= parseInt(style['padding-left']) + parseInt(style['padding-right']);
    }
    if (withMargin) {
      width += parseInt(style['margin-left']) + parseInt(style['margin-right']);
    }

    return width;
  },

  /**
     * Calculate space available on the site header wrapper
     *
     * @return {number}
     */
  getHeaderAvailableSpace() {
    const offset = 50;
    const headerWidth = this.getElementWidth(document.querySelector('.site-header-wrapper'), false, false, false);
    const logoWidth = this.getElementWidth(document.querySelector('.logo-wrapper'), true, true, true);
    const moreButtonWidth = this.getElementWidth(this.mainNav.querySelector('.more'), true, true, true);

    return headerWidth - moreButtonWidth - logoWidth - offset;
  },

  /**
     * Get navigation width based on the visible items
     *
     * @return {number}
     */
  getNavWidth() {
    const reducer = (accumulator, { width, visible }) => (visible === true ? accumulator + width : accumulator);

    return this.items.reduce(reducer, 0);
  },

  /**
     * Register header elements and menu items needed for the calculation
     *
     * @return {void}
     */
  setMenuItems() {
    this.setup = true;

    // Menu items
    if (!this.mainNav.id) {
      this.mainNav.id = `main-nav-id-${Date.now()}`;
    }

    const menuItems = document.querySelectorAll(`#${this.mainNav.id} > li:not(.more)`);

    menuItems.forEach((element) => {
      const obj = {
        /* eslint-disable */
                object: element,
                width: this.getElementWidth(element, true, true, true),
                visible: true,
            };
            this.items.push(obj);
        });
    },
};

module.exports = wbeMainMenu;