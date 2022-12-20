const mainMenu = require('./components/main-menu');
const accordion = require('./components/accordion');

mainMenu.init();

accordion.init({
  accordionClass: 'wbe-sitemap-accordion',
  accordionCollapseControlClass: 'taco-accordion-collapse-control',
});
