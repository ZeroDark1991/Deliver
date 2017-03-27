'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

/**
 * 用户端取消订单
 */

const cancel = function*() {
  let data = this.request.body
  // 校验
  if(!data.id) {
  	throw new APIError('Incompelete Information', '请传入订单ID')
  	return
  }
  
  let query = new AV.Query('Order')
  // try {
  //   let check = yield query.get(data.id)
  //   if( !check || check.get('status') != 1 ) {
  //   	throw new APIError('', '此订单状态不支持当前操作')
  //   }
  // } catch(e) {
  // 	throw new APIError('DB Error', e.message)
  // 	return
  // }
  
  let update = AV.Object.createWithoutData('Order', data.id)
  update.set('status', -2)
  try {
  	yield update.save()
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  this.body = {
  	success: true,
  	message: '操作成功，已取消订单'
  }
}

module.exports = cancel
