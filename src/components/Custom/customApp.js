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
  <form id="currency">
  <div class="from">
    <select id="from-currency">
      <option>Convert from</option>
    </select>
    <input type="text" id="amount"/>
  </div>
  <div>
    <select id="to-currency">
      <option>Convert to</option>
    </select>
    <output></output>
  </div>
</form>
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
      this.amount = this.shadowRoot.querySelector('#amount')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.addCurrency()

      this.fromCurrency.addEventListener('change', async (event) => {
        console.log(await this.convertCurrency())
        console.log(await this.getCurrency())
      })
    }

    /**
     * Gets current currency rates.
     *
     * @returns {object} - the currency rates.
     */
    async getCurrency () {
      const URL = 'https://api.exchangeratesapi.io/latest'
      const getCurrency = await window.fetch(URL)
      const currency = await getCurrency.json()
      currency.rates.EUR = 1
      return currency.rates
    }

    /**
     * Adds currency options.
     */
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

    /**
     * Converts one currenecy to another.
     *
     * @returns {number} - the converted currency.
     */
    async convertCurrency () {
      const currency = await this.getCurrency()
      let firstCurrency = 0
      let secondCurrency = 0
      const amount = this.amount.value

      for (const key in currency) {
        if (key === this.fromCurrency.value) {
          firstCurrency = currency[key]
        }
        if (key === this.toCurrency.value) {
          secondCurrency = currency[key]
        }
      }
      const result = (currency.EUR / firstCurrency) * secondCurrency * amount
      return result.toFixed(2)
    }
  }
)
