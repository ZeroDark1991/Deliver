'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

/**
 * 员工端接收气罐
 */

const recieveTank = function*() {
  let data = this.request.body
  // 校验
  if(!data.id) {
  	throw new APIError('incomplete information', '请传入订单ID')
  	return
  }
  
  let query = new AV.Query('Order')
  try {
    let check = yield query.get(data.id)
    if( !check || check.get('status') != 1 ) {
    	throw new APIError('', '此订单状态不支持当前操作')
    } else {
      // 解除用户与气罐的关联
      let userId = check.get('user').id
      let user = AV.Object.createWithoutData('_User', userId)
      user.set('tank', null)
      
      try {
        yield user.save()
      } catch(e) {
        throw new APIError('', e.message)
      }
    }
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  // 更新
  let update = AV.Object.createWithoutData('Order', data.id)
  update.set('status', 2)
  try {
  	yield update.save()
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  this.body = {
  	success: true,
  	message: '操作成功，已取罐'
  }
}

module.exports = recieveTank
