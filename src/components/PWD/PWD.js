/**
 * The Personal Web Desktop web component module.
 *
 * @author Maja Hedegärd <mh223pi@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
<style> 
:host {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    z-index: 1;
  }

.main {
  background-image: url(../images/color-2174045.png);
  background-size: cover;
  background-position: center;
  height: 94%;
  width: 100%;
  position: relative;
}

.footer {
  height: 6%;
  width: 100%;
  background-color: #f3f3f3;
}

button {
  box-shadow: 2px 2px 2px #dfdede;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid #dfdede;
  margin-top: 10px;
  margin-left: 10px;
  font-size: 25px;
  outline: none;
  cursor: pointer;
}


#currency {
  color: #ffc420;
  background-color: #01053f;
}

#memory {
  color: black;
  background-color: #ff9924;
}

#messages {
  background-color:  #440f88;
  font-size: 20px;
  margin-bottom: 20px;
}

</style>
<div class = "main">
</div>
<div class="footer">
  <button id="messages">💬</button>
  <button id="memory">?</button>
  <button id="currency">€</button>
</div>


`
/**
 * Define custom element.
 */
customElements.define('personal-web-desktop',
  /**
   * @class
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()
      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.messagesApp = this.shadowRoot.querySelector('#messages')
      this.memoryApp = this.shadowRoot.querySelector('#memory')
      this.currencyApp = this.shadowRoot.querySelector('#currency')
      this.main = this.shadowRoot.querySelector('.main')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.messagesApp.addEventListener('click', () => this.openApp('messages'))
      this.memoryApp.addEventListener('click', () => this.openApp('memory'))
      this.currencyApp.addEventListener('click', () => this.openApp('currency'))
      const applikation = document.createElement('app-container')
      applikation.class = 'messages'
      this.main.appendChild(applikation)
    }

    /**
     * Adds a new app container and sets a class attribute.
     *
     * @param {string} app - The class of the element to open.
     */
    openApp (app) {
      const application = document.createElement('app-container')
      application.class = app
      this.main.appendChild(application)
    }
  }
)
