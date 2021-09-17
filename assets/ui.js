(function (d) {
  function FractalAxeA11yUI() {

    let selectors = [];

    const run = function () {
      document.querySelector('.Preview-iframe').contentWindow.postMessage({ message: 'a11yRun'});
    };

    const receiveMessage = function (e) {
      if( e.data.message === 'a11yResults'){
        parseResults(e.data.results);

        saveData(e.data.results);
      }
    };

    const parseResults = function (results) {
      const resultsContainer = document.querySelector('.axe-a11y__results');

      clearElement(resultsContainer);

      if( results.violations.length > 0){
        const title = `${results.violations.length} ${results.violations.length == 1 ? 'Violation' : 'Violations'}`;

        resultsContainer.innerHTML += buildGroup(title, 'violations', results.violations);
      }

      if( results.passes.length > 0){
        const title = `${results.passes.length} ${results.passes.length == 1 ? 'Pass' : 'Passes'}`;

        resultsContainer.innerHTML += buildGroup(title, 'passes', results.passes);
      }

      if( results.incomplete.length > 0){
        const title = `${results.incomplete.length} Incomplete`;

        resultsContainer.innerHTML += buildGroup(title, 'incomplete', results.incomplete);
      }

      initExpanders();
      initHighlights();
    };

    const initHighlights = function (){
      const highlighters = document.querySelectorAll('[data-a11y-highlight]');

      highlighters.forEach(item => {
        item.addEventListener('change', (e) => {
          const el = e.target;
          if( el.checked){
            if(!selectors.includes(el.value)){
              selectors.push(el.value);
            }
          }else{
            selectors = selectors.filter(selector => selector !== el.value);
          }

          const linkedInputs = document.querySelectorAll(`[data-a11y-highlight][value="${parseString(el.value)}"]`);

          linkedInputs.forEach(linkedInput => (linkedInput.checked = el.checked));

          updateHighlightStyles();
        });
      });
    };

    const updateHighlightStyles = function (){
      document.querySelector('.Preview-iframe').contentWindow.postMessage({ message: 'a11yUpdateHighlight', selectors: selectors});
    };

    const initExpanders = function (){
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

            item.classList.add('axe-a11y__expander--active');

            setTimeout(() => {
              content.style.height = `auto`;
            }, 300);
          }

          e.preventDefault();
        }, false);
      })
    };

    const parseString = function (str){
      if(!str) return;

      return str.replace(/[&<>\'\"]/g,
        tag =>
          ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
          }[tag] || tag)).replace(/(\r\n|\n\r|\r|\n)/g, '<br>');
    }

    const buildItem = function (item) {
      const tags = item.tags.map((tag) => {
        return `<li>${parseString(tag)}</li>`;
      }).join('');


      const nodes = item.nodes.map((el) => {
        if( !el.failureSummary) return;

        return `
          <li>
            <div class="axe-a11y__node-header">
              <code>${parseString(el.target[0])}</code>

              <label class="axe-a11y__highlight">
                <span>Highlight</span>
                <input type="checkbox" name="highlight" value="${parseString(el.target[0])}" data-a11y-highlight />
              </label>
            </div>

            ${el.impact ? `<span class="axe-a11y__impact axe-a11y__impact--${el.impact}">${parseString(el.impact)}</span>` : ``}

            ${el.failureSummary ? `<p>${parseString(el.failureSummary)}</p>` : ``}
          </li>
        `;
      }).join('');

      return `
      <li class="axe-a11y__item axe-a11y__expander" data-a11y-expander>
        <button class="axe-a11y__expander-trigger" data-a11y-expander-trigger>
          <span class="axe-a11y__expander-icon"></span>

          <span class="axe-a11y__expander-title">${parseString(item.help)}</span>

          ${item.impact ? `<span class="axe-a11y__impact axe-a11y__impact--${item.impact}">${parseString(item.impact)}</span>` : ``}
        </button>

        <div class="axe-a11y__expander-content" data-a11y-expander-content>
          <div class="axe-a11y__expander-content-inner" data-a11y-expander-content-inner>
            <p>${parseString(item.description)}</p>

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

    const buildGroup = function (title, variation, data) {
      const elements = data.map((item) => {
        return buildItem(item);
      }).join('');

      return `
        <div class="axe-a11y__group axe-a11y__group--${variation}">
          <h2 class="axe-a11y__group-title">${title}</h2>
          <ul class="axe-a11y__items">${elements}</ul>
        </div>
      `;
    };

    const clearElement = function (element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      return element;
    };

    const setDate = function (date) {
      const latestDate = date ? new Date(date) : new Date();
      const parsedDate = latestDate.toLocaleDateString();
      const parsedTime = latestDate.toLocaleTimeString();
      const dateElement = document.querySelector('.axe-a11y__date');

      dateElement.innerHTML = `Last updated: ${parsedDate} - ${parsedTime}`;
    };

    const loadData = function () {
      if(!window.localStorage) return;

      const storeId = getStoreId();

      const data = window.localStorage.getItem(storeId);

      if(!data) return;

      const parsedData = JSON.parse(data);

      setDate(parsedData.date);
      parseResults(parsedData.results);
    };

    const saveData = function (data) {
      if(!window.localStorage) return;

      const storeId = getStoreId();
      const date = new Date();

      const storeData = {
        date,
        results: data
      };

      window.localStorage.setItem(storeId, JSON.stringify(storeData));

      setDate(date);
    };

    const getStoreId = function () {
      const wrapper = document.querySelector('.Browser-axe-a11y');
      const entityId = wrapper.getAttribute('data-entity-id');
      const entityHandle = wrapper.getAttribute('data-entity-handle');

      return `fractal-a11y-${entityHandle}-${entityId}`;
    };

    loadData();

    window.addEventListener('message', receiveMessage, false);
    window.addEventListener('a11yPanelLoad', loadData, false);

    return {
      run: run
    }
  }

  window.FractalAxeA11yUI = new FractalAxeA11yUI();
}(document));
