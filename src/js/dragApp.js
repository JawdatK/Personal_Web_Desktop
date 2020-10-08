'strict mode'

// Based partly on  https://www.w3schools.com/

let stackOrder = 0 // maintains application order in the stack

// convert to draggable application
export function dragApplication (application) {
  // decalring cursor position variables
  let position1 = 0; let position2 = 0; let position3 = 0; let position4 = 0

  const unit = 'px' // style unit

  application.onmousedown = dragMouseDown

  function dragMouseDown (element) {
    // give an application window higer oreder to be on the top of others.
    application.style.zIndex = stackOrder++

    element = element || window.event

    // position of  cusor at start point
    position3 = element.clientX
    position4 = element.clientY

    // set mouse up event
    document.onmouseup = closeDragApplication

    // set cursor move event
    document.onmousemove = applicationDrag
  }

  function closeDragApplication () {
    // when mouse button is released, stop moving
    document.onmouseup = null
    document.onmousemove = null
  }

  function applicationDrag (element) {
    element = element || window.event
    element.preventDefault()

    // set the new cursor position
    position1 = position3 - element.clientX
    position2 = position4 - element.clientY

    position3 = element.clientX
    position4 = element.clientY

    // set the new application position
    application.style.left = (application.offsetLeft - position1) + unit
    application.style.top = (application.offsetTop - position2) + unit
  }
}
