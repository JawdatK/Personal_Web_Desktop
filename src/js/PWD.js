'strict mode'

import { dragApplication } from './dragApp.js'
import './memory.js'
import './chat.js'
import './calc.js'

export function startPWD () {
  const mainDiv = document.querySelector('#main')
  const dock = document.querySelector('.dock')
  const timeDiv = document.querySelector('#time')

  let memoryGame
  let chat
  let calc

  // Get time
  getCurrentTime()

  // listen to mouse click on application icons
  dock.addEventListener('click', event => {
    switch (event.target) {
      case dock.children[0]:
        memoryGame = document.createElement('memory-game')
        mainDiv.appendChild(memoryGame)
        dragApplication(memoryGame.shadowRoot.querySelector('#container'))
        break

      case dock.children[1]:
        chat = document.createElement('chat-app')
        mainDiv.appendChild(chat)
        dragApplication(chat.shadowRoot.querySelector('#container'))
        break

      case dock.children[2]:
        calc = document.createElement('calc-app')
        mainDiv.appendChild(calc)
        dragApplication(calc.shadowRoot.querySelector('#container'))
        break

      case dock.children[3]:
        // Reload the page and ignore the browser cache.
        window.location.reload(true)
        break

      default:
        break
    }
  })

  // Get and show time on dock
  function getCurrentTime () {
    const date = new Date()

    const time = ((date.getHours() < 10) ? '0' : '') + ((date.getHours() > 12) ? (date.getHours() - 12) : date.getHours()) + ':' +
    ((date.getMinutes() < 10) ? '0' : '') + date.getMinutes() + ':' +
    ((date.getSeconds() < 10) ? '0' : '') + date.getSeconds() +
    ((date.getHours() > 12) ? (' PM') : ' AM')

    timeDiv.innerHTML = time

    setTimeout(getCurrentTime, 1000)
  }
}
