/* global holder fetch location uID */
/* eslint-disable no-unused-vars */

const maxMoves = 5
let currentMoves = []

async function moveRequest (currentMoves) {
  const res = await fetch(location.protocol + '//localhost:5000/api/send_move', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ moves: currentMoves, userID: uID })
  }).catch(() => {
    throw new Error('Network or permission failure when sending moveRequest')
  })
  if (!res.ok) {
    throw new Error('Sending moveRequest: ' + res.statusText)
  }
}

function renderQueue () {
  const holder = document.getElementById('actionqueue')
  while (holder.hasChildNodes()) {
    holder.removeChild(holder.lastChild)
  }
  for (let i = 0; i < currentMoves.length; i++) {
    const newChild = document.createElement('img')
    newChild.setAttribute('src', 'static/' + currentMoves[i] + '-arrow.svg')
    newChild.setAttribute('id', currentMoves[i] + 'arrow')
    newChild.setAttribute('width', 100)
    newChild.setAttribute('height', 100)
    holder.appendChild(newChild)
  }
}

function addArrow (dir) {
  if (currentMoves.length === maxMoves) {
    // currentMoves = [];
    return
  }
  currentMoves.push(dir)
  renderQueue()
}

function undo () {
  if (currentMoves.length === 0) {
    // No actions to remove
    return
  }
  // get the action queue object from the document
  const holder = document.getElementById('actionqueue')
  // remove the last child, which is the last added move
  holder.removeChild(holder.childNodes[currentMoves.length - 1])
  currentMoves.pop()
}

function submit () {
  if (currentMoves.length === maxMoves) {
    moveRequest(currentMoves)
    // reset the move queue
    currentMoves = []
    while (holder.hasChildNodes()) {
      holder.removeChild(holder.lastChild)
    }
  }
}

function validUndo () {
  // this just checks if running function "undo" will be successful
  const undoButton = document.getElementById('undo')
  if (currentMoves.length === 0) {
    // cannot undo
    undoButton.classList.remove('canClick')
    undoButton.classList.add('cantClick')
  } else {
    // can undo
    undoButton.classList.remove('cantClick')
    undoButton.classList.add('canClick')
  }
}

function validSubmit () {
  // this just checks if running function "submit" will be successful
  const submitButton = document.getElementById('submit')
  if (currentMoves.length < maxMoves) {
    // cannot submit
    submitButton.classList.remove('canClick')
    submitButton.classList.add('cantClick')
  } else {
    // can submit
    submitButton.classList.remove('cantClick')
    submitButton.classList.add('canClick')
  }
}
