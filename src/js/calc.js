'strict mode'

class Calc extends window.HTMLElement {
  constructor () {
    super()
    this.btn = null
    this.viewer = null
    this.oldValue = null
    this.currentValue = null
    this.operator = null
    this.resultValue = 0
    this.resultFlag = false

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="css/style.css">
      <template id="calcTemp">
         
        <div id="container">

          <div class="header" >
            <img src="./image/calc.png"> Calculator
            <span class="close">X</span>
          </div>

          <div id="calculator">
            <button class="reset">C</button>
            <div class="viewer"></div>
            <button class="number" data-number="7">7</button>
            <button class="number" data-number="8">8</button>
            <button class="number" data-number="9">9</button>
            <button data-operator="plus" class="operator">+</button>
            <button class="number" data-number="4">4</button>
            <button class="number" data-number="5">5</button>
            <button class="number" data-number="6">6</button>
            <button data-operator="minus" class="operator">-</button>
            <button class="number" data-number="1">1</button>
            <button class="number" data-number="2">2</button>
            <button class="number" data-number="3">3</button>
            <button data-operator="times" class="operator">*</button>
            <button class="number" data-number="0">0</button>
            <button class="number" data-number=".">.</button>
            <button id="equals" class="equals">=</button>
            <button data-operator="divided by" class="operator">/</button>
          </div>
        </div>
      </template>`

    const template = this.shadowRoot.querySelector('#calcTemp')
    const clone = template.content.cloneNode(true)
    this.shadowRoot.appendChild(clone)
  }

  // run when adding a custome elemnet of type chat-app
  connectedCallback () {
    this.btn = this.shadowRoot.querySelector('#calculator')
    this.viewer = this.shadowRoot.querySelector('.viewer')

    // check the pressed button
    this.btn.addEventListener('click', event => {
      // if clear btn is pressed, reset everything
      if (event.target.getAttribute('class') === 'reset') {
        this.reset()
        // else if number is pressed, set the number on viewer
      } else if (event.target.getAttribute('class') === 'number') {
        // reset if we already have result on viewer
        if (this.resultFlag === true) {
          this.reset()
          this.resultFlag = false
        }
        this.viewer.innerHTML += event.target.getAttribute('data-number')
        this.currentValue = this.viewer.innerHTML
      } else if (event.target.getAttribute('class') === 'operator') {
        console.log(event.target.getAttribute('data-operator'))
        if (this.resultFlag === true) {
          this.viewer.innerHTML = ''
          this.resultFlag = false
        }
        this.oldValue = this.currentValue
        this.viewer.innerHTML = ''
        this.operator = event.target.getAttribute('data-operator')
      } else if (event.target.getAttribute('class') === 'equals') {
        // Convert string into  numbers
        this.oldValue = parseFloat(this.oldValue)
        this.currentValue = parseFloat(this.currentValue)

        // check operation
        switch (this.operator) {
          case 'plus':
            this.resultValue = this.oldValue + this.currentValue
            break

          case 'minus':
            this.resultValue = this.oldValue - this.currentValue
            break

          case 'times':
            this.resultValue = this.oldValue * this.currentValue
            break

          case 'divided by':
            this.resultValue = this.oldValue / this.currentValue
            break

            // nothing  if equal is pressed without an operator
          default:
            this.resultValue = this.currentValue
        }

        this.viewer.innerHTML = this.resultValue
        this.resultFlag = true
      }
    })

    // close applicarion when press X
    this.shadowRoot.querySelector('.close').addEventListener('click', this.closeApp.bind(this))
  }

  // reset all variables
  reset () {
    this.viewer.innerHTML = ''
    this.oldValue = null
    this.currentValue = null
    this.operator = null
    this.resultValue = null
  }

  closeApp () {
    this.shadowRoot.querySelector('#container').remove()
  }
}

window.customElements.define('calc-app', Calc)
