'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const verifyCode = function*() {
	let req = this.request.body
  if(!req.phoneNumber){
  	throw new APIError('Send SmsCode Failed', '请输入合法手机号')
  	return
  }	
  try{
  	yield AV.Cloud.requestSmsCode(req.phoneNumber)
  }	catch(e) {
  	throw new APIError('Sending SmsCode Failed', e.message)
  	return
  }

  this.body = {
    success: true,
    message: '短信发送成功'
  }
}

module.exports = verifyCode
