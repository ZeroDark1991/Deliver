'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const manualConfirm = function*() {
	let data = this.request.body
	if(!data.name || !data.phoneNumber){
		throw new APIError('Incompelete Information', '请完整填写信息')
  	return
	}

  if(!this.headers.deliver) {
  	throw new APIError('session lost', 'session 失效，重新登录')
  	return
  }

  const Order = AV.Object.extend('Order')
  let order = new Order()
  let date = new Date()
  let deliver = AV.Object.createWithoutData('Deliver', headers.deliver)

  order.set('address', data.address)
  order.set('timeSlot', null)
  order.set('areaCode', null)
  order.set('status', 1)
  order.set('price', null)
  order.set('userName', data.name)
  order.set('userPhone', data.phoneNumber)
  order.set('payment', '货到付款')
  order.set('confirmedAt', date)
  order.set('receivedAt', null)
  order.set('finishedAt', null)
  order.set('deliver', deliver)

	try {
		yield order.save()
	} catch(e) {
		throw new APIError('DB Error', e.message)
		return
	}

	this.body = {
		success: true,
		message: '提交成功'
	}
}

module.exports = manualConfirm
