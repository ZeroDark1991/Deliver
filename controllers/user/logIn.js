'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const logIn = function*() {
  let req = this.request.body
  if(!req.phoneNumber || !req.verifyCode) {
  	throw new APIError('LogIn Failed', '请完整填写登录信息')
  	return
  }

  let user
  try{
  	user = yield AV.User.signUpOrlogInWithMobilePhone(req.phoneNumber, req.verifyCode)
  } catch(e) {
    throw new APIError('login failed', e.message)
    return
  }
  this.session.userId = user.id
  this.body = {
  	success: true,
  	message: '登录成功',
  	user: user
  }
}

module.exports = logIn
