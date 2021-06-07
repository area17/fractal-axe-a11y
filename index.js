const path = require('path');

function setupAxeA11y(theme) {
  if ((typeof theme !== 'object') || (typeof theme.options !== 'function')) {
      throw new Error('Fractal Theme Config Missing');
  }

  theme.addLoadPath(path.resolve(__dirname, 'views'));
  theme.addStatic(path.resolve(__dirname, 'assets'), 'axe-a11y');

  const options = theme.options();

  options.scripts = [...(options.scripts || ['default']), '/axe-a11y/ui.js'];
  options.styles = [...(options.styles || ['default']), '/axe-a11y/ui.css'];

  if (options.panels.indexOf('a11y') < 0) {
      options.panels.push('a11y');
  }

  theme.options(options);
}

module.exports = setupAxeA11y;
