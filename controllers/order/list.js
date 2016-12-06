'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const Order = AV.Object.extend('Order')
const _ = require('lodash')

const list = function*() {
  let params = this.query
  console.log(params)
  let query = new AV.Query('Order')
  let result
  if(params.type) {
    switch(params.type) {
  	  case '0':
  	    query.lessThanOrEqualTo('status', 0)
  	    break
  	  case '1':
  	    query.equalTo('status', 1)
    }
  }
  query.select(['address', 'timeSlot'])

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
}

module.exports = list
