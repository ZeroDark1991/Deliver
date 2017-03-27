'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

/**
 * 用户端确定完成订单
 */

const finish = function*() {
  let data = this.request.body
  // 校验
  if(!data.id) {
    throw new APIError('Incompelete Information', '请传入订单ID')
    return
  }
  
  // let query = new AV.Query('Order')
  // try {
  // 	let check = yield query.first()
  // 	if(!check) {
  // 		throw new APIError('', '订单不存在')
  // 	}
  // } catch(e) {
  //   throw new APIError('DB Error', e.message)
  //   return
  // }

  // 更新
  let update = AV.Object.createWithoutData('Order', data.id)
  let date = new Date()
  update.set('status', 10)
  update.set('finishedAt', date)
  
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
