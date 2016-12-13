'use strict'
const timeSlots = require('../../config/timeSlots')

module.exports = function*() {
  this.body = {
  	success: true,
  	timeSlots
  }
}