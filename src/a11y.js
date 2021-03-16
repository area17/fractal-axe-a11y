import { document, window } from 'global';
import axe from 'axe-core';

let active = false;

function FractalAxeA11y(currentScript) {
    // var path = currentScript.getAttribute('src', 2).split('/');
    // this.apiUrl = 'https://tenon.io/api/';
    // this.apiKey = path[2];
    // this.publicUrl = atob(path[3]);
}

function getElement() {
  const componentRoot = document.querySelector('.Preview-iframe').contentDocument.querySelector('#component-preview');

  return componentRoot.children;
};

FractalAxeA11y.prototype.run = function (relUrl) {
  console.log('running')

  try {

    if (!active) {
      active = true;

      // document.querySelector('.Preview-iframe').onload = function() {
        console.log('myframe is loaded');

        const element = document.querySelector('.Preview-iframe').contentDocument.querySelector('#component-preview');

        let testElement = document.createElement('div');
        testElement.innerHTML = element.innerHTML;
        document.body.appendChild(testElement);

        axe.run(element)
          .then(results => {
              console.log(results);
              if (results.violations.length) {
              console.log(results);
              throw new Error('Accessibility issues found');
            }
          })
          .catch(err => {
            console.error('Something bad happened:', err.message);
          });
      // };
    }
  } catch (error) {
    console.log(error);
    // channel.emit(EVENTS.ERROR, error);
  } finally {
    active = false;
  }
};

console.log('we are go!');

// run();
// '{{ path(frctl.theme.urlFromRoute('preview', { handle: entity.handle })) }}'

window.AxeA11y = new FractalAxeA11y();
