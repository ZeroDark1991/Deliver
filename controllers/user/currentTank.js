'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const currentTank = function*() {
  // 验证用户是否登录
  let currentUser = AV.User.current()
  if (!currentUser) {
  	throw new APIError('Unlogged', '用户未登录')
  	return
  }

  let query = new AV.Query('_User')
  let result
  try {
  	result = yield query.get(currentUser.id)
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
