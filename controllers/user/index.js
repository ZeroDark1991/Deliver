'use strict'
const AV = require('leanengine')
const APIError = require('../../config/apiError')

exports.logIn = function*() {
  let req = this.request.body
  if(!req.phoneNumber || !req.verifyCode){
  	throw new APIError('login failed', '请完整填写登录信息')
  	return
  }

  let user
  try{
  	user = yield AV.User.signUpOrlogInWithMobilePhone(req.phoneNumber, req.verifyCode)
  } catch(e) {
    throw new APIError('login failed', e.message)
    return
  }
  this.res.saveCurrentUser(user)
  this.body = {
  	success: true,
  	message: '登录成功',
  	user: user
  }
}

exports.verifyCode = function*() {
	let req = this.request.body
  if(!req.phoneNumber){
  	throw new APIError('Send SmsCode Failed', '请输入合法手机号')
  	return
  }	
  try{
  	AV.Cloud.requestSmsCode(req.phoneNumber)
  }	catch(e) {
  	throw new APIError('Sending SmsCode Failed', e.message)
  }

  this.body = {
    success: true,
    message: '短信发送成功'
  }
}
