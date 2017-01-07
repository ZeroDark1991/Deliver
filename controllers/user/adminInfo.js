'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const info = function*() {
  // 验证用户是否登录
  let params = this.query
  if(!params.id){
  	throw new APIError('Incompelete Information', '传入用户Id')
  	return
  }

  let user = new AV.Query('_User')
  // user.select(['username', 'mobilePhoneNumber', 'address', 'areaCode', 'nickname'])
  user.include('tank')

  let result
  try {
    result = yield user.get(params.id)
  } catch(e) {
  	throw new APIError('DB Error', e.message)
    return
  }

  this.body = {
  	success: true,
  	message: '成功',
  	user: result
  }
}

module.exports = info
