'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const Order = AV.Object.extend('Order')

const create = function*() {
	let data = this.request.body
  if(!data.address || !data.areaCode || !data.timeSlot){
  	throw new APIError('Incompelete Information', '请完整填写信息')
  	return
  }
  // 验证用户是否登录
  let currentUser = AV.User.current()
  if (!currentUser) {
  	throw new APIError('Unlogged', '用户未登录')
  	return
  }

  // 验证是否存在未完成订单
  // 待续。。。

  let order = new Order()
  order.set('address', data.address)
  order.set('userName', data.userName || '')
  order.set('timeSlot', data.timeSlot)
  order.set('areaCode', data.areaCode)
  order.set('status', 0)
  order.set('price', '')
  
  order.set('payment', '货到付款')
  order.set('confirmedAt', null)
  order.set('receivedAt', null)
  order.set('finishedAt', null)

  let userPhone = data.userPhone
  ? data.userPhone
  : currentUser.get('mobilePhoneNumber')
  order.set('userPhone', userPhone)

  let user = AV.Object.createWithoutData('_User', currentUser.id)

  // 订单关联用户
  order.set('user', user)

  try {
    yield order.save()
  } catch(e) {
    throw new APIError('create order failed', e.message)
    return
  }

  this.body = {
  	success: true,
  	message: '订单成功生成'
  }
}

module.exports = create