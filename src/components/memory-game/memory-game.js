/**
 * The memory game web component module.
 *
 * @author Maja Hedegärd <mh223pi@student.lnu.se>
 * @version 1.0.0
 */

let imgNum = 0
const arrayOfImages = []
for (let i = 0; i <= 8; i++) {
  const imgURL = (new URL(`images/${imgNum}.png`, import.meta.url)).href
  arrayOfImages.push(imgURL)
  imgNum++
}
console.log(arrayOfImages)
/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
.grid#large, .grid#medium{
  display: grid;
  grid-template-columns: repeat(4, 100px);
  gap: 1rem;
  color: #cccccc;
}

.grid#small {
  display: grid;
  grid-template-columns: repeat(2, 100px);
  gap: 1rem;
  color: #cccccc;
}

</style>
<div class="grid" id="large"> 
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
    }

    connectedCallback () {
      this.addTiles()
    }

    addTiles (size) {
      for (let k = 0; k < 2; k++) {
        for (let i = 1; i <= 8; i++) {
          const tile = document.createElement('flipping-tile')
          this.grid.appendChild(tile)
          tile.setAttribute('src', `./images/${i}.png`)
        }
      }
    }

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
  }
)
