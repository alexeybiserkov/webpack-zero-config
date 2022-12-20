const toolTipGlobal = require('./components/tool-tip-global');
const sidebarDetached = require('./components/sidebar-detached');

// Tooltip
const toolTip = document.getElementById('expert-tip-global');
const holders = document.getElementsByClassName('expert-tip-holder');
const closeBtnClasses = ['close-expert-tip-btn', 'close-tip-btn'];

toolTipGlobal.init(toolTip, holders, closeBtnClasses);

// Sidebar
const sidebar = document
  .getElementById('ppc-sidebar')
  .getElementsByClassName('sidebar-info-wrapper').item(0);

const showBtns = document.getElementsByClassName('show-sidebar');
const hideBtns = sidebar.getElementsByClassName('close-sidebar-btn');

sidebarDetached.init(sidebar, showBtns, hideBtns, 'sidebar-active');
