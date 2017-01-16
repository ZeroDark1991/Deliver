'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

/**
 * Method: GET
 * @params:
 *    type: 0:当前订单 1: 历史订单
 */

const userList = function*() {

  let params = this.query
  let id
  if (!this.session.userId) {
    if(params.id){
      id = params.id
    } else {
    	throw new APIError('Unlogged', '用户未登录')
    	return
    }
  } else {
    id = this.session.userId
  }

  let type = params.type || '1'
  let query = new AV.Query('Order')
  let user = AV.Object.createWithoutData('_User', id)
  query.equalTo('user', user)
  query.include('deliver')
  
  if(type == '0') {
    query.lessThan('status', 10)
    // query.select(['address', 'status', 'timeSlot', 'deliver'])
  } else if(type == '1') {
    query.equalTo('status', 10)
    // query.select(['address', 'status', 'timeSlot'])
  } else {
  	throw new APIError('Invalid Type', 'type值不合法')
  	return
  }

  let result
  try {
    query.descending('createdAt')
  	result = yield query.find()
  } catch(e) {
    throw new APIError('DB Error', e.message)
    return
  }

  let list
  try{
    list = result.map(order => {
      let d = order.get('deliver')
      console.log(d)
      let deliver = null
      if(d) {
        deliver =  {
          objectId: d.id,
          name: d.get('name'),
          phoneNumber: d.get('phoneNumber')
        }
      }
      let confirmedAt = order.get('confirmedAt') || ''
      let receivedAt = order.get('receivedAt') || ''
      let finishedAt = order.get('finishedAt') || ''    
      return {
        objectId: order.id,
        timeSlot: order.get('timeSlot'),
        address: order.get('address'),
        areaCode: order.get('areaCode'),
        amount: order.get('amount'),
        status: order.get('status'),
        userPhone: order.get('userPhone'),
        userName: order.get('userName'),
        price: order.get('price'),
        payment: order.get('payment'),
        createdAt: order.createdAt,
        confirmedAt: confirmedAt,
        receivedAt: receivedAt,
        finishedAt: finishedAt,
        deliver: deliver
      }
    }) 
  } catch(e) {
    throw new APIError('', e.message)
    return
  }

  this.body = {
  	success: true,
  	list: list
  }
}

module.exports = userList
