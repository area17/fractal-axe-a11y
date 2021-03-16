(function (d) {
  let active = false;

  function FractalAxeA11yTest() {
      this.element = document.querySelector('#component-preview');
      window.addEventListener("message", this.receiveMessage.bind(this), false);
    }

  FractalAxeA11yTest.prototype.run = function () {
    try {
      if (!active) {
        active = true;

        axe.run(this.element)
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
    }
  };

  window.FractalAxeA11yTest = new FractalAxeA11yTest();
}(document));
