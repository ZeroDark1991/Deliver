'use strict'
const APIError = require('../../config/apiError')

module.exports = function*() {
	if(this.session.deliverId){
		this.session.deliverId = ''
		this.body = {
			success: true,
			message: '成功退出登录'
		}
	}else {
		this.body = {
			success: true,
			message: '已经是未登录的状态'
		}
	}
}