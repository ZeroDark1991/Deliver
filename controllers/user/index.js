'use strict'
const AV = require('leanengine')
const APIError = require('../../config/apiError')

exports.logIn = function*() {
  let req = this.request.body
  if(!req.phone || !req.verifyCode){
  	throw new APIError('login failed', '请完整填写登录信息')
  	return
  }

  let user
  try{
  	user = yield AV.User.signUpOrlogInWithMobilePhone(req.phone, req.verifyCode)
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
  try{
  	let res = yield AV.Cloud.requestSmsCode('13588277370')
  	this.body = res
  }	catch(e) {
  	console.log(e)
  }
}