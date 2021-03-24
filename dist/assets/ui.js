(function (d) {
  function FractalAxeA11yUI(){
    this.loadData();

    window.addEventListener("message", this.receiveMessage.bind(this), false);
    window.addEventListener('a11yPanelLoad', this.loadData.bind(this), false);
  }

  FractalAxeA11yUI.prototype.run = function () {
    const iframe = document.querySelector('.Preview-iframe').contentWindow;

    iframe.postMessage({ message: 'a11yRun'});
  };

  FractalAxeA11yUI.prototype.receiveMessage = function (e) {

    if( e.data.message === 'a11yResults'){
      this.parseResults(e.data.results);

      this.saveData(e.data.results);
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

    this.initExpanders();
  };

  FractalAxeA11yUI.prototype.initExpanders = function (){
    const expanders = document.querySelectorAll('[data-a11y-expander]');

    expanders.forEach(item => {
      const trigger = item.querySelector('[data-a11y-expander-trigger]');
      const content = item.querySelector('[data-a11y-expander-content]');
      const contentInner = item.querySelector('[data-a11y-expander-content-inner]');

      trigger.addEventListener('click', (e) => {
        const isActive = item.classList.contains('axe-a11y__expander--active');
        const contentHeight = contentInner.clientHeight;

        if( isActive ){
          content.style.height = `${contentHeight}px`;
          item.classList.remove('axe-a11y__expander--active');

          setTimeout(() => {
            content.style.height = '';
          }, 1);
        }else{
          content.style.height = `${contentHeight}px`;

          setTimeout(() => {
            item.classList.add('axe-a11y__expander--active');

            content.style.height = ``;
          }, 300);
        }

        e.preventDefault();
      }, false);
    })
  };

  FractalAxeA11yUI.prototype.parseString = function (str){
    if(!str) return;

    return str.replace(/[&<>]/g,
      tag =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)).replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
  }

  FractalAxeA11yUI.prototype.buildItem = function (item) {
    const tags = item.tags.map((tag) => {
      return `<li>${this.parseString(tag)}</li>`;
    }).join('');


    const nodes = item.nodes.map((el) => {
      if( !el.failureSummary) return;

      return `
        <li>
          <p><code>${el.target}</code></p>

          ${el.impact ? `<span class="axe-a11y__impact axe-a11y__impact--${el.impact}">${this.parseString(el.impact)}</span>` : ``}

          ${el.failureSummary ? `<p>${this.parseString(el.failureSummary)}</p>` : ``}
        </li>
      `;
    }).join('');

    return `
    <li class="axe-a11y__item axe-a11y__expander" data-a11y-expander>
      <button class="axe-a11y__expander-trigger" data-a11y-expander-trigger>
        <span class="axe-a11y__expander-icon"></span>

        <span class="axe-a11y__expander-title">${this.parseString(item.help)}</span>

        ${item.impact ? `<span class="axe-a11y__impact axe-a11y__impact--${item.impact}">${this.parseString(item.impact)}</span>` : ``}
      </button>

      <div class="axe-a11y__expander-content" data-a11y-expander-content>
        <div class="axe-a11y__expander-content-inner" data-a11y-expander-content-inner>
          <p>${this.parseString(item.description)}</p>

          <p><a href="${item.helpUrl}" target="_blank" aria-label="More info. Opens in a new tab." class="axe-a11y__cta">More info</a></p>

          ${nodes ? `
            <div class="axe-a11y__item-nodes-wrapper">
              <span class="axe-a11y__subtitle">Issues</span>

              <ol class="axe-a11y__item-nodes">
                ${nodes}
              </ol>
            </div>
          ` : ``}

          <div class="axe-a11y__item-tags-wrapper">
            <span class="axe-a11y__subtitle">Tags</span>

            <ul class="axe-a11y__item-tags">
              ${tags}
            </ul>
          </div>
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

  FractalAxeA11yUI.prototype.setDate = function (date) {
    const latestDate = date ? new Date(date) : new Date();
    const parsedDate = latestDate.toLocaleDateString();
    const parsedTime = latestDate.toLocaleTimeString();
    const dateElement = document.querySelector('.axe-a11y__date');

    dateElement.innerHTML = `Last updated: ${parsedDate} - ${parsedTime}`;
  };

  FractalAxeA11yUI.prototype.loadData = function () {
    if(!window.localStorage) return;

    const storeId = this.getStoreId();

    const data = window.localStorage.getItem(storeId);

    if(!data) return;

    const parsedData = JSON.parse(data);

    this.setDate(parsedData.date);
    this.parseResults(parsedData.results);
  };

  FractalAxeA11yUI.prototype.saveData = function (data) {
    if(!window.localStorage) return;

    const storeId = this.getStoreId();
    const date = new Date();

    const storeData = {
      date,
      results: data
    };

    window.localStorage.setItem(storeId, JSON.stringify(storeData));

    this.setDate(date);
  };

  FractalAxeA11yUI.prototype.getStoreId = function () {
    const wrapper = document.querySelector('.Browser-axe-a11y');
    const entityId = wrapper.getAttribute('data-entity-id');
    const entityHandle = wrapper.getAttribute('data-entity-handle');

    return `fractal-a11y-${entityHandle}-${entityId}`;
  };

  window.FractalAxeA11yUI = new FractalAxeA11yUI();
}(document));
