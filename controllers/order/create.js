'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const Order = AV.Object.extend('Order')

const create = function*() {
	let data = this.request.body
  let order = new Order()
  order.set('address','hehehe')
}

module.exports = create