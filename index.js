const path = require('path');

function setupAxeA11y(theme, opts) {
  const config = opts || {};

  // Test for the theme
  if ((typeof theme !== 'object') || (typeof theme.options !== 'function')) {
      throw new Error('Please provide a valid Fractal theme as first argument');
  }
  theme.addLoadPath(path.resolve(__dirname, 'dist', 'views'));
  theme.addStatic(path.resolve(__dirname, 'node_modules', 'axe-core'), 'axe-core');
  theme.addStatic(path.resolve(__dirname, 'dist', 'assets'), 'axe-a11y');

  const options = theme.options();

  options.scripts = [].concat(...(options.scripts || ['default'])).concat([
    `/axe-a11y/ui.js`
  ]);

  options.styles = [].concat(...(options.styles || ['default'])).concat(`/axe-a11y/ui.css`);

  if (options.panels.indexOf('a11y') < 0) {
      options.panels.push('a11y');
  }

  theme.options(options);
}

module.exports = setupAxeA11y;
