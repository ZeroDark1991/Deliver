'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const info = function*() {
  // 验证用户是否登录
  let currentUser = AV.User.current()
  if (!currentUser) {
  	throw new APIError('Unlogged', '用户未登录')
  	return
  }

  let user = new AV.Query('_User')
  user.select(['username', 'tank', 'mobilePhoneNumber', 'address', 'areaCode'])

  let result
  try {
    result = yield user.get(currentUser.id)
  } catch(e) {
  	throw new APIError('DB Error', e.message)
  }

  this.body = {
  	success: true,
  	user: result
  }
}

module.exports = info
