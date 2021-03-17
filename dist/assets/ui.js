(function (d) {

  function FractalAxeA11yUI(){
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }

  FractalAxeA11yUI.prototype.run = function () {
    const iframe = document.querySelector('.Preview-iframe').contentWindow;

    iframe.postMessage({ message: 'a11yRun'});
  };

  FractalAxeA11yUI.prototype.receiveMessage = function (e) {

    if( e.data.message === 'a11yResults'){
      this.parseResults(e.data.results);
    }
  };

  FractalAxeA11yUI.prototype.parseResults = function (results) {
    const resultsContainer = document.querySelector('.axe-a11y__results');

    this.clearElement(resultsContainer);

    if( results.violations.length > 0){
      const title = `${results.violations.length} ${results.violations.length == 1 ? 'Violation' : 'Violations'}`;

      resultsContainer.innerHTML += this.buildGroup(title, 'violations', results.violations);
    }

    if( results.passes.length > 0){
      const title = `${results.passes.length} ${results.passes.length == 1 ? 'Pass' : 'Passes'}`;

      resultsContainer.innerHTML += this.buildGroup(title, 'passes', results.passes);
    }

    if( results.incomplete.length > 0){
      const title = `${results.incomplete.length} Incomplete`;

      resultsContainer.innerHTML += this.buildGroup(title, 'incomplete', results.incomplete);
    }
  };

  FractalAxeA11yUI.prototype.buildItem = function (item) {
    let tags = item.tags.map((tag) => {
      return `<li>${tag}</li>`;
    }).join('');

    return `
      <li class="axe-a11y__item">
        ${item.impact ? `<span class="axe-a11y__impact axe-a11y__impact--${item.impact}">${item.impact}</span>` : ``}

        <span class="axe-a11y__title">${item.help}</span>

        <p>${item.description}</p>

        <p><a href="${item.helpUrl}" target="_blank" aria-label="More info. Opens in a new tab." class="axe-a11y__cta">More info</a></p>

        <div class="axe-a11y__item-tags-wrapper">
          <span class="axe-a11y__subtitle">Tags</span>

          <ul class="axe-a11y__item-tags">
            ${tags}
          </ul>
        </div>
      </li>
    `
  };

  FractalAxeA11yUI.prototype.buildGroup = function (title, variation, data) {
    const elements = data.map((item) => {
      return this.buildItem(item);
    }).join('');

    return `
      <div class="axe-a11y__group axe-a11y__group--${variation}">
        <h2 class="axe-a11y__group-title">${title}</h2>
        <ul class="axe-a11y__items">${elements}</ul>
      </div>
    `;
  };

  FractalAxeA11yUI.prototype.clearElement = function (element) {
      while (element.firstChild) {
          element.removeChild(element.firstChild);
      }
      return element;
  };

  window.FractalAxeA11yUI = new FractalAxeA11yUI();
}(document));
