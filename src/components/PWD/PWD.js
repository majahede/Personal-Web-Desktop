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
    position: relative;
   
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
}

.icon  {
  font-size: 25px;
}

#custom {
  color: #ffc420;
  background-color: #01053f;
}

#memory {
  color: red;
  background-color: blue;
}

#chat {
  color: purple;
}

</style>
<div class = "main">
</div>
<div class="footer">
  <button id="chat"><ion-icon class="icon" name="chatbubble"></ion-icon></button>
  <button id="memory"><ion-icon class="icon" name="help"></ion-icon></button>
  <button id="custom"><ion-icon class="icon" name="logo-euro"></ion-icon>
</button>
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
      this.memoryApp = this.shadowRoot.querySelector('#memory')
      this.customApp = this.shadowRoot.querySelector('#custom')
      this.main = this.shadowRoot.querySelector('.main')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.chatApp.addEventListener('click', () => this.openApp('chat'))
      this.memoryApp.addEventListener('click', () => this.openApp('memory'))
      this.customApp.addEventListener('click', () => this.openApp('custom'))
      const applikation = document.createElement('app-container')
      applikation.class = 'custom'
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
