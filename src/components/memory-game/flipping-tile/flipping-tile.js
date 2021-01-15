/**
 * The flipping-tile web component module.
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
    height: 100px;
    width: 100px;
    position: relative;
    perspective: 800px;
  }

  :host([flipped]) .tile{
    transform: rotateY(180deg);
  }

.tile {
  height: 100%;
  width: 100%;  
  position: relative;
  border: none;
  box-shadow: 2px 2px 10px #d1d1d1;
  transform-style: preserve-3d;
  transition: 1s;
}

.tile:focus {
  outline: none;
  box-shadow: 7px 7px 10px #acacac;
}

img {
  width: 100%;
  height: 100%;
}

.front, .back {
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
}

.front {
  transform: rotateY(180deg);
}

.back {
  background-color: #ccc;
}

  </style>
<button class="tile">
  <div id="main-tile">
    <img part="back-tile" class="back" src="./images/0.png"/>
    <img part="front-tile" class="front"/>
  </div>
</button>
  
`

/**
 * Define custom element.
 */
customElements.define('flipping-tile',
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

      // Get the tile element in the shadow root.
      this._tile = this.shadowRoot.querySelector('.tile')
      this._frontTile = this.shadowRoot.querySelector('.front')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['src']
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.addEventListener('click', () => this.flipTile())
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'src') {
        this._frontTile.setAttribute('src', newValue)
      }
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {

    }

    /**
     * Flips card.
     */
    flipTile () {
      if (this.hasAttribute('flipped')) {
        this.removeAttribute('flipped')
      } else {
        this.setAttribute('flipped', '')
        console.log(this._frontTile.src)
      }
    }
  }
)