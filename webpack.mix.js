// webpack.mix.js

let mix = require('laravel-mix');

mix.combine(["node_modules/axe-core/axe.js", "dist/assets/a11y.js"], 'preview-a11y.js');
