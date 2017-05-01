'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const Moment = require('moment')

const list = function*() {

  let params = this.query
  if(!params.date){
    throw new APIError('Incompelete Information', '输入查找的月份')
    return
  }

  let deliverResult
  if(params.phone) { 
    try {
      let deliverQuery = new AV.Query('Deliver')
      deliverQuery.equalTo('phoneNumber', params.phone)
      let deliver = yield deliverQuery.first()
      if(!deliver) {
        throw new APIError('Incompelete Information', '未找到对应的员工')
        return
      }
      deliverResult = deliver
    } catch(e) {
      throw new APIError('DB error', e.message)
      return
    }
  }

  let startDateQuery = new AV.Query('ScanRecord')
  startDateQuery.greaterThanOrEqualTo('createdAt', new Date(Number(params.date)))

  let endDateQuery = new AV.Query('ScanRecord')
  endDateQuery.lessThan('createdAt', new Date(Moment(Number(params.date)).endOf('month')))

  let detailQuery = new AV.Query('ScanRecord')
  let deliverPointer = AV.Object.createWithoutData('Deliver', deliverResult.id);  
  detailQuery.equalTo('deliver', deliverPointer)
  detailQuery.include('deliver')
  detailQuery.include('tank')
  let query = AV.Query.and(startDateQuery, endDateQuery, detailQuery)
  query.limit('1000')
  let result
  try {
    result = yield query.find()
  } catch(e) {
    throw new APIError('DB Error', e.message)
    return
  }
  this.body = {
  	success: true,
  	message: '成功',
  	list: result,
    deliver: {
      phoneNumber: deliverResult.get('phoneNumber'),
      name: deliverResult.get('name'),
      id: deliverResult.id
    }
  }
}

module.exports = list
