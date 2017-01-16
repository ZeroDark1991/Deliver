'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

/**
 * Method: GET
 */

const list = function*() {

  let params = this.query

  let query = new AV.Query('Order')
  query.include('user')
  if(params.userId){
    let user = AV.Object.createWithoutData('_User', params.userId)
    query.equalTo('user', user)
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
      let u = order.get('user')
      let user = null
      if(u) {
        user =  {
          objectId: u.id,
          phoneNumber: u.get('mobilePhoneNumber')
        }
      }
      let confirmedAt = order.get('confirmedAt') || ''
      let receivedAt = order.get('receivedAt') || ''
      let finishedAt = order.get('finishedAt') || ''    
      return {
        objectId: order.id,
        timeSlot: order.get('timeSlot'),
        address: order.get('address'),
        amount: order.get('amount'),
        areaCode: order.get('areaCode'),
        status: order.get('status'),
        userPhone: order.get('userPhone'),
        userName: order.get('userName'),
        price: order.get('price'),
        payment: order.get('payment'),
        createdAt: order.createdAt,
        confirmedAt: confirmedAt,
        receivedAt: receivedAt,
        finishedAt: finishedAt,
        user: user
      }
    }) 
  } catch(e) {
    throw new APIError('', e.message)
    return
  }

  this.body = {
  	success: true,
    message: '成功',
  	list: list
  }
}

module.exports = list
