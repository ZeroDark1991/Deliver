'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const currentTank = function*() {
  // 验证用户是否登录
  if (!this.session.userId) {
  	throw new APIError('Unlogged', '用户未登录')
  	return
  }

  let query = new AV.Query('_User')
  let result
  try {
  	result = yield query.get(this.session.userId)
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  this.body = {
    success: true,
    tank: result.tank ? result.tank : null
  }
  
}

module.exports = currentTank
