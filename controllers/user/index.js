'use strict'
const logIn = require('./logIn')
const info = require('./info')
const list = require('./list')
const adminInfo = require('./adminInfo')
const setAddress = require('./setAddress')
const removeAddress = require('./removeAddress')
const editAddress = require('./editAddress')
const currentAddress = require('./currentAddress')
const verifyCode = require('./verifyCode')
const currentTank = require('./currentTank')

module.exports = {
  info,
  logIn,
  list,
  adminInfo,
  verifyCode,
  currentTank,
  setAddress,
  removeAddress,
  editAddress,
  currentAddress
}
