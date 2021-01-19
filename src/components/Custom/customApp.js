/**
 * The -------- web component module.
 *
 * @author Maja Hedegärd <mh223pi@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `


<div class="container">
  <div class="currency">
    <select id="from-currency">
      <option>Convert from</option>
    </select>
    <select id="to-currency">
      <option>Convert to</option>
    </select>
</div>
`
/**
 * Define custom element.
 */
customElements.define('custom-app',
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
      this.fromCurrency = this.shadowRoot.querySelector('#from-currency')
      this.toCurrency = this.shadowRoot.querySelector('#to-currency')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.addCurrency()
      this.fromCurrency.addEventListener('change', (event)=> {
        console.log(event.target.value)
      })
    }

    async getCurrency() {
      const URL = 'https://api.exchangeratesapi.io/latest'
      const getCurrency = await window.fetch(URL)
      const currency = await getCurrency.json()
      return currency.rates
    }

    async addCurrency () {
      const currency = await this.getCurrency()
      const sortedCurrency = Object.keys(currency).sort().reduce(
        (obj, key) => {
          obj[key] = currency[key]
          return obj
        },
        {}
      )

      for (const key in sortedCurrency) {
        const option = document.createElement('option')
        option.value = key
        option.textContent = key
        const clone = option.cloneNode(true)
        this.fromCurrency.appendChild(option)
        this.toCurrency.appendChild(clone)
      }
    }
  }
)
