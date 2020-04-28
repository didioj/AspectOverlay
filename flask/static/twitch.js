/* global fetch location */
/* eslint-disable no-unused-vars */

var token = ''
var uID = ''
var cID = ''
var userName = ''
var channelName = ''

function register () {
  nameRequest()
}

async function nameRequest () {
  const res = await fetch(location.protocol + '//localhost:5000/api/send_name', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ userID: uID })
  }).catch(() => {
    throw new Error('Network or permission failure when sending nameRequest')
  })
  if (!res.ok) {
    throw new Error('Sending nameRequest: ' + res.statusText)
  }
}

window.Twitch.ext.onAuthorized((auth) => {
  console.log('AUTHORIZED')
  token = auth.token
  uID = auth.userID
  cID = auth.channelID
  nameRequest()
})
