'use strict'
const AV = require('leanengine')
const APIError = require('../../config/apiError')

/**
 * Method: GET 单条订单详情
 * @params:
 *    id: 订单id
 */

const info = function*() {
  let params = this.query
  if(!params.id) {
  	throw new APIError('Incompelete Information', '请传入订单ID')
  	return
  }

  let result
  let query = new AV.Query('Order')
  query.include('user')
  query.select(['address', 'status', 'timeSlot', 'user'])

  try {
  	result = yield query.get(params.id)
  }
  catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  let user = result.get('user')
  this.body = {
  	success: true,
  	message: '成功',
  	info: {
  		address: result.get('address'),
  		status: result.get('status'),
  		timeSlot: result.get('timeSlot'),
  		objectId: result.id,
      createdAt: result.createdAt,
      confirmedAt: result.get('confirmedAt'),
      receivedAt: result.get('receivedAt'),
      finishedAt: result.get('finishedAt'),
  		user: {
  			objectId: user.id,
  			phoneNumber: user.get('mobilePhoneNumber')
  		}
  	}
  }
  
}

module.exports = info
