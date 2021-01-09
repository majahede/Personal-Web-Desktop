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
      const chat = this.shadowRoot.querySelector('.chat-output')
      this.websocket = new WebSocket('wss://cscloud6-127.lnu.se/socket/')
    }

    connectedCallback () {
      this.websocket.onmessage = function (event) {
        const message = JSON.parse(event.data)
        const messageOutput = `${message.username}: ${message.data}`
        console.log(messageOutput)
      }

      this.websocket.addEventListener('message', function (event) {
        const message = JSON.parse(event.data)
        const messageOutput = `${message.username}: ${message.data}`
        console.log(messageOutput)
      })
      this.send.addEventListener('click', () => {
        const data = {
          type: 'message',
          data: this.message.value,
          username: 'Maja',
          key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
        }
        console.log(data)
      })
    }

    sendMessage () {
      const data = {
        type: 'message',
        data: 'hej',
        username: 'Maja',
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }
      this.websocket.send(JSON.stringify(data))
    }
  }
)

/*
{
  "type": "message",
  "data" : this.message.value,
  "username": "Maja",
  "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
}
The properties type, data, username and key are mandatory when sending a message to the server. The properties type, data and username will always be present when you receive a message from the server. Additionally, all properties sent from one user will be echoed to all receiving clients.
message api key = eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd
*/
