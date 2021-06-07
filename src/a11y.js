(function (d) {
  let active = false;

  function FractalAxeA11yTest() {
    this.element = document.querySelector('[data-axe-test-target]') || document.documentElement;
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  }

  FractalAxeA11yTest.prototype.run = function () {
    try {
      if (!active) {
        active = true;

        axe.run(this.element.children)
          .then(results => {
            window.parent.postMessage({ message: 'a11yResults', results});
          })
          .catch(err => {
            console.error('Something bad happened:', err.message);
          });
      }
    } catch (error) {
      console.log(error);
      // channel.emit(EVENTS.ERROR, error);
    } finally {
      active = false;
    }
  };

  FractalAxeA11yTest.prototype.receiveMessage = function (e) {
    if( e.data.message === 'a11yRun'){
      this.run();
    }else if(e.data.message === 'a11yUpdateHighlight'){
      this.updateHighlightStyles(e.data.selectors);
    }
  };

  FractalAxeA11yTest.prototype.updateHighlightStyles = function (selectors){
    const stylesBlock = document.querySelector('[data-axe-a11y-highlight-styles]');

    console.log('update')

    if(stylesBlock){
      stylesBlock.remove();
    }

    if(selectors.length > 0){
      const style = document.createElement('style');
      style.setAttribute('data-axe-a11y-highlight-styles', '');

      style.innerHTML = `${selectors.join(',')} { outline: 3px dashed green; outline-offset: 8px; }`;

      document.head.appendChild(style);
    }
  };

  window.FractalAxeA11yTest = new FractalAxeA11yTest();
}(document));
