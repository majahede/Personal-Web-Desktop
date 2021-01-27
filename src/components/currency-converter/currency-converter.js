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
  display: block;
  width:510px;
}

.container {
  background-color: #01053f;
  padding: 20px;
  overflow: hidden;
}

.title {
  font-size: 1.2rem;
  text-align: center;
  color:  #ffc420;
}

h3 {
  display: inline;
  color:  #ffc420;
  padding-right: 28px;
}

#convert {
  font-size: 1.2rem;
  background-color: #ffc420;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  outline: none;
}

#convert:focus, #convert:hover {
  background-color: #faba0b;
}

#amount, select {
  font-size: 1.1rem;
  border-radius: 10px;
  border: none;
  padding: 2px 5px;
  color: #01053f;
  outline: none;
}

#amount:focus, select:focus {
  background-color: #e9e8e8;
}

.result {
  padding-top: 10px;
  font-size: 2rem;
  text-align: center;
  color: #ffc420;
}

.amount {
  padding-right: 160px;
}

</style>
<div class="container" tabindex ="-1">
  <div class="title">
    <h2>Currency Converter</h2>
  </div>
  <div class="currencyConverter">
    <h3 class="amount">Amount </h3>
    <h3>From</h3>
    <h3>To</h3>
    <form autocomplete="off">
    <input type="number" id="amount" name="amount" value="1"/>
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
customElements.define('currency-converter',
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
      this._fromCurrency = this.shadowRoot.querySelector('#from-currency')
      this._toCurrency = this.shadowRoot.querySelector('#to-currency')
      this._amount = this.shadowRoot.querySelector('#amount')
      this._convert = this.shadowRoot.querySelector('#convert')
      this._result = this.shadowRoot.querySelector('.result')
      this._container = this.shadowRoot.querySelector('.container')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this._addCurrency()
      this._convert.addEventListener('click', () => this._convertCurrency())
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
      this._convert.removeEventListener('click', () => this._convertCurrency())
    }

    /**
     * Gets current currency rates.
     *
     * @returns {object} - the currency rates.
     */
    async _getCurrency () {
      const URL = 'https://api.exchangeratesapi.io/latest'
      const getCurrency = await window.fetch(URL)
      const currency = await getCurrency.json()
      currency.rates.EUR = 1
      return currency.rates
    }

    /**
     * Adds currency options.
     */
    async _addCurrency () {
      const currency = await this._getCurrency()
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
        this._fromCurrency.appendChild(option)
        this._toCurrency.appendChild(clone)
      }
    }

    /**
     * Converts one currenecy to another.
     *
     * @returns {number} - the converted currency.
     */
    async _convertCurrency () {
      const currency = await this._getCurrency()
      let firstCurrency = 0
      let secondCurrency = 0
      const amount = this._amount.value

      for (const key in currency) {
        if (key === this._fromCurrency.value) {
          firstCurrency = currency[key]
        }
        if (key === this._toCurrency.value) {
          secondCurrency = currency[key]
        }
      }
      const result = (currency.EUR / firstCurrency) * secondCurrency * amount
      this._result.textContent = ` ${this._amount.value} ${this._fromCurrency.value} =  ${result.toFixed(2)} ${this._toCurrency.value}`
    }
  }
)
