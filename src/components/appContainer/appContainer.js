/**
 * The app container web component module.
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
  background-color: black;
  padding: 10px;
  float: left;
  position: aboslute;
  z-index: 1000;
}
</style>
<div class="container">
  <messages-app></messages-app>
</div>

`
/**
 * Define custom element.
 */
customElements.define('app-container',
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

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.addEventListener('mousedown', this.onDragStart)
    }

    /**
     * Make target element draggable.
     *
     * @param {object} event - Object containing the current position.
     */
    onDragStart (event) {
      event.target.style.position = 'absolute'
      event.target.style.zIndex = 1000

      function moveElement (pageX, pageY) {
        event.target.style.left = pageX - event.target.offsetWidth / 2 + 'px'
        event.target.style.top = pageY - event.target.offsetHeight / 2 + 'px'
      }

      moveElement(event.pageX, event.pageY)

      function onMouseMove (event) {
        event.target.style.left = event.pageX - event.target.offsetWidth / 2 + 'px'
        event.target.style.top = event.pageY - event.target.offsetHeight / 2 + 'px'
      }
      this.addEventListener('mousemove', onMouseMove)

      this.onmouseup = function () {
        this.removeEventListener('mousemove', onMouseMove)
        this.onmouseup = null
      }
    }
  }
)
