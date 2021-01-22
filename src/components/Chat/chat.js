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

.set-username {
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
      this.message = this.shadowRoot.querySelector('#message')
      this.send = this.shadowRoot.querySelector('.send-message')
      this.username = this.shadowRoot.querySelector('#username')
      this.usernameButton = this.shadowRoot.querySelector('.set-username')
      this.chat = this.shadowRoot.querySelector('.chat-output')
      this.websocket = new WebSocket('wss://cscloud6-127.lnu.se/socket/')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.usernameButton.addEventListener('click', () => {
        window.localStorage.setItem('username', JSON.stringify(this.username.value))
        this.username.value = ''
      })

      /**
       * Gets message from server.
       *
       * @param {object} event - MessageEvent from server
       */
      this.websocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.showMessage(`${data.username}: ${data.data}`)
      }

      this.send.addEventListener('click', () => {
        this.sendMessage()
        this.message.value = ''
      })
    }

    /**
     * Send message to server.
     */
    sendMessage () {
      const data = {
        type: 'message',
        data: this.message.value,
        username: JSON.parse(window.localStorage.getItem('username')),
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }
      this.websocket.send(JSON.stringify(data))
    }

    /**
     * Output message to chat window.
     *
     * @param {string} input - The message to be shown in chat window.
     */
    showMessage (input) {
      const newMessage = document.createElement('p')
      newMessage.textContent = input
      this.chat.appendChild(newMessage)
    }
  }
)
