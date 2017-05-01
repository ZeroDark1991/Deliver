'use strict'

const AV = require('leanengine')
const APIError = require('../../config/apiError')

const adminLevel = function*() {
	if(!this.session.admin) {
		this.body = {
			success: false,
			message: '未登录'
		}
		return
	}

	if(this.session.admin === 'Super') {
		this.body = {
			success: true,
			type: 'Super',
			message: '超级管理员'
		}
		return
	}

	if(this.session.admin === 'Admin') {
		this.body = {
			success: true,
			type: 'Admin',
			message: '普通管理员'
		}
	}	
}

module.exports = adminLevel
