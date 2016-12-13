'use strict'
const logIn = require('./logIn')
const info = require('./info')
const setAddress = require('./setAddress')
const verifyCode = require('./verifyCode')
const currentTank = require('./currentTank')

module.exports = {
  info,
  logIn,
  verifyCode,
  currentTank,
  setAddress
}
