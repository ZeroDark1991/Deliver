'use strict'
const AV = require('leanengine')
const APIError = require('../../config/apiError')
const formatDate = require('../util/formatDate')

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
  // query.select(['address', 'status', 'timeSlot', 'user'])

  try {
  	result = yield query.get(params.id)
  }
  catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  let user = result.get('user')
  let confirmedAt = result.get('confirmedAt') ? formatDate(result.get('confirmedAt')) : ''
  let receivedAt = result.get('receivedAt') ? formatDate(result.get('receivedAt')) : ''
  let finishedAt = result.get('finishedAt')  ? formatDate(result.get('finishedAt')) : '' 
  let u = null
  if(user) {
    u = {
      objectId: user.id,
      phoneNumber: user.get('mobilePhoneNumber')
    }
  }  
  this.body = {
  	success: true,
  	message: '成功',
  	info: {
  		address: result.get('address'),
      userName: result.get('userName'),
  		status: result.get('status'),
  		timeSlot: result.get('timeSlot'),
      payment: result.get('payment'),
      price: result.get('price'),
  		objectId: result.id,
      createdAt: formatDate(result.createdAt),
      confirmedAt: confirmedAt,
      receivedAt: receivedAt,
      finishedAt: finishedAt,
  		user: u
  	}
  }
  
}

module.exports = info
