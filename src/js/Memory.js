'strict mode'

class Memory extends window.HTMLElement {
  constructor () {
    super()
    this.pairs = 0
    this.tries = 0
    this.turn = 0
    this.turnedTiles = []
    this.memoryHeader = null
    this.interval = null

    this.attachShadow({ mode: 'open' })

    this.shadowRoot.innerHTML = `
    <link rel="stylesheet" href="css/style.css">
    <template id="memoryTemp">

      <div id="container">

         <div class="header" >
            <img src="./image/memory.png"> Memory Game
            <span class="close">X</span>
        </div>

        <div id="memoryContainer" >

          

          <h1 id="memoryHeader"></h1>

          <template id="template">
            <a href="#"><img class="img" src="image/0.png" alt="Memory brick"> </a>
          </template>
        </div>
      </div>
    </template>`

    const template = this.shadowRoot.querySelector('#memoryTemp')
    const clone = template.content.cloneNode(true)
    this.shadowRoot.appendChild(clone)
  }

  // run when adding a custome elemnet of type memory-game
  connectedCallback () {
    this.playGame(4, 4)
  }

  // main function to start the game
  playGame (rows, cols) {
    const totalTime = 100
    let countdown = totalTime
    const bricksContainer = this.shadowRoot.querySelector('#memoryContainer')
    const template = this.shadowRoot.querySelectorAll('#memoryContainer template')[0].content.firstElementChild
    const tiles = this.getPictureArray(rows, cols)
    const _this = this
    this.memoryHeader = this.shadowRoot.querySelector('#memoryHeader')
    let a

    this.memoryHeader.textContent = 'Time left: ' + countdown

    this.interval = setInterval(() => {
      this.memoryHeader.textContent = 'Time left: ' + --countdown

      if (countdown <= 0) {
        console.log()
        bricksContainer.classList.add('disabler')
        clearInterval(this.interval)
        this.memoryHeader.innerText = 'Game Over'
      }
    }, 500)

    tiles.forEach(function (tile, index) {
      a = document.importNode(template, true)
      bricksContainer.appendChild(a)

      a.addEventListener('click', (event) => {
        const img = event.target.nodeName === 'IMG' ? event.target : event.target.firstElementChild
        _this.turnBrick(tile, img, cols, rows)
      })

      if ((index + 1) % cols === 0) {
        bricksContainer.appendChild(document.createElement('br'))
      }
    })
    // close applicarion when press X
    this.shadowRoot.querySelector('.close').addEventListener('click', this.closeApp.bind(this))
  }

  // turn bricks  and check for matching
  turnBrick (tile, img, cols, rows) {
    img.src = `image/${tile}.png`
    this.tries++

    if (this.turn === 0) {
      // first brick
      this.turnedTiles[0] = img
      this.turn = 1
    } else if (this.turn === 1) {
      // second brick
      if (img === this.turnedTiles[0]) { return }

      this.turnedTiles[1] = img

      const br1 = this.turnedTiles[0]
      const br2 = this.turnedTiles[1]
      if (this.turnedTiles[0].src === this.turnedTiles[1].src) {
        // Match found so remove matched bricks

        this.pairs++
        setTimeout(function () {
          br1.parentNode.classList.add('removed')
          br2.parentNode.classList.add('removed')
        }, 300)

        if (this.pairs === (cols * rows) / 2) { // when finish
          clearInterval(this.interval)
          const tries = Math.floor(this.tries / 2)
          this.memoryHeader.innerHTML = 'Won!! ' + tries + ' tries'
          this.shadowRoot.querySelector('#container').style.backgroundColor = 'rgba(255, 255, 255, 0.931)'

          this.tries = 0
          this.pairs = 0
        }

        this.turnedTiles = []
      } else {
        // not match flipp both bricks
        setTimeout(function () {
          br1.src = 'image/0.png'
          br2.src = 'image/0.png'
        }, 300)
      }
      this.turn = 0
    }
  }

  // initializing arrays of bricks as [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8]
  getPictureArray (rows, cols) {
    const arr = []

    for (let i = 1; i <= rows * cols / 2; i++) {
      arr.push(i)
      arr.push(i)
    }

    // sort the array elements randomly
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = arr[i]
      arr[i] = arr[j]
      arr[j] = temp
    }
    return arr
  }

  closeApp () {
    clearInterval(this.interval)
    this.shadowRoot.querySelector('#container').remove()
  }
}

window.customElements.define('memory-game', Memory)
