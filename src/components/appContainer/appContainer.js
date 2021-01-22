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
  position: relative;
}
.container {
  background-color: white;
  display: block;
  float: left;
  border: solid #dfdede 2px;
  border-radius: 5px;
  position: absolute;
  z-index: 5;
}

.top-bar {
  padding: 3px;
  background-color: #f3f3f3;
  position: relative;
  height: 18px;
  z-index: 6;
} 

.exit {
  height: 18px;
  width: 18px;
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
}

.hold {

}


</style>

<div class="container" tabindex ="-1">
    <div class="top-bar">
    <button class ="exit">X</button>
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
      document.addEventListener('mousedown', event => {
        this.onDragStart(event)
      }, false)
      this.appendApp()
      this.container.addEventListener('focus', (event) => {
        event.target.style.zIndex = 1000
      })
      this.container.addEventListener('blur', (event) => {
        event.target.style.zIndex = 500
      })
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
      console.log(event)
      const target = event.path[0]
      if (target.classList.contains('exit')) {
        const topbar = target.parentNode
        topbar.parentNode.remove()
      }

      if (target === this.topBar) {
        const shiftX = event.clientX - target.parentNode.getBoundingClientRect().left
        const shiftY = event.clientY - target.parentNode.getBoundingClientRect().top

        /**
         * Updates the current position of the element.
         *
         * @param {object} event - Object containing the current position.
         */
        function onMouseMove (event) {
          if ((event.clientY + 150 > window.innerHeight) || (event.clientX + 100 > window.innerWidth) ||
          (event.clientY < 0) || (event.clientX - 20 < 0)) {
            // Stop moving.
          } else {
            target.parentNode.style.left = event.pageX - shiftX + 'px'
            target.parentNode.style.top = event.pageY - shiftY + 'px'
          }
        }
        // target.parentNode.style.zIndex = 1000
        document.addEventListener('mousemove', onMouseMove)
        /**
         * Makes element stop moving when mouse button is released.
         *
         */
        target.onmouseup = function () {
          document.removeEventListener('mousemove', onMouseMove)
          target.onmouseup = null
        }
      }
    }
  }
)
