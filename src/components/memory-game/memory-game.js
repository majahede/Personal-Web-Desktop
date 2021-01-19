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
  min-height: 200px;
  min-width: 180px;
}
.grid#large, .grid#medium{
  display: grid;
  grid-template-columns: repeat(4, 80px);
  gap: 1rem;
  color: #cccccc;
}

.grid#small {
  display: grid;
  grid-template-columns: repeat(2, 80px);
  gap: 1rem;
  color: #cccccc;
  margin-left: 10px;
}

button {
  font-size: 1rem;
  margin: 10px;
}

h2 {
}

</style>
<div class="options">
  <button id="small">2x2</button>
  <button id="medium">4x2</button>
  <button id="large">4x4</button>
<div>
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
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
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
            if (tiles.all.length === (tiles.hidden.length + 2)) {
              while (this.grid.firstElementChild) {
                this.grid.removeChild(this.grid.firstElementChild)
              }
              const gameover = document.createElement('h2')
              gameover.textContent = `You made it in ${this.attempts} attempts! Try again?`
              this.grid.appendChild(gameover)
            }
          } else {
            first.removeAttribute('flipped')
            second.removeAttribute('flipped')
            this.attempts += 1
          }
          tiles.all.forEach(tile => (tile.removeAttribute('disabled')))
        }, 1200)
      }
    }
  }
)
