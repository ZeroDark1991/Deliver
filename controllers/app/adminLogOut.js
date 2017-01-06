'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const adminLogIn = function*() {
	this.session.admin = null
	this.body = {
		success: true,
		message: '退出登录成功'
	}
}

module.exports = adminLogIn
