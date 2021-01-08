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
  }

.main {
  height: 100%;
  width: 100%;
  background-color: #f5d5d5;
}

.footer {
  height: 70px;
  width: 100%;
  background-color: #4b4646;
}

</style>
<div class = "main">
<messages-app draggable="true"></messages-app>
<messages-app></messages-app>
</div>
<div class="footer"></div>


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
    }
  }
)
