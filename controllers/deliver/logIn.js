'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')
const Deliver = AV.Object.extend('Deliver')

const logIn = function*() {
  let data = this.request.body
  if(!data.phoneNumber || !data.passWord) {
  	throw new APIError('incomplete information', '请完整填写信息')
		return
  }

  const query = new AV.Query('Deliver')
  query.equalTo('phoneNumber', data.phoneNumber)
  let result
  try {
  	result = yield query.first()
  } catch(e) {
  	throw new APIError('DB error', e.message)
  	return
  }

  if(result && result.get('passWord') === data.passWord) {
  	this.session.deliverId = result.id
  	this.body = {
  		success: true,
  		message: '登录成功',
      deliver: {
        id: result.id,
        phoneNumber: result.get('phoneNumber'),
        name: result.name
      }
  	}
  } else {
  	this.body = {
  		success: false,
  		message: '账号不存在或密码错误'
  	}
  }
}

module.exports = logIn