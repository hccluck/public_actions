const { uid } = require('../config')

const { autoGame } = require('./autoGame')

function running() {
  if (!uid) return
  autoGame()
  console.log('game running...')
}

running()
