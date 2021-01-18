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
    display: block;
    height: 800px;
    width: 100%;
    background-color: blue;
    position: relative;
  }

.main {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  position: relative;
}

.footer {
  height: 70px;
  width: 100%;
  background-color: #4b4646;
}

button {
  background-color: coral;
  width: 50px;
  height: 50px;
  border-radius: 10px;
}

.icon  {
  font-size: 30px;
}

</style>
<div class = "main">
  <memory-game><memory-game>
</div>
<div class="footer">
  <button id="chat"></button>
  <button id="memory"></button>
  <button id="custom"></button>
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
      this.chatApp = this.shadowRoot.querySelector('#chat')
      this.main = this.shadowRoot.querySelector('.main')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.chatApp.addEventListener('click', () => this.openApp('chat'))
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
