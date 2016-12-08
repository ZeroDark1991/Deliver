'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const Tank = AV.Object.extend('Tank')

const create = function*() {
  const tank = new Tank()
  
}

module.exports = create
