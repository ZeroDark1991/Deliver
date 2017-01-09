'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const info = function*() {
  // 验证用户是否登录
  if (!this.session.userId) {
  	throw new APIError('Unlogged', '用户未登录')
  	return
  }

  let user = new AV.Query('_User')

  let result
  try {
    result = yield user.get(this.session.userId)
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  	return
  }

  this.body = {
  	success: true,
  	user: result
  }
}

module.exports = info
