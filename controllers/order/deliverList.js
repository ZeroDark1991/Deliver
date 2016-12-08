'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const _ = require('lodash')

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

  if(params.type && params.type != '0') {
    // 查询过往订单 或已确认的订单

    if(!this.session.deliverId) {
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
    let deliver = AV.Object.createWithoutData('Deliver', this.session.deliverId)
    query.equalTo('deliver', deliver)
    query.select(['address', 'status', 'timeSlot'])

    try {
  	  result = yield query.find()
    } catch(e) {
  	  throw new APIError('DB Error', '数据库查询失败')
  	  return
    }
    this.body = {
  	  success: true,
  	  list: result
    }

  } else if (params.type == '0') {
    // 查询未接订单 可传入areaCodes 指明筛选的区域
    let areaCodes = params.areaCodes.split('-')
    if( _.isArray(areaCodes) && areaCodes.length > 0 ){
      // 数组存在
      let options = areaCodes.map(item => {
        let query = new AV.Query('Order')
        query.equalTo('areaCode', item)
        query.lessThanOrEqualTo('status', 0)
        return query
      })

      let query = AV.Query.or.apply(AV.Query, options)
      query.select(['address', 'status', 'timeSlot'])
      try {
        result = yield query.find()
      } catch(e) {
        throw new APIError('DB Error', e.message)
        return
      }
    } else {
      // 默认全选
      let query = new AV.Query('Order')
      query.lessThanOrEqualTo('status', 0)
      try {
        result = yield query.find()
      } catch(e) {
        throw new APIError('DB Error', e.message)
        return
      }
    }

    this.body = {
      success: true,
      list: result
    }    

  } else {
    throw new APIError('incomplete information', '请传入正确的参数')
    return
  }

}

module.exports = deliverList
