'use strict'
const district = require('../../config/district')
const timeSlot = require('../../config/timeSlot')

const orderOption = function*() {
  this.body = {
  	district,
  	timeSlot
  }
}

module.exports = orderOption