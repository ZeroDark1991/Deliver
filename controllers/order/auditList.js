'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const aduitList = function*() {

  let params = this.query
  let query = new AV.Query('Order')
  query.equalTo('audit', 1)
  query.equalTo('status', 2)
  query.include('deliver')
  // query.include('user')

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
        audit: order.get('audit'),
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

module.exports = aduitList
