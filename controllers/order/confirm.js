'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

/**
 * 员工端确认订单
 */

const confirm = function*() {
  let data = this.request.body

  // 校验
  if(!data.id) {
  	throw new APIError('incomplete information', '请传入订单ID')
  	return
  }

  if(!this.session.deliverId) {
  	throw new APIError('session lost', 'session 失效，重新登录')
  	return
  }

  let query = new AV.Query('Order')
  try {
    let check = yield query.get(data.id)
    if( check.get('status') > 0 ) {
    	throw new APIError('Invalid', '此订单已经被确认')
    } else if( !check ) {
    	throw new APIError('Invalid', '订单不存在')
    }
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  // 更新
  let update =  AV.Object.createWithoutData('Order', data.id)
  let deliver =  AV.Object.createWithoutData('Deliver', this.session.deliverId)
  update.set('status', 1)
  update.set('deliver', deliver)

  try {
  	yield update.save()
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  this.body = {
  	success: true,
  	message: '订单已经被确认'
  }
}

module.exports = confirm
