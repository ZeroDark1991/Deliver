'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const Order = AV.Object.extend('Order')

const create = function*() {
	let data = this.request.body
	console.log(data)
  if(!data.address || !data.areaCode || !data.timeSlot){
  	throw new APIError('incomplete information', '请完整填写信息')
  	return
  }
  // 验证用户是否登录
  let currentUser = AV.User.current()
  console.log(currentUser)
  if (!currentUser) {
  	throw new APIError('user unlogged in', '用户未登录')
  	return
  }
  let order = new Order()
  order.set('address', data.address)
  order.set('timeSlot', data.timeSlot)
  order.set('areaCode', data.areaCode)
  order.set('status', 0)

  let user = AV.Object.createWithoutData('_User', currentUser.id)
  order.set('user', user)

  try {
    order.save()
  } catch(e) {
    throw new APIError('create order failed', '生成订单失败')
    return
  }

  this.body = {
  	success: true,
  	message: '订单成功生成'
  }
}

module.exports = create