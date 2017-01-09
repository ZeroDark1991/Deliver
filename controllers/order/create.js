'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const Order = AV.Object.extend('Order')

const create = function*() {
	let data = this.request.body
  if(!data.address || !data.areaCode || !data.timeSlot || !data.userName){
  	throw new APIError('Incompelete Information', '请完整填写信息')
  	return
  }
  // 验证用户是否登录
  if (!this.session.userId) {
  	throw new APIError('Unlogged', '用户未登录')
  	return
  }

  // 验证是否存在未完成订单
  let user = AV.Object.createWithoutData('_User', this.session.userId)
  let query = new AV.Query('Order')
  query.equalTo('user', user)
  query.lessThan('status', 10)
  let check
  try {
    check = yield query.find()
  } catch(e) {
    throw new APIError('DB Error', e.message)
    return
  }
  
  if(check.length > 0){
    throw new APIError('Invalid', '您当前的订单还未完成')
    return
  }

  let order = new Order()
  order.set('address', data.address)
  order.set('userName', data.userName)
  order.set('timeSlot', data.timeSlot)
  order.set('areaCode', data.areaCode)
  order.set('status', 0)
  order.set('price', '90.00')
  
  order.set('payment', '货到付款')
  order.set('confirmedAt', null)
  order.set('receivedAt', null)
  order.set('finishedAt', null)

  let userPhone = data.userPhone
  ? data.userPhone
  : currentUser.get('mobilePhoneNumber')
  order.set('userPhone', userPhone)

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