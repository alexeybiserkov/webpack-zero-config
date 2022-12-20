const toolTipGlobal = {

  /**
     * Main.
     * The only method which should be used in client code
     *
     * @param  {Element}  tooltip HTML Element that contains tooltip data
     * @param  {NodeList} holders List of HTML Elements tooltip assignet to
     * @param  {array}    closeBtnClasses List of classes for 'close' buttons
     * @return {void}
     */
  init(tooltip, holders, closeBtnClasses = []) {
    this.tooltip = tooltip;
    this.holders = holders;
    this.closeBtnClasses = closeBtnClasses;

    this.tipHeight = this.tooltip.getBoundingClientRect().height;

    this.overlay = this._createOverlayEl();
    document.body.appendChild(this.overlay);

    this._assignTooltip();
  },

  /**
     * @return {Element} HTML Element
     */
  _createOverlayEl() {
    const overlay = document.createElement('div');
    overlay.classList.add('expert-tip-overlay');

    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.zIndex = '40';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, .45)';

    return overlay;
  },

  /**
     * Assigns tooltip element to list of pre-selected nodes
     *
     * @return {void}
     */
  _assignTooltip() {
    for (const holder of this.holders) {
      if (!this._isDesktop()) {
        // mobile/tablet devices
        holder.addEventListener('click', this._showToolTip);
      } else {
        // desktop
        holder.addEventListener('mouseenter', this._showToolTip);
        holder.addEventListener('mouseleave', this._hideToolTip);
      }

      if (!this._isDesktop()) {
        for (const btnClass of this.closeBtnClasses) {
          const closeBtn = this.tooltip
            .getElementsByClassName(btnClass)
          // only one button should work
            .item(0);

          if (closeBtn) {
            closeBtn.addEventListener('click', this._hideToolTip);
          }
        }
      }
    }
  },

  /**
     * Calculates the position and displays tooltip
     *
     * @param  {Event} event DOM Event
     * @return {void}
     */
  _showToolTip(event) {
    const { top, left } = toolTipGlobal._calculatePosition(event.target);

    toolTipGlobal._show(top, left);
  },

  /**
     * Hides tooltip
     *
     * @return {void}
     */
  _hideToolTip() {
    toolTipGlobal._hide();
  },

  /**
     * Calculates the position of top-left coner of the tooltip
     *
     * @param  {Element} elem HTML Element invoking tooltip
     * @return {object}  Coordinates of top-left coner of the tooltip { top, left }
     */
  _calculatePosition(elem) {
    const sizes = elem.getBoundingClientRect();

    const holderTop = Math.floor(sizes.top + sizes.height / 2);
    const holderRight = sizes.right;

    const top = `${Math.floor(holderTop + window.scrollY - this.tipHeight / 2)}px`;
    const left = `${holderRight + 20}px`;

    return { top, left };
  },

  /**
     * @param  {number} top  Top coordinate
     * @param  {number} left Left coordinata
     * @return {void}
     */
  _show(top, left) {
    if (!this._isDesktop()) {
      this._enableOverlay();
    }

    this.tooltip.style.visibility = 'visible';

    this.tooltip.style.top = top;
    this.tooltip.style.left = left;
  },

  /**
     * @return {void}
     */
  _hide() {
    this.tooltip.style.visibility = 'hidden';

    if (!this._isDesktop()) {
      this._disableOverlay();
    }
  },

  /**
     * @return {Boolean} True if screen's width is greater
     *                   than desktop breakpoint
     */
  _isDesktop() {
    return (window.screen.width >= 1025);
  },

  /**
     * @return {void}
     */
  _enableOverlay() {
    document.body.style.overflow = 'hidden';
    this.overlay.style.display = 'block';
  },

  /**
     * @return {void}
     */
  _disableOverlay() {
    document.body.style.overflow = 'auto';
    this.overlay.style.display = 'none';
  },
};

module.exports = toolTipGlobal;
