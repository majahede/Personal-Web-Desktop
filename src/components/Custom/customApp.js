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
<style> 
:host {
  background-color:  #ffc420;
}

.container {
  background-color: #01053f;
  padding: 20px;
}

.title {
  font-size: 1.2rem;
  text-align: center;
  color:  #ffc420;
}

h3 {
  display: inline;
  color:  #ffc420;
}

#convert {
  font-size: 1.2rem;
  background-color: #ffc420;
  border-radius: 10px;
  border: none;
}

#amount, select {
  font-size: 1.1rem;
  border-radius: 10px;
  border: none;
  padding: 2px;
  color: #01053f
}

.result {
  padding-top: 10px;
  font-size: 2rem;
  text-align: center;
}

h3 {
  padding-right: 22px;
}

.amount {
  padding-right: 158px;
}

</style>
<div class="container">
  <div class="title">
    <h2>Currency Converter</h2>
  </div>
  <div class="currencyConverter">
    <h3 class="amount">Amount </h3>
    <h3>From</h3>
    <h3>To</h3>
    <form>
    <input type="text" id="amount" name="amount" value="1"/>
    <select id="from-currency" value="EUR" name="from">
      <option>EUR</option>
    </select>
    <select id="to-currency">
      <option>SEK</option>
    </select>  
    <input type="button" id="convert" value="Convert"/>
    <form>
  </div>
  <div class="result">
  </div>
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
      this.convert = this.shadowRoot.querySelector('#convert')
      this.result = this.shadowRoot.querySelector('.result')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.addCurrency()
      this.convert.addEventListener('click', event => {
        event.preventDefault()
        this.convertCurrency()
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
      this.result.textContent = ` ${this.amount.value} ${this.fromCurrency.value} =  ${result.toFixed(2)} ${this.toCurrency.value}`
    }
  }
)
