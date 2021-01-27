/**
 * The Messages sub-app module.
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
  height: 500px;
  width: 410px;
  padding: 10px;
  float: left;
  background-color:  #440f88;
}

.chat-output {
  display: block;
  height: 300px;
  width: 404px;
  background-color: white;
  overflow-y: scroll;
  border: 3px solid #440f88;
  outline: none;
}

#message {
  width: 400px;
  height: 100px;
  border: 3px solid #440f88;
  border-top: none;
  outline: none;
}

p {
  padding-left: 10px;
}

.username-form {
  padding-bottom: 10px;
}

.send-message {
  background-color: #fff;
  color: #440f88;
  font-size: 1.2rem;
  position: relative;
  left: 325px;
  border-radius: 20px;
  border: none;
  padding: 5px 10px;
  margin-top: 10px;
}

.set-username, .change-username {
  background-color: #fff;
  color: #440f88;
  border-radius: 10px;
  border: none;
  padding: 4px 8px;
}

</style>
<form autocomplete="off" class="username-form">
<input id="username" placeholder="Enter username"/>
<input type="button" class="set-username" value="Save"/>
<input type="button" class="change-username" value="Change name" hidden="true"/>
</form>
<div class="chat-output"> 
</div>
<form class ="message-form">
<textarea id="message" placeholder="Write your message"> 
</textarea>
<input type="button" class="send-message" value="Send"/>
</form>


`
/**
 * Define custom element.
 */
customElements.define('messages-app',
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
      this._message = this.shadowRoot.querySelector('#message')
      this._send = this.shadowRoot.querySelector('.send-message')
      this._usernameInput = this.shadowRoot.querySelector('#username')
      this._usernameButton = this.shadowRoot.querySelector('.set-username')
      this._changeButton = this.shadowRoot.querySelector('.change-username')
      this._chat = this.shadowRoot.querySelector('.chat-output')
      this._websocket = new WebSocket('wss://cscloud6-127.lnu.se/socket/')
      this._changeFormInputs = this._changeFormInputs.bind(this)
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      const username = JSON.parse(window.localStorage.getItem('messageUsername'))

      if (username !== '') {
        this._usernameInput.setAttribute('hidden', '')
        this._usernameButton.setAttribute('hidden', '')
        this._changeButton.removeAttribute('hidden')
      }

      this._changeButton.addEventListener('click', this._changeFormInputs)
      this._usernameButton.addEventListener('click', event => this._setUsername(event))
      this._send.addEventListener('click', () => this._sendMessage())

      /**
       * Gets message from server.
       *
       * @param {object} event - MessageEvent from server
       */
      this._websocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this._showMessage(`${data.username}: ${data.data}`)
      }
    }

    /**
     * Called after the element is removed from the DOM.
     */
    disconnectedCallback () {
      this._changeButton.removeEventListener('click', this._changeFormInputs)
      this._usernameButton.removeEventListener('click', event => this._setUsername(event))
      this._send.removeEventListener('click', () => this._sendMessage())
    }

    /**
     * Sets the username from user input.
     *
     * @param {object} event - An object containing the event.
     */
    _setUsername (event) {
      window.localStorage.setItem('messageUsername', JSON.stringify(this._usernameInput.value))
      this._usernameInput.value = ''
      this._changeFormInputs(event)
    }

    /**
     * Send message to server.
     */
    _sendMessage () {
      const data = {
        type: 'message',
        data: this._message.value,
        username: JSON.parse(window.localStorage.getItem('messageUsername')),
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }
      this._websocket.send(JSON.stringify(data))
      this._message.value = ''
    }

    /**
     * Output message to chat window.
     *
     * @param {string} input - The message to be shown in chat window.
     */
    _showMessage (input) {
      const newMessage = document.createElement('p')
      newMessage.textContent = input
      this._chat.appendChild(newMessage)
    }

    /**
     * Changes the form depending on if the user has set a valid username.
     *
     * @param {object} event - An object containing the event.
     */
    _changeFormInputs (event) {
      const username = JSON.parse(window.localStorage.getItem('messageUsername'))
      if (username === '' || event.target.classList.contains('change-username')) {
        this._changeButton.setAttribute('hidden', '')
        this._usernameInput.removeAttribute('hidden', '')
        this._usernameButton.removeAttribute('hidden', '')
      } else {
        this._usernameInput.setAttribute('hidden', '')
        this._usernameButton.setAttribute('hidden', '')
        this._changeButton.removeAttribute('hidden')
      }
    }
  }
)
