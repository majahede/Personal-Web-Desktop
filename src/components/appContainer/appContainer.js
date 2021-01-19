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
  float: left;
  border: solid #f3f3f3 3px;
  border-radius: 5px;
  z-index: 2;
}

.top-bar {
  padding: 5px;
  background-color: #f3f3f3;
 
}

.exit {
  height: 20px;
  width: 20px;
  
}

.main {
 padding: 10px;
}


</style>

<div class="container">
    <div class="top-bar">
    <button class ="exit"></button>
    </div>
  <div class="main"></div>
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
      this.exitButton = this.shadowRoot.querySelector('.exit')
      this.main = this.shadowRoot.querySelector('.main')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.topBar.addEventListener('mousedown', this.onDragStart)
      this.exitButton.addEventListener('click', event => {
        event.preventDefault()
      })

      this.appendApp()
    }

    /**
     * Appends the correct application to the container depending on class.
     */
    appendApp () {
      if (this.class === 'chat') {
        const chat = document.createElement('messages-app')
        this.main.appendChild(chat)
      } else if (this.class === 'memory') {
        const memory = document.createElement('memory-game')
        this.main.appendChild(memory)
      } else if (this.class === 'custom') {
        const custom = document.createElement('custom-app')
        this.main.appendChild(custom)
      }
    }

    /**
     * Make target element draggable.
     *
     * @param {object} event - Object containing the current position.
     */
    onDragStart (event) {
      if (event.target.classList.contains('exit')) {
        console.log('stäng')
        this.parentNode.remove()
      }
      console.log(event.target.parentNode)
      event.target.parentNode.style.position = 'absolute'
      event.target.parentNode.style.zIndex = 1000

      /**
       * Updates the current position of the element.
       *
       * @param {number} pageX - Current X-coordinate.
       * @param {number} pageY - Current Y-coordinate.
       */
      function moveElement (pageX, pageY) {
        event.target.parentNode.style.left = pageX - event.target.offsetWidth / 2 + 'px'
        event.target.parentNode.style.top = pageY - event.target.offsetHeight / 2 + 'px'
      }

      moveElement(event.pageX, event.pageY)

      /**
       * Updates the current position of the element.
       *
       * @param {object} event - Object containing the current position.
       */
      function onMouseMove (event) {
        event.target.parentNode.style.left = event.pageX - event.target.offsetWidth / 2 + 'px'
        event.target.parentNode.style.top = event.pageY - event.target.offsetHeight / 2 + 'px'
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
