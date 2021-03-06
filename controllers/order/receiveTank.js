'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

/**
 * 员工端接收气罐
 */

const receiveTank = function*() {
  let data = this.request.body
  // 校验
  if(!data.id) {
  	throw new APIError('Incompelete Information', '请传入订单ID')
  	return
  }
  
  let query = new AV.Query('Order')
  try {
    let check = yield query.get(data.id)
    if( !check || check.get('status') != 1 ) {
    	throw new APIError('Invalid', '此订单状态不支持当前操作')
      return
    }
    if(({}).toString.call(data.tank) === '[object Array]') {
      // 解除用户与气罐的关联
      let tankArr = data.tank
      let userId = check.get('user').id
      let user = AV.Object.createWithoutData('_User', userId)
      
      tankArr.forEach(tank => {
        let tarTank = AV.Object.createWithoutData('Tank', tank)
        user.remove('tank', tarTank)
        tarTank.set('user', null)
      })
      
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
  let date = new Date()
  update.set('status', 2)
  update.set('receivedAt', date)
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

module.exports = receiveTank
