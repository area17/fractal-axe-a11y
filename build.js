const fs = require('fs');

try {
  const axe = fs.readFileSync('node_modules/axe-core/axe.js', 'utf8');
  const a11y = fs.readFileSync('src/a11y.js', 'utf8');
  fs.writeFileSync('assets/a11y.js', axe + '\n\n' + a11y);
  fs.copyFileSync('src/ui.css', 'assets/ui.css');
  fs.copyFileSync('src/ui.js', 'assets/ui.js');
  console.log('a11y written');
} catch (err) {
  console.error(err);
}
