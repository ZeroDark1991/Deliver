'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

/**
 * 员工端完成订单
 */

const finish = function*() {
  let data = this.request.body
  console.log(data)
  // 校验
  if(!data.id) {
  	throw new APIError('Incompelete Information', '请传入订单ID')
  	return
  }
  
  let query = new AV.Query('Order')
  try {
    let check = yield query.get(data.id)
    if( !check || check.get('status') != 2 ) {
    	throw new APIError('', '此订单状态不支持当前操作')
    } else if(data.tank) {
      // 用户与气罐关联
      if(({}).toString.call(data.tank) === '[object Array]' && data.tank.length > 0) {
      	let tank = data.tank
	      let userId = check.get('user').id
	      let user = AV.Object.createWithoutData('_User', userId)

	      let tankQuery = new AV.Query('Tank')
	      let signId = tank.signId.replace(' ', '')
	      tankQuery.equalTo('signId', signId)
	      let tank = yield tankQuery.first()
	      if(tank){
	        if(tank.longitude && tank.latitude) {
	          tank.set('longitude', tank.longitude)
	          tank.set('latitude', tank.latitude)
	          let date = new Date()
	          tank.set('updateLocationAt', date)
	          yield tank.save()
	        }
	        user.set('tank', tank)      
	      	yield user.save()
	      }
      }
    }
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

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