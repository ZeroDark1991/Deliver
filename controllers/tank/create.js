'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const Tank = AV.Object.extend('Tank')

const create = function*() {
  const tank = new Tank()
  const data = this.request.body
  if(!data.signId) {
  	throw new APIError('incomplete information', '请传入合法ID')
  	return
  }
  let check = new AV.Query('Tank')
  check.equalTo('signId', data.signId)
  try {
  	let result = yield check.first()
  	if(result) {
  		throw new APIError('', '重复的气罐')
  		return
  	}
  } catch(e) {
    throw new APIError('DB Error', e.message)
  }

  tank.set('signId', data.signId)
  try {
  	yield tank.save()
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  this.body = {
  	success: true,
  	message: '气罐信息录入成功'
  }
}

module.exports = create
