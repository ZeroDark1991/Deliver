'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

/**
 * 员工端完成订单
 */

const finish = function*() {
  let data = this.request.body
  // 校验
  if(!data.id) {
  	throw new APIError('incomplete information', '请传入订单ID')
  	return
  }
  
  let query = new AV.Query('Order')
  try {
    let check = yield query.get(data.id)
    if( !check || check.get('status') != 2 ) {
    	throw new APIError('', '此订单状态不支持当前操作')
    }
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  // 更新
  let update = AV.Object.createWithoutData('Order', data.id)
  update.set('status', 10)
  try {
  	yield update.save()
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  this.body = {
  	success: true,
  	message: '操作成功，订单完成'
  }
}

module.exports = finish
