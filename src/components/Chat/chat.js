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
  width: 400px;
  background-color: green;
  padding: 10px;
  float: left;
}

.chat-output {
  display: block;
  height: 300px;
  width: 100%;
  background-color: white;
}

</style>
<div class="chat-output"> 
</div>
<form class ="message-form">
<input id="message" placeholder="Write your message"/>
<input type="button" class="send-message" value="Send"/>
</form>
<form class="nickname-form">
<input id="nickname" placeholder="Your Nickname"/>
<input type="button" class="set-nickname" value="Save"/>
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
      this.nickname = this.shadowRoot.querySelector('#nickname')
      this.chat = this.shadowRoot.querySelector('.chat-output')
      this.websocket = new WebSocket('wss://cscloud6-127.lnu.se/socket/')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
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
      })
    }

    /**
     * Send message to server.
     */
    sendMessage () {
      const data = {
        type: 'message',
        data: this.message.value,
        username: 'Maja',
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
