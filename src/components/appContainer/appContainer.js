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

}
.container {
  display: block;
  background-color: black;
  float: left;
  border: solid #440f88 3px;
  border-radius: 5px;
}
.top-bar {
  padding: 5px;
  background-color: #440f88;
  border-bottom: 
}

button {
  height: 20px;
  width: 20px;
  position: relative;
  left: 390px;
 
}


</style>

<div class="container">
<div class="top-bar">
<button class ="exit"></button>
</div>
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
      this.container = this.shadowRoot.querySelector('.container')
      this.topBar = this.shadowRoot.querySelector('.top-bar')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.addEventListener('mousedown', this.onDragStart)
      if (this.class === 'chat') {
        const chat = document.createElement('messages-app')
        this.container.appendChild(chat)
      }
    }

    /**
     * Appends the correct application to the container depending on class.
     */
    appendApp () {
      if (this.class === 'chat') {
        const chat = document.createElement('messages-app')
        this.container.appendChild(chat)
      } else if (this.class === 'memory') {
        const memory = document.createElement('memory')
        this.container.appendChild(memory)
      } else if (this.class === 'custom') {
        const custom = document.createElement('custom-app')
        this.container.appendChild(custom)
      }
    }

    /**
     * Make target element draggable.
     *
     * @param {object} event - Object containing the current position.
     */
    onDragStart (event) {
      event.target.style.position = 'absolute'
      event.target.style.zIndex = 1000

      /**
       * Updates the current position of the element.
       *
       * @param {number} pageX - Current X-coordinate.
       * @param {number} pageY - Current Y-coordinate.
       */
      function moveElement (pageX, pageY) {
        event.target.style.left = pageX - event.target.offsetWidth / 2 + 'px'
        event.target.style.top = pageY - event.target.offsetHeight / 2 + 'px'
      }

      moveElement(event.pageX, event.pageY)

      /**
       * Updates the current position of the element.
       *
       * @param {object} event - Object containing the current position.
       */
      function onMouseMove (event) {
        event.target.style.left = event.pageX - event.target.offsetWidth / 2 + 'px'
        event.target.style.top = event.pageY - event.target.offsetHeight / 2 + 'px'
      }

      this.addEventListener('mousemove', onMouseMove)

      /**
       * Makes element stop moving when mouse button is released.
       *
       */
      this.onmouseup = function () {
        this.removeEventListener('mousemove', onMouseMove)
        this.onmouseup = null
      }
    }
  }
)
