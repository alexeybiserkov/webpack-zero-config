const sidebarDetached = {

  /**
     * Main
     *
     * @param  {Element}              element         HTML element. Represents a sidebar
     * @param  {HTMLCollection|array} showBtns        Collection of buttons used to show the sidebar
     * @param  {HTMLCollection|array} hideBtns        Collection of buttons used to hide the sidebar
     * @param  {string}               activeClassName Name of class to make the sidebar 'active'
     * @return {void}
     */
  init(element, showBtns, hideBtns, activeClassName) {
    this.element = element;
    this.activeClassName = activeClassName;
    this.showBtns = showBtns;
    this.hideBtns = hideBtns;

    this._attachEvents();
  },

  /**
     * Sidebar is shown by the method call.
     * Can be called in the client code.
     *
     * @return {void}
     */
  show() {
    document.body.style.overflow = 'hidden';
    sidebarDetached.element.style.display = 'block';

    // To make css:opacity work
    setTimeout(
      () => sidebarDetached
        .element
        .classList
        .add(sidebarDetached.activeClassName),
      100,
    );
  },

  /**
     * Sidebar is hidden by the method call.
     * Can be called in the client code.
     *
     * @return {void}
     */
  hide() {
    document.body.style.overflow = 'auto';
    sidebarDetached.element.style.display = 'none';

    sidebarDetached
      .element
      .classList
      .remove(sidebarDetached.activeClassName);
  },

  /**
     * Assigns show/hide events to buttons
     *
     * @return {void}
     */
  _attachEvents() {
    for (const el of this.showBtns) {
      el.addEventListener('click', this.show);
    }

    for (const el of this.hideBtns) {
      el.addEventListener('click', this.hide);
    }
  },

};

module.exports = sidebarDetached;
