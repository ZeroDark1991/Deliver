'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const adminLogIn = function*() {
	let data = this.request.body
	if(!data.userName || !data.passWord){
		throw new APIError('Incompelete Information', '完整填写信息')
		return
	}
	if(data.passWord !== '#ad=2016deliver'){
		throw new APIError('Invalid Password', '密码错误')
		return
	}

	this.session.admin = 'SuperMan'
	this.body = {
		success: true,
		message: '登录成功'
	}
}

module.exports = adminLogIn
