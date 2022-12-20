const helpers = {
  /**
     * Dynamically create a script tag and place it in the <head>
     * @param src The script source
     */
  includeScriptTag(src) {
    const script = document.createElement('script');
    script.src = src;
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
    return script;
  },
};

module.exports = helpers;
