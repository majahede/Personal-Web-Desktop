/**
 * The memory game web component module.
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
  background-color: #fff;
  min-width: 300px;
}

:host([dark]) {
  background-color: #2b2b2b;
}

.grid#large, .grid#medium{
  display: grid;
  grid-template-columns: repeat(4, 80px);
  gap: 1rem;
  padding: 20px;
 
}

.grid#small {
  display: grid;
  grid-template-columns: repeat(2, 80px);
  gap: 1rem;
  margin-left: 10px;
  padding: 20px;
}


.size {
  font-size: 1rem;
  background-color: #ff9924;
  margin-top: 20px;
  margin-left: 20px;
  border: none;
  padding: 5px 10px;
  border-radius: 20px;
  cursor: pointer;
  outline: none;
  transition:0s;
}

.size:focus, .size:hover {
  transform: scale(0.95);
}

input[type=checkbox]{
visibility: hidden;
}

label {
  display: block;
  cursor: pointer;
  width: 50px;
  height: 25px;
  background: #2b2b2b;
  border-radius: 15px;
  position: relative;
  float: right;
  margin-top: 20px;
  margin-right: 20px;
}

label:after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #ff9924;
  border-radius: 90px;
  transition: 0.2s;
}

input:checked + label {
  background: #fff;
}

input:checked + label:after {
  left: calc(100% - 2px);
  transform: translateX(-100%);
}

label:active:after {
  width: 25px;
}

h2 {
  color: orange;
  margin: 30px 10px 0px 10px;
}

</style>
<div class="options">
  <button class="size" id="small">2x2</button>
  <button class="size" id="medium">4x2</button>
  <button class="size" id="large">4x4</button>
  <input type="checkbox" id="switch"/>
  <label for="switch"></label>
<div>
<div id="gameover">
</div>
<div class="grid"> 
</div>

`
/**
 * Define custom element.
 */
customElements.define('memory-game',
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

      this._grid = this.shadowRoot.querySelector('.grid')
      this._small = this.shadowRoot.querySelector('#small')
      this._medium = this.shadowRoot.querySelector('#medium')
      this._large = this.shadowRoot.querySelector('#large')
      this._onTileFlip = this._onTileFlip.bind(this)
      this._attempts = 0
      this._switch = this.shadowRoot.querySelector('#switch')
      this._gameover = this.shadowRoot.querySelector('#gameover')
      this._switchMode = this._switchMode.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._setBoardSize('large')

      this._switch.addEventListener('change', this._switchMode)

      this._small.addEventListener('click', () => this._setBoardSize('small'))
      this._medium.addEventListener('click', () => this._setBoardSize('medium'))
      this._large.addEventListener('click', () => this._setBoardSize('large'))

      this._grid.addEventListener('fliptile', this._onTileFlip)
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
      this._switch.removeEventListener('change', this._switchMode)
      this._small.removeEventListener('click', () => this._setBoardSize('small'))
      this._medium.removeEventListener('click', () => this._setBoardSize('medium'))
      this._large.removeEventListener('click', () => this._setBoardSize('large'))
      this._grid.removeEventListener('fliptile', this._onTileFlip)
    }

    /**
     * Called after the element is removed from the DOM.
     *
     * @param {object} event - Object containing event details.
     */
    _switchMode (event) {
      if (event.target.checked) {
        console.log(event)
        this.setAttribute('dark', '')
      } else {
        this.removeAttribute('dark', '')
      }
    }

    /**
     * Get tiles on gameboard.
     *
     * @returns {object} An object containing grouped tiles.
     */
    get _tiles () {
      const tiles = Array.from(this._grid.children)
      return {
        all: tiles,
        faceUp: tiles.filter(tile => tile.hasAttribute('flipped') && !tile.hasAttribute('hidden')),
        hidden: tiles.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Sets the size of the board.
     *
     * @param {string} boardSize - Type of game board.
     */
    _setBoardSize (boardSize) {
      this._grid.setAttribute('id', boardSize)
      while (this._grid.firstElementChild) {
        this._grid.firstElementChild.remove()
      }
      if (this._grid.id === 'large') {
        this._addTiles(16)
      } else if (this._grid.id === 'medium') {
        this._addTiles(8)
      } else if (this._grid.id === 'small') {
        this._addTiles(4)
      }
    }

    /**
     * Adds tiles to game board.
     *
     * @param {number} boardSize - Number of tiles on the game board.
     */
    _addTiles (boardSize) {
      while (this._gameover.firstElementChild) {
        this._gameover.firstElementChild.remove()
      }
      const images = this._createImageArray(`${boardSize / 2}`)
      const shuffledImages = this._shuffle(images)
      for (let i = 0; i < boardSize; i++) {
        const tile = document.createElement('flipping-tile')
        this._grid.appendChild(tile)
        tile.setAttribute('src', shuffledImages[i])
        this._attempts = 0
      }
    }

    /**
     * Creates an array of images.
     *
     * @param {number} boardSize - The size of the gamee board.
     * @returns {Array} The array of images.
     */
    _createImageArray (boardSize) {
      const arrayOfImages = []
      for (let i = 1; i <= boardSize; i++) {
        const image = `./images/${i}.png`
        arrayOfImages.push(image)
        arrayOfImages.push(image)
      }
      return arrayOfImages
    }

    /**
     * Shuffles array of images.
     *
     * @param {Array} images - The array of images to shuffle.
     * @returns {Array} The shuffled array.
     */
    _shuffle (images) {
      let i = images.length
      let j
      let x

      while (i) {
        j = Math.floor(Math.random() * i)
        i -= 1

        x = images[i]
        images[i] = images[j]
        images[j] = x
      }
      return images
    }

    /**
     * Check if flipped tiles are matching.
     *
     * @param {CustomEvent} event - The custom event.
     */
    _onTileFlip (event) {
      const tiles = this._tiles
      const first = tiles.faceUp[0]
      const second = tiles.faceUp[1]

      if (tiles.faceUp.length === 2) {
        tiles.all.forEach(tile => (tile.setAttribute('disabled', '')))

        setTimeout(() => {
          if (first.isEqualNode(second)) {
          // It's a match.
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            this._attempts += 1
          } else {
            first.removeAttribute('flipped')
            second.removeAttribute('flipped')
            this._attempts += 1
          }
          tiles.all.forEach(tile => (tile.removeAttribute('disabled')))
          if (tiles.all.length === (tiles.hidden.length + 2)) {
            while (this._grid.firstElementChild) {
              this._grid.removeChild(this._grid.firstElementChild)
            }
            const output = document.createElement('h2')
            output.textContent = `You made it in ${this._attempts} attempts! Try again?`
            this._gameover.appendChild(output)
          }
        }, 1200)
      }
    }
  }
)
