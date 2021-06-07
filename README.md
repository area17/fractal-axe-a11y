# fractal-axe-a11y

This addon adds accessibility testing to your [Fractal](http://fractal.build) components using Axe.

## Installation

To install Fractal Axe A11y to your Fractal instance use:

```bash
npm install @area17/fractal-axe-a11y
```

## Configuration

1. Add the following lines to your `fractal.config.js` [project configuration](https://fractal.build/guide/project-settings.html):

```js
// require fractal theme
const mandelbrot = require('@frctl/mandelbrot');
const axeA11y = require('@area17/fractal-axe-a11y');

// configure theme
const theme = mandelbrot({ ... })

// Update theme config with a11y panel
axeA11y(theme);

// init theme
fractal.web.theme(theme);
```

2. Include `preview-a11y.js` in Fractal `preview` template:

```handlebars
<script src="{{ path '/axe-a11y/a11y.js' }}"></script>
```

3. Optionally - To test *just* the component and not the entire preview page, add a data attribute of `data-axe-test-target` to your `preview` template to the container of your main yield:

```handlebars
<main data-axe-test-target>
  {{{ yield }}}
</main>
```
