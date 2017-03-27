'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const formatDate = require('../util/formatDate')

/*
 * 订单fetch
 * @query params
 *    type: [String]
 *      0: 未接订单 + 被取消订单
 *      1: 已确认的订单 【 赶往用户路上 】
 *      2: 装配中
 *      10: 已完成订单
 *    areaCodes: [String]
 *      多选areaCode 筛选地区
 *      - 分隔 areaCode
 *      如：'0-1-2-3'
 *      
 */

const deliverList = function*() {
  let params = this.query
  let result
  let headers = this.headers

  if(params.type && params.type != '0') { 
    // 查询过往订单 或已确认的订单
    if(!headers.deliver) {
      throw new APIError('session lost', 'session 失效，重新登录')
      return
    }

    let query = new AV.Query('Order')
    switch(params.type) {
  	  case '1':
  	    query.equalTo('status', 1)
  	    break
      case '2':
        query.equalTo('status', 2)
        break
      case '10':
        query.equalTo('status', 10)
        break        
    }
    let deliver = AV.Object.createWithoutData('Deliver', headers.deliver)
    query.equalTo('deliver', deliver)
    query.ascending('timeSlot') // 按预约时间升序
    query.include('user')

    try {
  	  result = yield query.find()
    } catch(e) {
  	  throw new APIError('DB Error', '数据库查询失败')
  	  return
    }
    let list = result.map(order => {
      let user = order.get('user')
      let u = null
      if(user) {
        u = {
          objectId: user.id,
          phoneNumber: user.get('mobilePhoneNumber')
        }
      }
      let confirmedAt = order.get('confirmedAt') ? formatDate(order.get('confirmedAt')) : ''
      let receivedAt = order.get('receivedAt') ? formatDate(order.get('receivedAt')) : ''
      let finishedAt = order.get('finishedAt') ? formatDate(order.get('finishedAt')) : ''    
      let handler = {
        address: order.get('address'),
        userName: order.get('userName'),
        status: order.get('status'),
        amount: order.get('amount'),
        timeSlot: order.get('timeSlot'),
        payment: order.get('payment'),
        price: order.get('price'),
        createdAt: formatDate(order.createdAt),
        confirmedAt: confirmedAt,
        receivedAt: receivedAt,
        finishedAt: finishedAt,
        user: u,
        objectId: order.id
      }
      return handler
    })

    this.body = {
  	  success: true,
      message: '成功',
  	  list: list
    }

  } else if (params.type == '0') {
    // 查询未接订单 可传入areaCodes 指明筛选的区域
    let areaCodes = params.areaCodes && params.areaCodes.split('-')
    if( areaCodes && areaCodes.length > 0 ){
      // 数组存在
      let options = areaCodes.map(item => {
        let query = new AV.Query('Order')
        query.equalTo('areaCode', item)
        query.equalTo('status', 0) //** 届时改为>-2 and <=0
        query.ascending('timeSlot') // 按预约时间升序
        query.include('user')

        return query
      })

      let query = AV.Query.or.apply(AV.Query, options)
      // query.select(['address', 'status', 'timeSlot', 'user'])
      try {
        result = yield query.find()
      } catch(e) {
        throw new APIError('DB Error', e.message)
        return
      }
    } else {
      // 默认全选
      let query = new AV.Query('Order')
      query.equalTo('status', 0) //** 届时改为>-2 and <=0
      query.ascending('timeSlot') // 按预约时间升序
      query.include('user')
      // query.select(['address', 'status', 'timeSlot', 'user'])

      try {
        result = yield query.find()
      } catch(e) {
        throw new APIError('DB Error', e.message)
        return
      }
    }

    let list = result.map(order => {
      let user = order.get('user')
      let confirmedAt = order.get('confirmedAt') ? formatDate(order.get('confirmedAt')) : ''
      let receivedAt = order.get('receivedAt') ? formatDate(order.get('receivedAt')) : ''
      let finishedAt = order.get('finishedAt') ? formatDate(order.get('finishedAt')) : ''
      let handler = {
        address: order.get('address'),
        userName: order.get('userName'),
        status: order.get('status'),
        amount: order.get('amount'),
        timeSlot: order.get('timeSlot'),
        payment: order.get('payment'),
        price: order.get('price'),
        createdAt: formatDate(order.createdAt),
        confirmedAt: confirmedAt,
        receivedAt: receivedAt,
        finishedAt: finishedAt,
        user: {
          objectId: user.id,
          phoneNumber: user.get('mobilePhoneNumber')
        },
        objectId: order.id
      }
      return handler
    })

    this.body = {
      success: true,
      message: '成功',
      list: list
    }    

  } else {
    throw new APIError('Incompelete Information', '请传入正确的参数')
    return
  }
}

module.exports = deliverList
