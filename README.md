# fractal-axe-a11y

This addon adds accessibility testing to your [Fractal](http://fractal.build) components using Axe.

## Installation

To install Fractal Axe A11y to your Fractal instance use:

```bash
npm i fractal-axe-a11y
```

## Configuration

1. Add the following lines to your `fractal.config.js` [project configuration](https://fractal.build/guide/project-settings.html):

```js
// require fractal theme
const mandelbrot = require('@frctl/mandelbrot');
const axeA11y = require('fractal-axe-a11y');

// configure theme
const theme = mandelbrot({ ... })

// Update theme config with a11y panel
axeA11y(theme);

// init theme
fractal.web.theme(theme);
```

2. Copy `preview-a11y.js` from package to Fractal public folder. Example using [Laravel Mix](https://laravel-mix.com/):

```js
mix.copy("node_modules/fractal-axe-a11y/preview-a11y.js", 'public/preview-a11y.js');
```

3. Include `preview-a11y.js` in Fractal `preview` template:

```twig
<script src="{{ '/preview-a11y.js' | path }}"></script>
```