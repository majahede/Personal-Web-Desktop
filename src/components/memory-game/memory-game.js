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

      this.grid = this.shadowRoot.querySelector('.grid')
      this.small = this.shadowRoot.querySelector('#small')
      this.medium = this.shadowRoot.querySelector('#medium')
      this.large = this.shadowRoot.querySelector('#large')
      this.onTileFlip = this.onTileFlip.bind(this)
      this.attempts = 0
      this.switch = this.shadowRoot.querySelector('#switch')
      this.gameover = this.shadowRoot.querySelector('#gameover')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.setBoardSize('large')
      this.addTiles(16)
      this.switch.addEventListener('change', () => {
        if (this.switch.checked) {
          this.setAttribute('dark', '')
        } else {
          this.removeAttribute('dark', '')
        }
      })

      this.small.addEventListener('click', () => {
        this.setBoardSize('small')
        this.addTiles(4)
      })
      this.medium.addEventListener('click', () => {
        this.setBoardSize('medium')
        this.addTiles(8)
      })
      this.large.addEventListener('click', () => {
        this.setBoardSize('large')
        this.addTiles(16)
      })

      this.grid.addEventListener('fliptile', this.onTileFlip)
    }

    /**
     * Get tiles on gameboard.
     *
     * @returns {object} An object containing grouped tiles.
     */
    get _tiles () {
      const tiles = Array.from(this.grid.children)
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
    setBoardSize (boardSize) {
      this.grid.setAttribute('id', boardSize)
      while (this.grid.firstElementChild) {
        this.grid.firstElementChild.remove()
      }
    }

    /**
     * Adds tiles to game board.
     *
     * @param {number} boardSize - Number of tiles on the game board.
     */
    addTiles (boardSize) {
      while (this.gameover.firstElementChild) {
        this.gameover.firstElementChild.remove()
      }
      const images = this.createImageArray(`${boardSize / 2}`)
      const shuffledImages = this.shuffle(images)
      for (let i = 0; i < boardSize; i++) {
        const tile = document.createElement('flipping-tile')
        this.grid.appendChild(tile)
        tile.setAttribute('src', shuffledImages[i])
        this.attempts = 0
      }
    }

    /**
     * Creates an array of images.
     *
     * @param {number} boardSize - The size of the gamee board.
     * @returns {Array} The array of images.
     */
    createImageArray (boardSize) {
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
    shuffle (images) {
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
    onTileFlip (event) {
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
            this.attempts += 1
          } else {
            first.removeAttribute('flipped')
            second.removeAttribute('flipped')
            this.attempts += 1
          }
          tiles.all.forEach(tile => (tile.removeAttribute('disabled')))
          if (tiles.all.length === (tiles.hidden.length + 2)) {
            while (this.grid.firstElementChild) {
              this.grid.removeChild(this.grid.firstElementChild)
            }
            const output = document.createElement('h2')
            output.textContent = `You made it in ${this.attempts} attempts! Try again?`
            this.gameover.appendChild(output)
          }
        }, 1200)
      }
    }
  }
)
