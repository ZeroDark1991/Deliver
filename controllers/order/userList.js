'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

/**
 * Method: GET
 * @params:
 *    type: 0:当前订单 1: 历史订单
 */

const userList = function*() {

  let currentUser = AV.User.current()
  if (!currentUser) {
  	throw new APIError('Unlogged', '用户未登录')
  	return
  }

  let params = this.query
  let type = params.type || '1'
  let query = new AV.Query('Order')
  let user = AV.Object.createWithoutData('_User', currentUser.id)
  query.equalTo('user', user)
  
  if(type == '0') {
    query.lessThan('status', 10)
    query.select(['address', 'status', 'timeSlot', 'deliver'])
  } else if(type == '1') {
    query.equalTo('status', 10)
    query.select(['address', 'status', 'timeSlot'])
  } else {
  	throw new APIError('Invalid Type', 'type值不合法')
  	return
  }

  let result
  try {
  	result = yield query.find()
  } catch(e) {
    throw new APIError('DB Error', e.message)
    return
  }
  
  this.body = {
  	success: true,
  	list: result
  }
}

module.exports = userList
