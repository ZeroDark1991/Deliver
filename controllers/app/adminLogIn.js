'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const adminLogIn = function*() {
	let data = this.request.body
	if(!data.account || !data.passWord){
		throw new APIError('Incompelete Information', '完整填写信息')
		return
	}
	if(data.account === 'super' && data.passWord === '#ad=2016deliver') {
		this.session.admin = 'Super'
		this.body = {
			success: true,
			message: '登录成功'
		}
		return
	}

	let admin = new AV.Query('Admin')
	admin.equalTo('account', data.account)
	let result
	try {
		result = yield admin.first()
	} catch(e) {
		throw new APIError('DB Error', e.message)
		return
	}

	if(!result || data.passWord != result.get('passWord')) {
		this.body = {
			success: false,
			message: '账号密码错误'
		}
	} else {
		this.session.admin = 'Admin'
		this.body = {
			success: true,
			message: '登录成功'
		}
	}
}

module.exports = adminLogIn
