'strict mode'

class Chat extends window.HTMLElement {
  constructor () {
    super()
    this.sendBtn = null
    this.usernameBtn = null
    this.name = null
    this.msg = null
    this.username = null
    this.socket = null
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="css/style.css">
    <template id="chatTemp">
      <div id="container">
          <div id="chat-main">

            <div class="header" >
              <img src="./image/chat.png"> Chat application
            <strong class="close">X</strong>
            </div>

            <div class="chatContainer">
                <div id="chatConversation"></div>
            </div>
            <input id="uName" type="text" placeholder="username">
            <button id="userBtn">Enter</button>
            <textarea id="msg" rows="2" placeholder="your message" ></textarea>
            <button id="sendBtn">Send</button>
          </div>
      </div>
    </template>`

    const template = this.shadowRoot.querySelector('#chatTemp')
    const clone = template.content.cloneNode(true)
    this.shadowRoot.appendChild(clone)
  }

  // run when adding a custome elemnet of type chat-app
  connectedCallback () {
    this.sendBtn = this.shadowRoot.querySelector('#sendBtn')
    this.usernameBtn = this.shadowRoot.querySelector('#userBtn')
    this.msg = this.shadowRoot.querySelector('#msg')
    this.username = this.shadowRoot.querySelector('#uName')

    if (window.localStorage.getItem('sender') === null) {
      this.inactive(true)
      this.username.focus()
    } else {
      this.name = window.localStorage.getItem('sender')
    }

    this.connect()
    this.usernameBtn.addEventListener('click', () => {
      this.name = this.username.value
      if (this.name !== undefined) {
        window.localStorage.setItem('sender', this.name)
        this.name = window.localStorage.getItem('sender')
        this.inactive(false)
      }
    })

    this.sendBtn.addEventListener('click', () => {
      this.sendMsg(this.msg.value)
    })

    // close applicarion when press X
    this.shadowRoot.querySelector('.close').addEventListener('click', this.closeApp.bind(this))
  }

  // change state active/ inactive
  inactive (booleanVal) {
    this.msg.disabled = booleanVal
    this.sendBtn.disabled = booleanVal
  }

  // listen to the comming messages and print them
  connect () {
    this.socket = new window.WebSocket('ws://vhost3.lnu.se:20080/socket/')

    this.socket.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.type === 'message') {
        this.printMsg(msg.username, msg.data)
      }
    }
  }

  // send the message
  sendMsg (text) {
    const data = {
      type: 'message',
      data: text,
      username: this.name,
      channel: '',
      key: '??????????????????????????????'
    }
    this.socket.send(JSON.stringify(data))
  }

  // print the message
  printMsg (user, text) {
    const conversation = this.shadowRoot.querySelector('#chatConversation')
    const chatWindow = this.shadowRoot.querySelector('.chatContainer')
    const msg = this.shadowRoot.querySelector('#msg')
    conversation.innerHTML += `<p><strong>${user}</strong> : ${text}</p>`
    msg.value = ''
    msg.focus()
    msg.scrollTop = msg.scrollHeight
    const scrollHeight = chatWindow.scrollHeight
    chatWindow.scrollTo(0, scrollHeight)
  }

  // disconnect the websocket
  disconnectedCallback () {
    this.socket.close()
  }

  // close the application
  closeApp () {
    this.disconnectedCallback()
    this.shadowRoot.querySelector('#container').remove()
  }
}

window.customElements.define('chat-app', Chat)
